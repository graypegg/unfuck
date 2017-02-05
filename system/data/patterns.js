/**
 * Use this file for amending the AST for complex
 * patterns that can be detected via a regaulr exp.
 *
 * Regular expressions will be matched against the
 * remaining Brainfuck that has not been converted to
 * into the AST. Thus you should start all patterns
 * with:
 *
 * 		pattern: /^ ...
 *
 * 	to match the begining of the line and not detect
 * 	the same pattern appearing further into the
 * 	program.
 *
 * 	The action function is passed the matched string
 * 	from the Brainfuck program and an empty AST to
 * 	push to. You can add as many AST actions as you
 * 	need to emulate the side effects of Brainfuck.
 *
 * - Remember! ---------------------------------------
 * > AST must produce the same side effects brainfuck
 *   produces!
 */

var helpers = require('../helpers/patterns');
module.exports = [
	{
		/**
		 * Find a common implimentation of multiplication.
		 */
		pattern: /^[\+\-]+\[>[\+\-]+<-\]/,
		action: function (matched, ast) {
			var one = helpers.sum(/\+/g, /\-/g, /^[\+\-]+(?=\[>)/.exec(matched)[0]);
			var two = helpers.sum(/\+/g, /\-/g, /[\+\-]+(?=<-\])/.exec(matched)[0]);

			if (one !== 0) {
				ast.push({
					is: (one > 0 ? "INC" : "DEC"),
					body: Math.abs(one)
				})
			}

			ast.push({
				is: "SFT",
				body: 1
			})

			if (two !== 0) {
				ast.push({
					is: (two > 0 ? "INC" : "DEC"),
					body: Math.abs(two)
				})
			}

			ast.push({
				is: "MUL",
				body: {
					cellOne: -1,
					cellTwo: 0
				}
			})

			ast.push({
				is: "SFT",
				body: -1
			})

			ast.push({
				is: "SET",
				body: 0
			})
		}
	},
	{
		/**
		 * Collapse long strings of INC and DEC into their sum.
		 */
		pattern: /^([\+]+[\-]+)+/,
		action: function (matched, ast) {
			var sum = helpers.sum(/\+/g, /\-/g, matched);
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
		pattern: /^([\>]+[\<]+)+/,
		action: function (matched, ast) {
            var sum = helpers.sum(/\>/g, /\</g, matched);
			if (sum != 0) {
				ast.push({
					is: "SFT",
					body: sum
				})
			}
		}
	}
]
