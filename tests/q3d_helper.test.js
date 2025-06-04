const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createDummy() {
  return new Proxy(function () {}, {
    get: () => createDummy(),
    apply: () => createDummy(),
    construct: () => createDummy(),
  });
}

describe('Q3D.E', () => {
  beforeAll(() => {
    const context = {
      window: {
        navigator: { userAgent: '' },
        location: { href: '', search: '', hash: '' },
        setTimeout: () => {},
        addEventListener: () => {},
        devicePixelRatio: 1,
        document,
      },
      document,
      CanvasRenderingContext2D: function () {},
      THREE: new Proxy({}, { get: () => createDummy() }),
    };
    context.window.document = document;
    vm.createContext(context);
    const code = fs.readFileSync(path.join(__dirname, '..', 'Qgis2threejs.js'), 'utf8');
    vm.runInContext(code, context);
    global.Q3D = context.Q3D;
  });

  test('returns element by ID', () => {
    document.body.innerHTML = '<div id="foo"></div>';
    const el = Q3D.E('foo');
    expect(el).not.toBeNull();
    expect(el.id).toBe('foo');
  });
});
