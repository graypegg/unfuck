/**
 * -- Unfuck Compilation Target: `simple-es6` --
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

			program.push(partOne + partTwo);
		},

		/**
		 * Set current cell to `body`.
		 */
		SET (settings, ins, program) {
			program.push("t[p]=" + ins.body);
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
		 * Output current cell to output array.
		 */
		OUT (settings, ins, program) {
			program.push("o.push(t[p])");
		},

		/**
		 * Pop top value off input array and set to current cell.
		 */
		INP (settings, ins, program) {
			program.push("t[p]=(i.length<1?0:i.shift())");
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
				header += 'var i=i.split(\'\').map(x=>x.charCodeAt())||[];';
				break;
			case Number:
				header += 'var i=i||[];';
				break;
		}

		switch (settings.out) {
			case String:
				header += 'var o=[];';
				footer += 'return o.map(x=>String.fromCharCode(x)).join(\'\');';
				break;
			case Number:
				header += 'var o=[];';
			 	footer += "return o;";
				break;
		}

		var params = ['i'];

		return { header, footer, params };
	}
}
