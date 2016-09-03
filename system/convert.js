var tapeActions = require('./data/tapeActions');

function convert (ast) {
	var program = [];

	ast.forEach(function (ins) {
		if (tapeActions[ins.is]) {
			tapeActions[ins.is](ins, program);
		}
	})

	return program;
}

module.exports = convert;