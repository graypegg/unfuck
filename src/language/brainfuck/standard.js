module.exports = {
  // Addition Operator //
  '+': function (settings, i, program, ast) {
    ast.push({
      is: "SFT",
      body: 1
    })
    return ++i;
  },

  // Subtraction Operator //
  '-': function (settings, i, program, ast) {
    ast.push({
      is: "SFT",
      body: -1
    })
    return ++i;
  },

  // Output Operator //
  '.': function (settings, i, program, ast) {
    ast.push({
      is: "OUT"
    })
    return ++i;
  },

  // Input Operator //
  ',': function (settings, i, program, ast) {
    ast.push({
      is: "INP"
    })
    return ++i;
  },

  // Move Right Operator //
  '>': function (settings, i, program, ast) {
    ast.push({
      is: "MOV",
      body: 1
    })
    return ++i;
  },

  // Move Left Operator //
  '<': function (settings, i, program, ast) {
    ast.push({
      is: "MOV",
      body: -1
    })
    return ++i;
  },

  // Loop/If Operator //
  '[': function (settings, i, program, ast) {
    var analyse  = require('../../steps/analyse');

    if (program[i+1] === ']') {
      throw new BrainfuckError(program, {start: i, end: i + 2}, 'Empty loops run forever!')
    }

    let init = "";
    let open = 1;
    let prev = 0;

    while (open > 0) {
      for (let j = (i+1); program[j] != ']'; j++) {
        if (program[j] == "[") open++;
        init += program[j];
        if (j >= program.length) {
          throw new BrainfuckError(program, {start: (i - prev), end: (i - prev) + 1}, 'Loop is never closed!')
        }
      }
      i += (init.length - prev) + 1
      prev = ((init.length - prev) + 1) + prev
      open--;
      init += "]";
    }

    init = init.slice(0, -1);

    ast.push({
      is: "IF",
      body: analyse(settings, init)
    });
    return i;
  }
}
