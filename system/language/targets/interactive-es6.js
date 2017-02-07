/**
 * -- Unfuck Compilation Target: `interactive-es6` --
 */

var convert = require('../../convert');

module.exports = {
	output: {
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
			else return;

			program.push(partOne + partTwo);
		},

		/**
		 * Set current cell to `body`.
		 */
		SET (settings, ins, program) {
			program.push("t[p]=" + ins.body);
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
			program.push("while(t[p]!=0){" + (convert(settings, ins.body).join(';')) + "}");
		}
	},
	context (settings) {
		var header = '';
		var footer = '';

		switch (settings.in) {
			case String:
				header += 'var i=(c)=>(iFn()).charCodeAt(0);';
				break;
			case Number:
				header += 'var i=iFn;';
				break;
		}

		switch (settings.out) {
			case String:
				header += 'var o=(c)=>oFn(String.fromCharCode(c));';
				break;
			case Number:
				header += 'var o=oFn;';
				break;
		}

		var params = ['iFn', 'oFn'];

		return { header, footer, params };
	}
}
