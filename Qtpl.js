var DOMTpl = require('./')
  , extend = require('./lib/extend')
  , htmlparser = require('htmlparser2')
  , DomUtils = htmlparser.DomUtils
  , mTpl = require('micro-tpl');

var domTpl = new DOMTpl({
  get: function (value) {
    return 'it.' + value;
  },
  applyFilters: function (filters, value) {
    var args, foo;
    if (filters.length) {
      filters.forEach(function (filter) {
        args = filter.split(/ +/);
        foo = args.shift()
        value = [
          value
        ];
        args = args.map(function (arg) {
          return "\'" + arg + "\'";
        });
        args.unshift(1, 0);
        value.splice.apply(value, args);
        value = 'opt.filters.' + foo + '(' + value.join(', ') + ')';
      })
    }
    return value;
  },
  directives: {
    'text': function (value) {
      var dom = htmlparser.parseDOM('{{=' + value + '}}');
      DomUtils.appendChild(this.el, dom[0]);
    }
  }
});

module.exports = function (str, options) {
  return mTpl(
    domTpl.tpl(
      str
    ).replace(/\{\{/g, '<%').replace(/\}\}/g, '%>'),
    extend({ ret: 'function' }, options)
  );
};