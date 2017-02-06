/**
 * -- Unfuck Compilation Target: `pure-es6` --
 */

var convert = require('../../convert');

module.exports = {
	output: {
		/**
		 * Increment/Decrement current cell by `body`.
		 */
		SFT (settings, ins, program) {
			program.push("t[p]+=" + ins.body);
		},

		/**
		 * Set current cell to `body`.
		 */
		SET (settings, ins, program) {
			program.push("t[p]=" + ins.body);
		},

		/**
		 * Multiply `cellOne` by `cellTwo`.
		 * Result in current cell.
		 */
		MUL (settings, ins, program) {
			program.push("t[p]=t[p+(" + ins.body.cellOne + ")]*t[p+(" + ins.body.cellTwo + ")]");
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
			program.push("p+=" + ins.body);
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
