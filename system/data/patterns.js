var helpers = {
	sum (bf) {
		var add = (bf.match(/\+/) ? bf.match(/\+/g).length : 0);
		var sub = (bf.match(/\-/) ? bf.match(/\-/g).length : 0);

		return add-sub;
	}
}

/**
 * ---------- A note on Brainfuck patterns ----------
 * You must replicate the side effects that
 * would normally occur if the program was run
 * in a Brainfuck interpreter! The action method
 * takes the AST as a second argument, use this
 * to set up the environment for your pattern to run.
 */

module.exports = [
	{
		/**
		 * Find a common implimentation of multiplication.
		 */
		"pattern": /^[\+\-]+\[>[\+\-]+<-\]/,
		"action": function (matched, ast) {
			var one = helpers.sum(/^[\+\-]+(?=\[>)/.exec(matched)[0]);
			var two = helpers.sum(/[\+\-]+(?=<-\])/.exec(matched)[0]);

			if (one != 0) {
				ast.push({
					is: (one > 0 ? "INC" : "DEC"),
					body: Math.abs(one)
				})
			}
			ast.push({
				is: "SFT",
				body: 1
			})
			if (two != 0) {
				ast.push({
					is: (two > 0 ? "INC" : "DEC"),
					body: Math.abs(two)
				})
			}
			ast.push({
				is: "MUL"
			})
		}
	},
	{
		/**
		 * Collapse long strings of INC and DEC into their sum.
		 */
		"pattern": /^([\+]+[\-]+)+/,
		"action": function (matched, ast) {
			var sum = helpers.sum(matched);
			if (sum != 0) {
				ast.push({
					is: (sum > 0 ? "INC" : "DEC"),
					body: Math.abs(sum)
				})
			}
		}
	},
	{
		/**
		 * Collapse long strings of SFT into their sum.
		 */
		"pattern": /^([\>]+[\<]+)+/,
		"action": function (matched, ast) {
			var right = (matched.match(/\>/) ? matched.match(/\>/g).length : 0);
			var left = (matched.match(/\</) ? matched.match(/\</g).length : 0);
			var sum = right-left;

			if (sum != 0) {
				ast.push({
					is: "SFT",
					body: sum
				})
			}
		}
	}
]