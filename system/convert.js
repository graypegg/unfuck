function *uniqGen () {
	var id = 0;
	while (true) {
		yield "u" + (id++).toString(16);
	}
}
var uniq = uniqGen();

function convert (ast) {
	var program = [];

	ast.forEach(function (ins) {
		if (ins.is == "INC") {
			program.push("t[p]+=" + ins.body);
		} else if (ins.is == "DEC") {
			program.push("t[p]-=" + ins.body);
		} else if (ins.is == "SET") {
			program.push("t[p]=" + ins.body);
		} else if (ins.is == "SUM") {
			program.push("t[p+1]=t[p]+t[p+1];t[p]=0");
		} else if (ins.is == "MUL") {
			program.push("t[p]=t[p]*t[p-1];p+=-1");
		} else if (ins.is == "OUT") {
			program.push("o.push(t[p])");
		} else if (ins.is == "INP") {
			program.push("t[p]=(i.length<1?0:i.shift())");
		} else if (ins.is == "SFT") {
			program.push("p+=" + ins.body);
		} else if (ins.is == "IF") {
			program.push("while(t[p]!=0){" + (convert(ins.body).join(';')) + "}");
		} else if (ins.is == "RPL") {
			let id = uniq.next().value;
			program.push("for(" + id + "=0;" + id + "<=i.length;" + id + "++){t[p+" + id + "]=i[" + id + "]};p+=" + id + "-1");
		}
	})

	return program;
}

module.exports = convert;