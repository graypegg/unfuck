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

var helpers = require('../helpers/tapeActions');
var convert = require('../convert');
module.exports = {
	/**
	 * Increment current cell by `body`.
	 */
	INC: function (settings, ins, program) {
		program.push("t[p]+=" + ins.body);
	},

	/**
	 * Decrement current cell by `body`.
	 *
	 */
	DEC: function (settings, ins, program) {
		if (settings.allowNegatives) program.push("t[p]-=" + ins.body);
		else program.push("t[p]=(t[p]-" + ins.body + "<=0?0:t[p]-" + ins.body + ")");
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
	 * Output and shift right till current cell is 0.
	 */
	ROUT: function (settings, ins, program) {
		program.push("while(t[p]!=0){o.push(t[p]);p+=1}");
	},

	/**
	 * Pop top value off input array and set to current cell.
	 */
	INP: function (settings, ins, program) {
		program.push("t[p]=(i.length<1?0:i.shift())");
	},

	/**
	 * Input and shift right till input array is empty.
	 */
	RINP: function (settings, ins, program) {
		let id = helpers.uniq.next().value;
		program.push("for(var " + id + "=0;" + id + "<=i.length;" + id + "++){t[p+" + id + "]=i[" + id + "]};p+=" + id + "-1");
	},

	/**
	 * Shift the current cell ID left or right by `body`.
	 */
	SFT: function (settings, ins, program) {
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
