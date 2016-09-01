"use strict";
require('use-strict')
var prepare  = require('./system/prepare');
var analyse  = require('./system/analyse');
var convert  = require('./system/convert');
var generate = require('./system/generate');

var initSettings = {
	type: Uint16Array,
	width: 255,
	in: String,
	out: String
}

module.exports = class Compiler {
	constructor ( settings ) {
		this.settings = Object.assign(initSettings, settings);
	}

	compile ( rawBf ) {
		var bf  = prepare(rawBf);
		var ast = analyse(bf);
		var js  = generate(this.settings, convert(ast));

		return {
			bf, ast, js
		};
	}

	use ( bf ) {
		return eval(this.compile(bf).js);
	}

	run ( bf, inp ) {
		if (inp == undefined) {
			if (this.settings.in == Number) {
				inp = [];
			} else {
				inp = "";
			}
		}
		return this.use(bf)(inp);
	}
}