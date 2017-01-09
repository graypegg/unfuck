module.exports = {
	sum (regexAdd, regexSub, bf) {
		var add = (bf.match(regexAdd) ? bf.match(regexAdd).length : 0);
		var sub = (bf.match(regexSub) ? bf.match(regexSub).length : 0);

		return add-sub;
	}
}
