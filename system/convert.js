function convert (ast) {
	var tapeActions = require('./data/tapeActions');
	var program = [];

	ast.forEach(function (ins) {
		if (tapeActions[ins.is]) {
			tapeActions[ins.is](ins, program);
		}
	})

	return program;
}

module.exports = convert;