var helpers = {
	sum (bf) {
		var add = (bf.match(/\+/) ? bf.match(/\+/g).length : 0);
		var sub = (bf.match(/\-/) ? bf.match(/\-/g).length : 0);

		return add-sub;
	}
}

module.exports = [
	{
		"pattern": /^[\+\-]+\[>[\+\-]+<-\]/,
		"action": function (matched, ast) {
			var one = helpers.sum(/^[\+\-]+(?=\[>)/.exec(matched)[0]);
			var two = helpers.sum(/[\+\-]+(?=<-\])/.exec(matched)[0]);

			ast.push({
				is: "INC",
				body: one
			})
			ast.push({
				is: "SFT",
				body: 1
			})
			ast.push({
				is: "INC",
				body: two
			})
		},
		"ast": {
			"is": "MUL"
		}
	}
]