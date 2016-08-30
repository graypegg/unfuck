var patterns = require('../data/patterns');

function patternCheck (program, i, ast) {
	var pattern = patterns.filter(regexp => regexp.pattern.test(program.substring(i)));
	if (pattern.length > 0) {
		var virtualAst = [];
		var matched = pattern[0].pattern.exec(program.substring(i))[0];
		if (pattern[0].action) pattern[0].action(matched, virtualAst);
		if (pattern[0].ast) virtualAst.push(pattern[0].ast);
		return({
			ast: virtualAst,
			i: i + matched.length
		});
	} else {
		return false;
	}
}

module.exports = patternCheck;