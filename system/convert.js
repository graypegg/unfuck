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
		switch (ins.is) {
			/**
			 * Increment current cell by `body`.
			 */
			case "INC":
				program.push("t[p]+=" + ins.body);
				break;

			/**
			 * Decrement current cell by `body`.
			 */
			case "DEC":
				program.push("t[p]-=" + ins.body);
				break;

			/**
			 * Set current cell to `body`.
			 */
			case "SET":
				program.push("t[p]=" + ins.body);
				break;

			/**
			 * Sum the current and next cell.
			 * Result in next cell.
			 * Current cell set to 0.
			 */
			case "SUM":
				program.push("t[p+1]=t[p]+t[p+1];t[p]=0");
				break;

			/**
			 * Multiply current cell by previous cell.
			 * Result in current cell.
			 * Shift to previous cell.
			 * Previous cell set to 0.
			 */
			case "MUL":
				program.push("t[p]=t[p]*t[p-1];p+=-1;t[p]=0");
				break;

			/**
			 * Output current cell to output array.
			 */
			case "OUT":
				program.push("o.push(t[p])");
				break;

			/**
			 * Output and shift right till current cell is 0.
			 */
			case "ROUT":
				program.push("while(t[p]!=0){o.push(t[p]);p+=1}");
				break;

			/**
			 * Pop top value off input array and set to current cell.
			 */
			case "INP":
				program.push("t[p]=(i.length<1?0:i.shift())");
				break;

			/**
			 * Input and shift right till input array is empty.
			 */
			case "RINP":
				let id = uniq.next().value;
				program.push("for(" + id + "=0;" + id + "<=i.length;" + id + "++){t[p+" + id + "]=i[" + id + "]};p+=" + id + "-1");
				break;

			/**
			 * Shift the current cell ID left or right by `body`.
			 */
			case "SFT":
				program.push("p+=" + ins.body);
				break;

			/**
			 * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
			 * Skip entirly if current cell is 0.
			 */
			case "IF":
				program.push("while(t[p]!=0){" + (convert(ins.body).join(';')) + "}");
				break;
		}
	})

	return program;
}

module.exports = convert;