var optimisers = [
	require('./optimisers/collapse'),
	require('./optimisers/nullify')
];

function optimise ( settings, ast ) {
	return optimisers.reduce(( acc, optimiser ) => {
		return optimiser(settings, acc);
	}, ast)
}

module.exports = optimise;
