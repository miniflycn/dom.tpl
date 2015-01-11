var DOMTpl = require('./')
  , extend = require('./lib/extend')
  , htmlparser = require('htmlparser2')
  , DomUtils = htmlparser.DomUtils
  , mTpl = require('micro-tpl');

function postFix(value) {
  return value.indexOf('!') === 0 ?
    '$!{' + value.substring(1) + '}' :
    '${' + value + '}';
}

var domTpl = new DOMTpl({
  directives: {
    'text': function (value) {
      value = postFix(value);
      var dom = htmlparser.parseDOM(value);
      DomUtils.appendChild(this.el, dom[0]);
    },
    'value': function (value) {
      this.el.attribs.value = postFix(value);
    }
  },
  filters: {
    '!': function (value) {
      return '!' + value;
    }
  }
});

module.exports = function (str, options) {
  return domTpl.tpl(str, options);
};