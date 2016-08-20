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

module.exports = {
	compiler ( settings ) {
		this.settings = Object.assign(initSettings, settings);

		this.compile = function ( rawBf ) {
			var bf  = prepare(rawBf);
			var ast = analyse(bf);
			var js  = generate(this.settings, convert(ast));

			return {
				bf, ast, js
			};
		}

		this.use = function ( bf ) {
			return eval(this.compile(bf).js);
		}

		this.run = function ( bf, inp ) {
			if (inp == undefined) {
				if (this.settings.in == Number) {
					inp = [];
				} else {
					inp = "";
				}
			}
			return this.use(bf)(inp);
		}

		return this;
	}
}