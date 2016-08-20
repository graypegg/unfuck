var symbolCheck = require('./analysis/symbolCheck');
var patternCheck = require('./analysis/patternCheck');

function analyse (program) {
	var ast = [];
	var i = 0;

	while (i < program.length) {
		let ins = program[i];

		var symbol = symbolCheck(program, i, ast);

		if (symbol) {
			ast.push(symbol.ast);
			i = symbol.i;
		} else {

			var pattern = patternCheck(program, i, ast);

			if (pattern) {
				ast = ast.concat(pattern.ast);
				i = pattern.i;
			} else {

				// Addition Operator //
				if (ins == '+') {
					let body = 0;
					for (let j=i; program[j]=='+'; j++) body++;
					ast.push({
						is: "INC",
						body
					})
					i += body;
				}

				// Subtraction Operator //
				else if (ins == '-') {
					let body = 0;
					for (let j=i; program[j]=='-'; j++) body++;
					ast.push({
						is: "DEC",
						body
					})
					i += body;
				}

				// Output Operator //
				else if (ins == '.') {
					ast.push({
						is: "OUT"
					})
					i++;
				}

				// Input Operator //
				else if (ins == ',') {
					ast.push({
						is: "INP"
					})
					i++;
				}

				// Shift Right Operator //
				else if (ins == '>') {
					let body = 0;
					for (let j=i; program[j]=='>'; j++) body++;
					ast.push({
						is: "SFT",
						body
					})
					i += body;
				}

				// Shift Left Operator //
				else if (ins == '<') {
					let body = 0;
					for (let j=i; program[j]=='<'; j++) body++;
					ast.push({
						is: "SFT",
						body: -body
					})
					i += body;
				}

				// Loop/If Operator //
				else if (ins == '[') {
					let init = "";
					let open = 1;
					let prev = 0;

					while (open > 0) {
						for (let j=(i+1); program[j]!=']'; j++) {
							if (program[j] == "[") open++;
							init += program[j];
						}
						i += (init.length - prev) + 1
						prev = ((init.length - prev) + 1) + prev
						open--;
						init += "]";
					}

					init = init.slice(0, -1);

					ast.push({
						is: "IF",
						body: analyse(init)
					});
				}

				// Comments //
				else {
					i += 1;
				}
			}
		}
	}

	return ast;
}

module.exports = analyse;