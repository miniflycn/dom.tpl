var merge = require('utils-merge')
  , slice = Array.prototype.slice;

module.exports = function (target) {
  var args = slice.call(arguments, 1);
  args.forEach(function (src) {
    src &&
      merge(target, src);
  });
  return target;
};