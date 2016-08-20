var symbols = require('../data/symbols');

function symbolCheck (program, i, ast) {
	var symbol = symbols.filter( x => program.substring(i,i+x.symbol.length) == x.symbol );
	if (symbol.length > 0) {
		return({
			ast: symbol[0].ast,
			i: i + symbol[0].symbol.length
		});
	} else {
		return false;
	}
}

module.exports = symbolCheck;