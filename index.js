require('use-strict')
var prepare  = require('./system/prepare');
var analyse  = require('./system/analyse');
var convert  = require('./system/convert');
var wrap     = require('./system/wrap');

var initSettings = {
	lang: "standard",
	type: Uint8Array,
	width: 255,
	in: String,
	out: String,
	allowNegatives: true
}

module.exports = {
	compiler ( settings ) {
		this.settings = Object.assign(initSettings, settings);

		this.compile = function ( rawBf ) {
			var bf  = prepare(this.settings, rawBf);
			var ast = analyse(this.settings, bf);
			var raw = convert(this.settings, ast);
			var js  = wrap(this.settings, raw);

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
