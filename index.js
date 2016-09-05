"use strict";
require('use-strict')
var prepare  = require('./system/prepare');
var analyse  = require('./system/analyse');
var convert  = require('./system/convert');
var generate = require('./system/generate');

var initSettings = {
	type: {
		tape: Uint16Array,
		lang: "js"
	},
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
		var pre = convert(this.settings, ast);
		var out = generate(this.settings, pre);

		return {
			bf, ast, out
		};
	}

	use ( bf ) {
		return eval(this.compile(bf).out);
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