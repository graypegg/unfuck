/**
 * -- Unfuck Compilation Target: `interactive-es6` --
 */

module.exports = {
  output (parent) { return {
    /**
     * Increment/Decrement current cell by `body`.
     */
    SFT (settings, ins, program) {
      if (ins.body > 0) program.push("t[p]+=" + ins.body);
      else if (ins.body < 0) program.push("t[p]-=" + Math.abs(ins.body));
      else return;
    },

    /**
     * Increment/Decrement a relativly-specified cell by `body.value`.
     */
    RELSFT (settings, ins, program) {
      var partOne = '';
      var partTwo = '';

      if (ins.body.move > 0) partOne = 't[p+' + ins.body.move + ']';
      else if (ins.body.move < 0) partOne = 't[p-' + Math.abs(ins.body.move) + ']';
      else partOne = 't[p]';

      if (ins.body.value > 0) partTwo = "+=" + ins.body.value;
      else if (ins.body.value < 0) partTwo = "-=" + Math.abs(ins.body.value);

      program.push(partOne + partTwo);
    },

    /**
     * Set current cell to `body`.
     */
    SET (settings, ins, program) {
      program.push("t[p]=" + ins.body);
    },

    /**
     * Set a relativly-specified cell to `body.value`.
     */
    RELSET (settings, ins, program) {
      var part = '';

      if (ins.body.move > 0) part = 't[p+' + ins.body.move + ']';
      else if (ins.body.move < 0) part = 't[p-' + Math.abs(ins.body.move) + ']';
      else part = 't[p]';

      program.push(part + "=" + ins.body.value);
    },

    /**
     * Multiply current cell by factors, and add to cells.
     */
    MUL (settings, ins, program) {
      ins.body.factors.forEach((factor) => {
        var part = '';

        if (factor.move > 0) part = 't[p+' + factor.move + ']';
        else if (factor.move < 0) part = 't[p-' + Math.abs(factor.move) + ']';
        else part = 't[p]';

        if (factor.factor === 1) program.push(part + '+=t[p]');
        else program.push(part + '+=t[p]*' + factor.factor);
      })
      program.push('t[p]=0');
    },

    /**
     * Use the output function to post current cell
     */
    OUT (settings, ins, program) {
      program.push("o(t[p])");
    },

    /**
     * Use the input function to query for input
     */
    INP (settings, ins, program) {
      program.push("t[p]=i(t[p])");
    },

    /**
     * Move the current cell left or right by `body`.
     */
    MOV (settings, ins, program) {
      if (ins.body > 0) program.push("p+=" + ins.body);
      else if (ins.body < 0) program.push("p-=" + Math.abs(ins.body));
      else return;
    },

    /**
     * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
     * Skip entirly if current cell is 0.
     */
    IF (settings, ins, program) {
      program.push("while(t[p]!=0){" + (parent(settings, ins.body).join(';')) + "}");
    }
  } },
  context (settings) {
    var preHeader = '';

    switch (settings.in) {
      case String:
        preHeader += 'var i=(c)=>{let x=iFn(c); return (x ? x.charCodeAt(0) : 0)};';
        break;
      case Number:
        preHeader += 'var i=iFn;';
        break;
    }

    switch (settings.out) {
      case String:
        preHeader += 'var o=(c)=>oFn(String.fromCharCode(c));';
        break;
      case Number:
        preHeader += 'var o=oFn;';
        break;
    }

    var params = ['iFn', 'oFn'];

    if (settings.type == Array) {
      var type = "Array(" + settings.width + ").fill(0)"
    } else {
      var type = settings.type.name + "(" + settings.width + ")"
    }

    var header = "(function(" + params.join(',') + "){" + preHeader + "var t=new " + type + ";var p=0;";
    var footer = "})";

    return { header, footer, lineEnding: ';' };
  }
}
