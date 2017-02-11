var prepare  = require('./steps/prepare');
var analyse  = require('./steps/analyse');
var optimise = require('./steps/optimise');
var convert  = require('./steps/convert');
var wrap     = require('./steps/wrap');

var initSettings = {
  language: "standard",
  target: "simple-es6",
  type: Uint8Array,
  width: 10240,
  in: String,
  out: String
}

module.exports = {
  compiler ( settings ) {
    this.settings = Object.assign({}, initSettings);
    this.settings = Object.assign(this.settings, settings);

    this.compile = function ( rawBf ) {
      var bf  = prepare(this.settings, rawBf);
      var ast = analyse(this.settings, bf);
        ast = optimise(this.settings, ast);
      var raw = convert(this.settings, ast);
      var js  = wrap(this.settings, raw);

      return {
        bf, ast, js
      };
    }

    this.use = function ( bf ) {
      return eval(this.compile(bf).js);
    }

    this.run = function ( bf, ...params ) {
      return this.use(bf)(...params);
    }

    return this;
  }
}
