/**
 * Use this file for amending the AST for simple,
 * common, and short snippets of Brainfuck.
 * 
 * - Remember! ---------------------------------------
 * > Code must produce the same side effects brainfuck
 *   produces!
 */

 module.exports = [
	{
		symbol: "[-]",
		ast: {
			is: "SET",
			body: 0
		}
	},
	{
		symbol: "[->+<]",
		ast: {
			is: "SUM"
		}
	},
	{
		symbol: "[>+<-]",
		ast: {
			is: "SUM"
		}
	},
	{
		symbol: ",[>,]",
		ast: {
			is: "RINP"
		}
	},
	{
		symbol: "[.>]",
		ast: {
			is: "ROUT"
		}
	},
	{
		symbol: "[]",
		ast: false
	}
]