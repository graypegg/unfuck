function generate (settings, program) {
	if (settings.in == String) {
		var input = "var i=i.split('').map(x=>x.charCodeAt())||[]";
	} else if (settings.in == Number) {
		var input = "var i=i||[]";
	}
	if (settings.out == String) {
		var output = "return o.map(x=>String.fromCharCode(x)).join('')";
	} else if (settings.out == Number) {
		var output = "return o";
	}
	if (settings.type.lang == "js" && settings.type.tape == Array) {
		var type = "Array(" + settings.width + ").fill(0)"
	} else {
		var type = settings.type.tape.name + "(" + settings.width + ")"
	}

	var header = "(function(i){var o=[];" + input + ";var t=new " + type + ";var p=0;";
	var footer = output + "})";
	return header + program.join(';') + ';' + footer;
}

module.exports = generate;