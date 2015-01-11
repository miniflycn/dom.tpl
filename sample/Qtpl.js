var Qtpl = require('../Qtpl');

console.log(
  Qtpl('<a href="javascript:void(0)" q-text="test"></a>', { ret: 'string' })
);