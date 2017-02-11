var langStandard = require('../language/brainfuck/standard');

function analyse ( settings, program ) {
  var ast = [];
  var i = 0;

  while (i < program.length) {
    let ins = program[i];
    let action = langStandard[ins];
    if (action !== undefined) {
      i = action(settings, i, program, ast);
    } else { i++; };
  }

  return ast;
}

module.exports = analyse;
