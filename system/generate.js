function generate (settings, program) {
	if (settings.in == String) {
		var input = "i=i.split('').map(x=>x.charCodeAt())||[]";
	} else if (settings.in == Number) {
		var input = "i=i||[]";
	}
	if (settings.out == String) {
		var output = "return o.map(x=>String.fromCharCode(x)).join('')";
	} else if (settings.out == Number) {
		var output = "return o";
	}

	var header = "(function(i){o=[];" + input + ";t=new " + settings.type.name + "(" + settings.width + ");p=0;";
	var footer = output + "})";
	return header + program.join(';') + ';' + footer;
}

module.exports = generate;