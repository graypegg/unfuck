(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["unfuck"] = factory();
	else
		root["unfuck"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var langStandard = __webpack_require__(11);

function analyse(settings, program) {
  var ast = [];
  var i = 0;

  while (i < program.length) {
    var ins = program[i];
    var action = langStandard[ins];
    if (action !== undefined) {
      i = action(settings, i, program, ast);
    } else {
      i++;
    };
  }

  return ast;
}

module.exports = analyse;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * -- Unfuck Compilation Target: `interactive-es6` --
 */

module.exports = {
  output: function output(parent) {
    return {
      /**
       * Increment/Decrement current cell by `body`.
       */
      SFT: function SFT(settings, ins, program) {
        if (ins.body > 0) program.push("t[p]+=" + ins.body);else if (ins.body < 0) program.push("t[p]-=" + Math.abs(ins.body));else return;
      },


      /**
       * Increment/Decrement a relativly-specified cell by `body.value`.
       */
      RELSFT: function RELSFT(settings, ins, program) {
        var partOne = '';
        var partTwo = '';

        if (ins.body.move > 0) partOne = 't[p+' + ins.body.move + ']';else if (ins.body.move < 0) partOne = 't[p-' + Math.abs(ins.body.move) + ']';else partOne = 't[p]';

        if (ins.body.value > 0) partTwo = "+=" + ins.body.value;else if (ins.body.value < 0) partTwo = "-=" + Math.abs(ins.body.value);

        program.push(partOne + partTwo);
      },


      /**
       * Set current cell to `body`.
       */
      SET: function SET(settings, ins, program) {
        program.push("t[p]=" + ins.body);
      },


      /**
       * Set a relativly-specified cell to `body.value`.
       */
      RELSET: function RELSET(settings, ins, program) {
        var part = '';

        if (ins.body.move > 0) part = 't[p+' + ins.body.move + ']';else if (ins.body.move < 0) part = 't[p-' + Math.abs(ins.body.move) + ']';else part = 't[p]';

        program.push(part + "=" + ins.body.value);
      },


      /**
       * Multiply current cell by factors, and add to cells.
       */
      MUL: function MUL(settings, ins, program) {
        ins.body.factors.forEach(function (factor) {
          var part = '';

          if (factor.move > 0) part = 't[p+' + factor.move + ']';else if (factor.move < 0) part = 't[p-' + Math.abs(factor.move) + ']';else part = 't[p]';

          if (factor.factor === 1) program.push(part + '+=t[p]');else program.push(part + '+=t[p]*' + factor.factor);
        });
        program.push('t[p]=0');
      },


      /**
       * Use the output function to post current cell
       */
      OUT: function OUT(settings, ins, program) {
        program.push("o(t[p])");
      },


      /**
       * Use the input function to query for input
       */
      INP: function INP(settings, ins, program) {
        program.push("t[p]=i(t[p])");
      },


      /**
       * Move the current cell left or right by `body`.
       */
      MOV: function MOV(settings, ins, program) {
        if (ins.body > 0) program.push("p+=" + ins.body);else if (ins.body < 0) program.push("p-=" + Math.abs(ins.body));else return;
      },


      /**
       * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
       * Skip entirly if current cell is 0.
       */
      IF: function IF(settings, ins, program) {
        program.push("while(t[p]!=0){" + parent(settings, ins.body).join(';') + "}");
      }
    };
  },
  context: function context(settings) {
    var preHeader = '';

    switch (settings.in) {
      case String:
        preHeader += 'var i=(c)=>{let x=iFn(c); return (x ? x.charCodeAt(0) : 0)};';
        break;
      case Number:
        preHeader += 'var i=iFn;';
        break;
    }

    switch (settings.out) {
      case String:
        preHeader += 'var o=(c)=>oFn(String.fromCharCode(c));';
        break;
      case Number:
        preHeader += 'var o=oFn;';
        break;
    }

    var params = ['iFn', 'oFn'];

    if (settings.type == Array) {
      var type = "Array(" + settings.width + ").fill(0)";
    } else {
      var type = settings.type.name + "(" + settings.width + ")";
    }

    var header = "(function(" + params.join(',') + "){" + preHeader + "var t=new " + type + ";var p=0;";
    var footer = "})";

    return { header: header, footer: footer, lineEnding: ';' };
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * -- Unfuck Compilation Target: `simple-es6` --
 */

module.exports = {
  output: function output(parent) {
    return {
      /**
       * Increment/Decrement current cell by `body`.
       */
      SFT: function SFT(settings, ins, program) {
        if (ins.body > 0) program.push("t[p]+=" + ins.body);else if (ins.body < 0) program.push("t[p]-=" + Math.abs(ins.body));else return;
      },


      /**
       * Increment/Decrement a relativly-specified cell by `body.value`.
       */
      RELSFT: function RELSFT(settings, ins, program) {
        var partOne = '';
        var partTwo = '';

        if (ins.body.move > 0) partOne = 't[p+' + ins.body.move + ']';else if (ins.body.move < 0) partOne = 't[p-' + Math.abs(ins.body.move) + ']';else partOne = 't[p]';

        if (ins.body.value > 0) partTwo = "+=" + ins.body.value;else if (ins.body.value < 0) partTwo = "-=" + Math.abs(ins.body.value);

        program.push(partOne + partTwo);
      },


      /**
       * Set current cell to `body`.
       */
      SET: function SET(settings, ins, program) {
        program.push("t[p]=" + ins.body);
      },


      /**
       * Set a relativly-specified cell to `body.value`.
       */
      RELSET: function RELSET(settings, ins, program) {
        var part = '';

        if (ins.body.move > 0) part = 't[p+' + ins.body.move + ']';else if (ins.body.move < 0) part = 't[p-' + Math.abs(ins.body.move) + ']';else part = 't[p]';

        program.push(part + "=" + ins.body.value);
      },


      /**
       * Multiply current cell by factors, and add to cells.
       */
      MUL: function MUL(settings, ins, program) {
        ins.body.factors.forEach(function (factor) {
          var part = '';

          if (factor.move > 0) part = 't[p+' + factor.move + ']';else if (factor.move < 0) part = 't[p-' + Math.abs(factor.move) + ']';else part = 't[p]';

          if (factor.factor === 1) program.push(part + '+=t[p]');else program.push(part + '+=t[p]*' + factor.factor);
        });
        program.push('t[p]=0');
      },


      /**
       * Output current cell to output array.
       */
      OUT: function OUT(settings, ins, program) {
        program.push("o.push(t[p])");
      },


      /**
       * Pop top value off input array and set to current cell.
       */
      INP: function INP(settings, ins, program) {
        program.push("t[p]=(i.length<1?0:i.shift())");
      },


      /**
       * Move the current cell left or right by `body`.
       */
      MOV: function MOV(settings, ins, program) {
        if (ins.body > 0) program.push("p+=" + ins.body);else if (ins.body < 0) program.push("p-=" + Math.abs(ins.body));else return;
      },


      /**
       * Conditionally loop `body` if current cell is not 0 and the begining of each loop.
       * Skip entirly if current cell is 0.
       */
      IF: function IF(settings, ins, program) {
        program.push("while(t[p]!=0){" + parent(settings, ins.body).join(';') + "}");
      }
    };
  },
  context: function context(settings) {
    var preHeader = '';
    var preFooter = '';

    switch (settings.in) {
      case String:
        preHeader += 'var i=i.split(\'\').map(x=>x.charCodeAt())||[];';
        break;
      case Number:
        preHeader += 'var i=i||[];';
        break;
    }

    switch (settings.out) {
      case String:
        preHeader += 'var o=[];';
        preFooter += 'return o.map(x=>String.fromCharCode(x)).join(\'\');';
        break;
      case Number:
        preHeader += 'var o=[];';
        preFooter += "return o;";
        break;
    }

    var params = ['i'];

    if (settings.type == Array) {
      var type = "Array(" + settings.width + ").fill(0)";
    } else {
      var type = settings.type.name + "(" + settings.width + ")";
    }

    var header = "(function(" + params.join(',') + "){" + preHeader + "var t=new " + type + ";var p=0;";
    var footer = preFooter + "})";

    return { header: header, footer: footer, lineEnding: ';' };
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./interactive-es6": 1,
	"./interactive-es6.js": 1,
	"./simple-es6": 2,
	"./simple-es6.js": 2
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 3;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function convert(settings, ast) {
  if (typeof settings.target === 'string') {
    var target = __webpack_require__(3)("./" + settings.target);
  } else {
    var target = settings.target;
  }

  var output = target.output(convert);
  var program = [];

  ast.forEach(function (ins) {
    var insMatch = output[ins.is];
    if (insMatch) insMatch(settings, ins, program);
  });

  return program;
}

module.exports = convert;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var optimisers = [__webpack_require__(12), __webpack_require__(15), __webpack_require__(16), __webpack_require__(13), __webpack_require__(14)];

function optimise(settings, ast) {
  return optimisers.reduce(function (acc, optimiser) {
    return optimiser(settings, acc);
  }, ast);
}

module.exports = optimise;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(BrainfuckError) {

var valid = ['+', '-', '>', '<', '[', ']', '.', ','];

function prepare(settings, bf) {
  var program = bf.split('').filter(function (x) {
    return valid.indexOf(x) > -1;
  }).join('');
  if (program[0] === "[") {
    var i = 0;
    var length = 0;
    var prev = 0;
    var open = 1;
    while (open > 0) {
      for (var j = i + 1; program[j] !== ']' && j < program.length; j++) {
        if (program[j] == "[") open++;
        length++;
      }
      i += length - prev + 1;
      prev = length - prev + 1 + prev;
      open--;
      length++;
    }
    if (length >= program.length) {
      throw new BrainfuckError(bf, { start: 0, end: 1 }, 'Comment loop is never closed!');
    }
    program = program.slice(length + 1);
  }
  return program;
}

module.exports = prepare;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function wrap(settings, program) {
  if (typeof settings.target === 'string') {
    var target = __webpack_require__(3)("./" + settings.target);
  } else {
    var target = settings.target;
  }

  var context = target.context(settings);
  return context.header + program.join(context.lineEnding || '') + (context.lineEnding || '') + context.footer;
}

module.exports = wrap;

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var contextExtend = 15;

function highlight(inp) {
  return '\x1b[46m\x1b[30m ' + inp + ' \x1b[0m';
}

function heading(inp) {
  return '\x1b[41m\x1b[37m ' + inp + ' \x1b[0m';
}

var BrainfuckError = function BrainfuckError(program, section, message, type) {
  _classCallCheck(this, BrainfuckError);

  var start = section.start - contextExtend < 0 ? 0 : section.start - contextExtend;
  var end = section.start + contextExtend >= program.length ? program.length : section.start + contextExtend;

  this.message = message;
  this.section = section;
  this.type = type || 'Syntax';
  this.highlight = program.slice(section.start, section.end);
  this.context = {
    start: program.slice(start, section.start),
    end: program.slice(section.end, end)
  };

  var out = '\n\n' + heading(this.type) + ' ' + highlight(this.message) + '\n';
  out += 'character: ' + this.section.start + '\n';
  out += this.context.start;
  out += '↳  ' + highlight(this.highlight);
  out += this.context.end + '\n';

  return {
    name: 'Unfuck Error',
    message: out
  };
};

module.exports = BrainfuckError;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var prepare = __webpack_require__(6);
var analyse = __webpack_require__(0);
var optimise = __webpack_require__(5);
var convert = __webpack_require__(4);
var wrap = __webpack_require__(7);

var initSettings = {
  language: "standard",
  target: "simple-es6",
  type: Uint8Array,
  width: 10240,
  in: String,
  out: String
};

module.exports = {
  compiler: function compiler(settings) {
    this.settings = Object.assign({}, initSettings);
    this.settings = Object.assign(this.settings, settings);

    this.compile = function (rawBf) {
      var bf = prepare(this.settings, rawBf);
      var ast = analyse(this.settings, bf);
      ast = optimise(this.settings, ast);
      var raw = convert(this.settings, ast);
      var out = wrap(this.settings, raw);

      return {
        bf: bf, ast: ast, out: out
      };
    };

    this.use = function (bf) {
      return eval(this.compile(bf).out);
    };

    this.run = function (bf) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      return this.use(bf).apply(undefined, params);
    };

    return this;
  }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  // Addition Operator //
  '+': function _(settings, i, program, ast) {
    ast.push({
      is: "SFT",
      body: 1
    });
    return ++i;
  },

  // Subtraction Operator //
  '-': function _(settings, i, program, ast) {
    ast.push({
      is: "SFT",
      body: -1
    });
    return ++i;
  },

  // Output Operator //
  '.': function _(settings, i, program, ast) {
    ast.push({
      is: "OUT"
    });
    return ++i;
  },

  // Input Operator //
  ',': function _(settings, i, program, ast) {
    ast.push({
      is: "INP"
    });
    return ++i;
  },

  // Move Right Operator //
  '>': function _(settings, i, program, ast) {
    ast.push({
      is: "MOV",
      body: 1
    });
    return ++i;
  },

  // Move Left Operator //
  '<': function _(settings, i, program, ast) {
    ast.push({
      is: "MOV",
      body: -1
    });
    return ++i;
  },

  // Loop/If Operator //
  '[': function _(settings, i, program, ast) {
    var analyse = __webpack_require__(0);

    var init = "";
    var open = 1;
    var prev = 0;

    while (open > 0) {
      for (var j = i + 1; program[j] != ']'; j++) {
        if (program[j] == "[") open++;
        init += program[j];
      }
      i += init.length - prev + 1;
      prev = init.length - prev + 1 + prev;
      open--;
      init += "]";
    }

    init = init.slice(0, -1);

    ast.push({
      is: "IF",
      body: analyse(settings, init)
    });
    return i;
  }
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var collapsable = ['SFT', 'MOV'];

function collapse(settings, ast) {
  return ast.reduce(function (acc, ins) {
    if (ins.is === 'IF') {
      acc.push({
        is: 'IF',
        body: collapse(settings, ins.body)
      });
    } else {
      var last = acc.pop();
      if (last) {
        if (collapsable.indexOf(last.is) !== -1 && last.is === ins.is) {
          acc.push({
            is: ins.is,
            body: last.body + ins.body
          });
        } else {
          acc = acc.concat([last, ins]);
        }
      } else {
        acc.push(ins);
      }
    }
    return acc;
  }, []);
}

module.exports = collapse;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fusible = ['SFT', 'MOV', 'SET'];
var fuseTriggers = ['SFT', 'MOV', 'SET'];

function fuseTemp(temp, causeMove) {
  if (temp.length > 0) {
    if (temp.filter(function (ins) {
      return ins.is === 'MOV';
    }).length > 0) {
      var p = 0;
      var rel = temp.reduce(function (acc, ins) {
        if (ins.is === 'MOV') {
          p += ins.body;
        } else if (fusible.indexOf(ins.is) !== -1) {
          acc.push({
            is: 'REL' + ins.is,
            body: {
              value: ins.body,
              move: p
            }
          });
        }
        return acc;
      }, []);
      if (causeMove && p !== 0) {
        rel.push({
          is: 'MOV',
          body: p
        });
      }
      return rel;
    } else {
      return temp;
    }
  } else {
    return [];
  }
}

function fuse(settings, ast, inIf) {
  var temp = [];
  var out = ast.reduce(function (acc, ins) {
    if (fusible.indexOf(ins.is) !== -1 && (temp.length === 0 ? fuseTriggers.indexOf(ins.is) !== -1 : true)) {
      temp.push(ins);
    } else if (ins.is === 'IF') {
      acc = acc.concat(fuseTemp(temp, true));
      temp = [];
      acc.push({
        is: 'IF',
        body: fuse(settings, ins.body, true)
      });
    } else {
      acc = acc.concat(fuseTemp(temp, true));
      temp = [];
      acc.push(ins);
    }
    return acc;
  }, []);
  out = out.concat(fuseTemp(temp, inIf ? true : false));
  temp = [];
  return out;
}

module.exports = fuse;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkForLeftPattern(ast) {
  var first = ast[0].is === 'RELSFT';
  first = first && ast[0].body.move === 0;
  first = first && ast[0].body.value === -1;

  var tail = ast.slice(1).map(function (ins) {
    var out = ins.is === 'RELSFT';
    out = out && ins.body.move !== 0;
    out = out && ins.body.value > 0;
    return out;
  });

  return first && tail.reduce(function (acc, res) {
    return acc && res;
  }, true);
}

function checkForRightPattern(ast) {
  var head = ast.slice(0, -1).map(function (ins) {
    var out = ins.is === 'RELSFT';
    out = out && ins.body.move !== 0;
    out = out && ins.body.value > 0;
    return out;
  });

  var last = ast.slice(-1)[0].is === 'RELSFT';
  last = last && ast.slice(-1)[0].body.move === 0;
  last = last && ast.slice(-1)[0].body.value === -1;

  return last && head.reduce(function (acc, res) {
    return acc && res;
  }, true);
}

function makeMul(ast, direction) {
  var slice = direction === 'left' ? ast.slice(1) : direction === 'right' ? ast.slice(0, -1) : [];
  var factors = slice.reduce(function (acc, ins) {
    acc.push({
      move: ins.body.move,
      factor: ins.body.value
    });
    return acc;
  }, []);

  return {
    is: 'MUL',
    body: {
      factors: factors
    }
  };
}

function multiplication(settings, ast) {
  return ast.reduce(function (acc, ins) {
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
  }, []);
}

module.exports = multiplication;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nullable = ['SFT', 'MOV'];

function nullify(settings, ast) {
  return ast.reduce(function (acc, ins) {
    if (ins.is === 'IF') {
      acc.push({
        is: 'IF',
        body: nullify(settings, ins.body)
      });
    } else if (nullable.indexOf(ins.is) !== -1) {
      if (ins.body !== 0) {
        acc.push(ins);
      }
    } else {
      acc.push(ins);
    }
    return acc;
  }, []);
}

module.exports = nullify;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function setZero(settings, ast) {
  return ast.reduce(function (acc, ins) {
    if (ins.is === 'IF') {
      if (ins.body.length === 1 && ins.body[0].is === 'SFT' && (ins.body[0].body === -1 || ins.body[0].body === 1)) {
        acc.push({
          is: 'SET',
          body: 0
        });
      } else {
        acc.push({
          is: 'IF',
          body: setZero(settings, ins.body)
        });
      }
    } else {
      acc.push(ins);
    }
    return acc;
  }, []);
}

module.exports = setZero;

/***/ })
/******/ ]);
});