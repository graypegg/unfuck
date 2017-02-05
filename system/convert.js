function convert ( settings, ast ) {
	var target = require('./language/targets/javascript');
	var program = [];

	ast.forEach(function (ins) {
		if (target[ins.is]) {
			target[ins.is](settings, ins, program);
		}
	})

	return program;
}

module.exports = convert;
