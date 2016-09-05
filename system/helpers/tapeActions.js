function *uniqGen () {
	var id = 0;
	while (true) {
		yield "u" + (id++).toString(16);
	}
}

module.exports = {
	uniq: uniqGen()
}