var ARG_REG = /^([\w\-]+)\:/

function parser(str) {
  var res = {}
    , arg = str.match(ARG_REG);

  if (arg) {
    res.arg = arg[1];
    str = str.substring(arg[1].length + 1).trim();
  }

  res.filters = str.split(/ *\| */);
  res.exp = res.filters.shift();
  return res;
}

module.exports = parser;