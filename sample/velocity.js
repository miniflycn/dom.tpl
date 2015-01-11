var tpl = require('../velocity');

console.log(
  tpl('<a href="javascript:void(0)" q-text="test | purchase.getTotal"></a>')
);

console.log(
  tpl('<input q-value="email | !">')
);