function convert ( settings, ast ) {
  if (typeof settings.target === 'string') {
    var target = require('../language/targets/' + settings.target);
  } else {
    var target = settings.target;
  }

  var output = target.output(convert);
  var program = [];

  ast.forEach(function (ins) {
    var insMatch = output[ins.is];
    if (insMatch) insMatch(settings, ins, program);
  })

  return program;
}

module.exports = convert;
