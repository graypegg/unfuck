var valid = [
	'+','-','>','<','[',']','.',','
]

function prepare ( settings, bf ) {
	var program = bf.split('').filter(x => valid.indexOf(x) > -1).join('');
	if (program[0] == "[") {
		var i = 0;
		var length = 0;
		var prev = 0;
		var open = 1;
		while (open > 0) {
			for (let j=(i+1); program[j]!=']'; j++) {
				if (program[j] == "[") open++;
				length++;
			}
			i += (length - prev) + 1
			prev = ((length - prev) + 1) + prev
			open--;
			length++;
		}
		program = program.slice(length+1);
	}
	return program;
}

module.exports = prepare;
