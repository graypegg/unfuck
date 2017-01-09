function convert ( settings, ast ) {
	var tapeActions = require('./data/tapeActions');
	var program = [];

	ast.forEach(function (ins) {
		if (tapeActions[ins.is]) {
			tapeActions[ins.is](settings, ins, program);
		}
	})

	return program;
}

module.exports = convert;
