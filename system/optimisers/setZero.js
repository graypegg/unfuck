function setZero ( settings, ast ) {
	return ast.reduce(( acc, ins ) => {
		if (ins.is === 'IF') {
			if ((ins.body.length === 1) && (ins.body[0].is === 'SFT') && (ins.body[0].body === -1)) {
				acc.push({
					is: 'SET',
					body: 0
				});
			} else {
				acc.push(ins);
			}
		} else {
			acc.push(ins);
		}
		return acc;
	}, [])
}

module.exports = setZero;
