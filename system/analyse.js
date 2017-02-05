var symbolCheck  = require('./analysis/symbolCheck');
var patternCheck = require('./analysis/patternCheck');
var langStandard = require('./language/standard');

function analyse ( settings, program ) {
	var ast = [];
	var i = 0;

	while (i < program.length) {
		let ins = program[i];

		var symbol = symbolCheck(program, i, ast);

		if (symbol) {
			if (symbol.ast) ast.push(symbol.ast);
			i = symbol.i;
		} else {

			var pattern = patternCheck(program, i, ast);

			if (pattern) {
				ast = ast.concat(pattern.ast);
				i = pattern.i;
			} else {

				var action = langStandard[ins];
				if (action !== undefined) {
					i = action(settings, i, program, ast);
				} else { i++; };

			}
		}
	}

	return ast;
}

module.exports = analyse;
