function checkForLeftPattern (ast) {
	var first = ast[0].is === 'RELSFT';
	first = first && ast[0].body.move === 0;
	first = first && ast[0].body.value === -1;

	var tail = ast.slice(1).map((ins) => {
		var out = ins.is === 'RELSFT';
		out = out && ins.body.move !== 0;
		out = out && ins.body.value > 0;
		return out;
	})

	return first && (tail.reduce((acc, res) => acc && res, true));
}

function checkForRightPattern (ast) {
	var head = ast.slice(0,-1).map((ins) => {
		var out = ins.is === 'RELSFT';
		out = out && ins.body.move !== 0;
		out = out && ins.body.value > 0;
		return out;
	})

	var last = ast.slice(-1)[0].is === 'RELSFT';
	last = last && ast.slice(-1)[0].body.move === 0;
	last = last && ast.slice(-1)[0].body.value === -1;

	return last && (head.reduce((acc, res) => acc && res, true));
}

function makeMul (ast, direction) {
	var slice = (direction === 'left' ? ast.slice(1) : (direction === 'right' ? ast.slice(0, -1) : []));
	var factors = slice.reduce((acc, ins) => {
		acc.push({
			move: ins.body.move,
			factor: ins.body.value
		})
		return acc;
	}, [])

	return {
		is: 'MUL',
		body: {
			factors
		}
	}
}

function multiplication ( settings, ast ) {
	return ast.reduce((acc, ins) => {
		if (ins.is === 'IF') {
			if (checkForLeftPattern(ins.body)) {
				acc.push(makeMul(ins.body, 'left'));
			} else if (checkForRightPattern(ins.body)) {
				acc.push(makeMul(ins.body, 'right'));
			} else {
				ins.body = multiplication(settings, ins.body);
				acc.push(ins);
			}
		} else {
			acc.push(ins);
		}
		return acc;
	}, [])
}

module.exports = multiplication;
