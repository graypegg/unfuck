/**
 * Use this file to convert the generated AST to
 * a JS function. Here's some syntax to remember:
 *
 * t    = Tape array
 * p    = Current tape cell position
 * t[p] = Current cell
 * o    = Output array
 * i    = Input array
 *
 * - Remember! ---------------------------------------
 * > Code must produce the same side effects brainfuck
 *   produces!
 *
 * > Use the minimum amount of JS as this compiler can
 *   can produce a huge amount of output code due to
 *   the ineffecencies of Brainfuck.
 */

var helpers = require('../../helpers/targets');
var convert = require('../../convert');

module.exports = {
	/**
	 * Increment/Decrement current cell by `body`.
	 */
	SFT: function (settings, ins, program) {
		program.push("t[p]+=" + ins.body);
	},

	/**
	 * Set current cell to `body`.
	 */
	SET: function (settings, ins, program) {
		program.push("t[p]=" + ins.body);
	},

	/**
	 * Multiply `cellOne` by `cellTwo`.
	 * Result in current cell.
	 */
	MUL: function (settings, ins, program) {
		program.push("t[p]=t[p+(" + ins.body.cellOne + ")]*t[p+(" + ins.body.cellTwo + ")]");
	},

	/**
	 * Output current cell to output array.
	 */
	OUT: function (settings, ins, program) {
		program.push("o.push(t[p])");
	},

	/**
	 * Pop top value off input array and set to current cell.
	 */
	INP: function (settings, ins, program) {
		program.push("t[p]=(i.length<1?0:i.shift())");
	},

	/**
	 * Move the current cell left or right by `body`.
	 */
	MOV: function (settings, ins, program) {
		program.push("p+=" + ins.body);
	},

	/**
	 * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
	 * Skip entirly if current cell is 0.
	 */
	IF: function (settings, ins, program) {
		program.push("while(t[p]!=0){" + (convert(settings, ins.body).join(';')) + "}");
	}
}
