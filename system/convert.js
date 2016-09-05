function convert (settings, ast) {
	console.log(settings)
	if (settings.type.lang == "js") {
		var tapeActions = require('./data/tapeActions');
	} else {
		try {
			var tapeActions = require(settings.type.lang);
		} catch (e) {
			console.error("Unfuck: The language '" + settings.type.lang + "' cannot be found!");
		}
	}
	var program = [];

	ast.forEach(function (ins) {
		if (tapeActions[ins.is]) {
			tapeActions[ins.is](ins, program);
		}
	})

	return program;
}

module.exports = convert;