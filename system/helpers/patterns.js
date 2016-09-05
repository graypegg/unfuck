module.exports = {
	sum (bf) {
		var add = (bf.match(/\+/) ? bf.match(/\+/g).length : 0);
		var sub = (bf.match(/\-/) ? bf.match(/\-/g).length : 0);

		return add-sub;
	}
}