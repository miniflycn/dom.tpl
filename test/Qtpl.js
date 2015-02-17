var QTpl = require('../Qtpl');

describe('Qtpl', function () {
  it('should able to render a template', function () {
    QTpl('<a href="javascript:void(0)" q-text="test"></a>')({ test: 'test' })
      .should.equal('<a href="javascript:void(0)" q-text="test">test</a>');
  });

  it('should not throw a error when data undefined', function () {
    QTpl('<a href="javascript:void(0)" q-text="test"></a>')()
      .should.equal('<a href="javascript:void(0)" q-text="test"></a>');
  });

  it('should able to use filter', function () {
    QTpl('<a href="javascript:void(0)" q-text="name | prependHello"></a>')(
      { name: 'Daniel' },
      { filters: { prependHello: function (str) { return 'Hello ' + str; } } }
      ).should.equal('<a href="javascript:void(0)" q-text="name | prependHello">Hello Daniel</a>')
  });

  it('should able to deal with custom element', function () {
    QTpl('<test></test>', {
      oncustomElement: function (elem) {
        if (elem.name === 'test') {
          return '<a href="javascript:void(0)" q-text="test"></a>'
        }
      }
    })({ test: 'test' }).should.equal('<a href="javascript:void(0)" q-text="test">test</a>');
  });
});