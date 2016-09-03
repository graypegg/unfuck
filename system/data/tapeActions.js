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

var helpers = require('../helpers/tapeActions')
module.exports = {
	/**
	 * Increment current cell by `body`.
	 */
	INC: function (ins, program) {
		program.push("t[p]+=" + ins.body);
	},

	/**
	 * Decrement current cell by `body`.
	 */
	DEC: function (ins, program) {
		program.push("t[p]-=" + ins.body);
	},

	/**
	 * Set current cell to `body`.
	 */
	SET: function (ins, program) {
		program.push("t[p]=" + ins.body);
	},

	/**
	 * Sum the current and next cell.
	 * Result in next cell.
	 * Current cell set to 0.
	 */
	SUM: function (ins, program) {
		program.push("t[p+1]=t[p]+t[p+1];t[p]=0");
	},

	/**
	 * Multiply current cell by previous cell.
	 * Result in current cell.
	 * Shift to previous cell.
	 * Previous cell set to 0.
	 */
	MUL: function (ins, program) {
		program.push("t[p]=t[p]*t[p-1];p+=-1;t[p]=0");
	},

	/**
	 * Output current cell to output array.
	 */
	OUT: function (ins, program) {
		program.push("o.push(t[p])");
	},

	/**
	 * Output and shift right till current cell is 0.
	 */
	ROUT: function (ins, program) {
		program.push("while(t[p]!=0){o.push(t[p]);p+=1}");
	},

	/**
	 * Pop top value off input array and set to current cell.
	 */
	INP: function (ins, program) {
		program.push("t[p]=(i.length<1?0:i.shift())");
	},

	/**
	 * Input and shift right till input array is empty.
	 */
	RINP: function (ins, program) {
		let id = helpers.uniq.next().value;
		program.push("for(var " + id + "=0;" + id + "<=i.length;" + id + "++){t[p+" + id + "]=i[" + id + "]};p+=" + id + "-1");
	},

	/**
	 * Shift the current cell ID left or right by `body`.
	 */
	SFT: function (ins, program) {
		program.push("p+=" + ins.body);
	},

	/**
	 * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
	 * Skip entirly if current cell is 0.
	 */
	IF: function (ins, program) {
		program.push("while(t[p]!=0){" + (convert(ins.body).join(';')) + "}");
	}
}