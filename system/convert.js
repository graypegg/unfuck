function convert ( settings, ast ) {
	var target = require('./language/targets/' + settings.target);
	var program = [];

	ast.forEach(function (ins) {
		if (target.output[ins.is]) {
			target.output[ins.is](settings, ins, program);
		}
	})

	return program;
}

module.exports = convert;
