var htmlparser = require('htmlparser2')
  , DomUtils = htmlparser.DomUtils
  , parser = require('./lib/parser')
  , extend = require('./lib/extend')
  , isCustom = require('./lib/custom')
  , G_OPTIONS = {
    get: function (value) {
      return value;
    },
    applyFilters: function (filters, value, options) {
      var args, foo;
      if (filters.length) {
        filters.forEach(function (filter) {
          args = filter.split(/ +/);
          foo = args.shift();
          if (options.filters[foo]) {
            value = [value]
            value.push.apply(value, args);
            value = options.filters[foo].apply(this, value);
          } else {
            value = [
              value
            ];
            args = args.map(function (arg) {
              return "\'" + arg + "\'";
            });
            args.unshift(1, 0);
            value.splice.apply(value, args);
            value = foo + '(' + value.join(', ') + ')';
          }
        })
      }
      return value;
    }
  };

function transformEle(elem, oncustomElement) {
  var tmp;
  if (!oncustomElement) return elem;
  if (isCustom(elem.name)) {
    tmp = oncustomElement(elem);
    if (elem === tmp) return elem;
    typeof tmp === 'string' &&
      (tmp = new htmlparser.parseDOM(tmp)[0]);
    DomUtils.replaceElement(elem, tmp);
    return transformEle(tmp, oncustomElement);
  } else {
    return elem;
  }
}

function find(foo, elems) {
  var childs, elem, tmp;
  for (var i = 0, j = elems.length; i < j; i++) {
    elem = elems[i];
    if (elem.type === 'tag') {
      elem =  transformEle(elem, this.oncustomElement);
      if (!foo(elem)) {
        childs = elem.children;
        childs &&
          find.call(this, foo, childs);
      }
    }
  }
}

function DOMTpl(options) {
  var DEFAULT = extend({}, G_OPTIONS, options);
  this.tpl = function (string, options) {
    options = extend({}, DEFAULT, options);
    var dom = new htmlparser.parseDOM('<div>' + string + '</div>')
      , prefix = options.prefix || DEFAULT.prefix || 'q-'
      , start = prefix.length
      , directives = extend({}, options.directives, DEFAULT.directives)
      , filters = extend({}, options.filters, DEFAULT.filters);

    // attched domCreated event
    options.domCreated && options.domCreated(dom);

    find.call(options, function (ele) {
      var attribs = Object.keys(ele.attribs);
      attribs
        .filter(function (key) {
          if (key.indexOf(prefix) === 0)
            return true;
        }).forEach(function (key) {
          var name = key.substring(start)
            , descriptor = parser(ele.attribs[key])
            , directive = directives[name]
            , value;
          if (directive) {
            value = directive.get ?
              directive.get(descriptor.exp) :
              options.get(descriptor.exp);
            value = directive.applyFilters ?
              directive.applyFilters(descriptor.filters, value, options) :
              options.applyFilters(descriptor.filters, value, options);
            (directive.update || directive).call({
              el: ele
            }, value, descriptor.arg);
          }
        });
      return ~attribs.indexOf(prefix + 'repeat');
    }, dom);
    return DomUtils.getOuterHTML(dom[0].children[0]);
  };
}

module.exports = DOMTpl;