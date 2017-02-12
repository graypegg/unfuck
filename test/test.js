let prepare  = require('../src/steps/prepare');
let analyse  = require('../src/steps/analyse');
let optimise = require('../src/steps/optimise');
let convert  = require('../src/steps/convert');
let wrap     = require('../src/steps/wrap');
let uf       = require('../dist/unfuck.js');

let assert  = require('assert');

describe('Source Prepping', function() {
  describe('Character Stripping', function() {
    it('should return a string containing only valid brainfuck instructions', function() {
      assert.equal(prepare({}, '+H+e-l-l,o,w.o.r[ld]!'), '++--,,..[]');
    });
  });

  describe('Skipped-Loop Comment Pattern', function() {
    it('should return a string without an inital loop', function() {
      assert.equal(prepare({}, '[test.example]++--'), '++--');
    });
  });

  describe('Output Source Wrapping', function() {
    describe('Simple ES6', function() {
      describe('Number -> Number', function() {
        it('should return a JS header & footer that take a Number and return a Number, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "simple-es6",type: Uint8Array,width: 10240,in: Number,out: Number};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(i){var i=i||[];var o=[];var t=new Uint8Array(10240);var p=0;CONTENT;HERE;return o;})');
        });
      });

      describe('Number -> String', function() {
        it('should return a JS header & footer that take a Number and return a String, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "simple-es6",type: Uint8Array,width: 10240,in: String,out: Number};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(i){var i=i.split(\'\').map(x=>x.charCodeAt())||[];var o=[];var t=new Uint8Array(10240);var p=0;CONTENT;HERE;return o;})');
        });
      });

      describe('String -> Number', function() {
        it('should return a JS header & footer that take a String and return a Number, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "simple-es6",type: Uint8Array,width: 10240,in: Number,out: String};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(i){var i=i||[];var o=[];var t=new Uint8Array(10240);var p=0;CONTENT;HERE;return o.map(x=>String.fromCharCode(x)).join(\'\');})');
        });
      });

      describe('String -> String', function() {
        it('should return a JS header & footer that take a String and return a String, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "simple-es6",type: Uint8Array,width: 10240,in: String,out: String};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(i){var i=i.split(\'\').map(x=>x.charCodeAt())||[];var o=[];var t=new Uint8Array(10240);var p=0;CONTENT;HERE;return o.map(x=>String.fromCharCode(x)).join(\'\');})');
        });
      });
    });

    describe('Interactive ES6', function() {
      describe('Number -> Number', function() {
        it('should return a JS header & footer that take a Number and return a Number, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "interactive-es6",type: Uint8Array,width: 10240,in: Number,out: Number};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(iFn,oFn){var i=iFn;var o=oFn;var t=new Uint8Array(10240);var p=0;CONTENT;HERE;})');
        });
      });

      describe('Number -> String', function() {
        it('should return a JS header & footer that take a Number and return a String, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "interactive-es6",type: Uint8Array,width: 10240,in: String,out: Number};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(iFn,oFn){var i=(c)=>(iFn()).charCodeAt(0);var o=oFn;var t=new Uint8Array(10240);var p=0;CONTENT;HERE;})');
        });
      });

      describe('String -> Number', function() {
        it('should return a JS header & footer that take a String and return a Number, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "interactive-es6",type: Uint8Array,width: 10240,in: Number,out: String};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(iFn,oFn){var i=iFn;var o=(c)=>oFn(String.fromCharCode(c));var t=new Uint8Array(10240);var p=0;CONTENT;HERE;})');
        });
      });

      describe('String -> String', function() {
        it('should return a JS header & footer that take a String and return a String, with CONTENT HERE as the main function body', function() {
          var settings = {language: "standard",target: "interactive-es6",type: Uint8Array,width: 10240,in: String,out: String};
          assert.equal(wrap(settings, ['CONTENT', 'HERE']), '(function(iFn,oFn){var i=(c)=>(iFn()).charCodeAt(0);var o=(c)=>oFn(String.fromCharCode(c));var t=new Uint8Array(10240);var p=0;CONTENT;HERE;})');
        });
      });
    });
  });
});

describe('Basic Compilation', function() {
  describe('"+"', function() {
    it('should return a AST with one positive SFT action', function() {
      assert.deepEqual(analyse({}, '+'), [ { is: 'SFT', body: 1 } ]);
    });
  });

  describe('"-"', function() {
    it('should return a AST with one negative SFT action', function() {
      assert.deepEqual(analyse({}, '-'), [ { is: 'SFT', body: -1 } ]);
    });
  });

  describe('">"', function() {
    it('should return a AST with one positive MOV action', function() {
      assert.deepEqual(analyse({}, '>'), [ { is: 'MOV', body: 1 } ]);
    });
  });

  describe('"<"', function() {
    it('should return a AST with one negative MOV action', function() {
      assert.deepEqual(analyse({}, '<'), [ { is: 'MOV', body: -1 } ]);
    });
  });

  describe('","', function() {
    it('should return a AST with one INP action', function() {
      assert.deepEqual(analyse({}, ','), [ { is: 'INP' } ]);
    });
  });

  describe('"."', function() {
    it('should return a AST with one OUT action', function() {
      assert.deepEqual(analyse({}, '.'), [ { is: 'OUT' } ]);
    });
  });

  describe('"[ ... ]"', function() {
    it('should return a AST with one simple IF block containing a OUT action both inside and outside of the IF block, with an INP at the end', function() {
      assert.deepEqual(analyse({}, '.[.],'), [ { is: 'OUT' }, { is: 'IF', body: [ { is: 'OUT' } ] }, { is: 'INP' } ]);
    });
  });
});

describe('Optimisation', function() {
  describe('Collapsing', function() {
    it('should return a AST with one positive SFT action, adding 2 to the current cell', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1}];
      assert.deepEqual(optimise({}, ast), [ { is: 'SFT', body: 2 } ]);
    });
  });

  describe('Nullifying', function() {
    it('should return a AST with no content', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":-1},{"is":"SFT","body":-1},{"is":"SFT","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":-1},{"is":"SFT","body":-1}];
      assert.deepEqual(optimise({}, ast), [ ]);
    });
  });

  describe('Cell Clearing', function() {
    it('should return a AST with SFT+10 and SET=0', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"IF","body":[{"is":"SFT","body":-1}]}];
      assert.deepEqual(optimise({}, ast), [ { is: 'SFT', body: 10 }, { is: 'SET', body: 0 } ]);
    });
  });

  describe('Fusing', function() {
    it('should return a AST with THREE RELSFT instructions, and ends with a MOV of the sum of steps taken', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"MOV","body":1},{"is":"MOV","body":1},{"is":"SFT","body":-1},{"is":"SFT","body":-1},{"is":"MOV","body":-1},{"is":"SFT","body":1},{"is":"OUT"}];
      assert.deepEqual(optimise({}, ast), [{"is":"RELSFT","body":{"value":2,"move":0}},{"is":"RELSFT","body":{"value":-2,"move":2}},{"is":"RELSFT","body":{"value":1,"move":1}},{"is":"MOV","body":1},{"is":"OUT"}]);
    });
  });

  describe('Multiplication', function() {
    it('should return a AST with ONE MUL instruction, with two factors (x3 and x4)', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"IF","body":[{"is":"SFT","body":-1},{"is":"MOV","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"MOV","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"MOV","body":-1},{"is":"MOV","body":-1}]}];
      assert.deepEqual(optimise({}, ast), [{"is":"SFT","body":2},{"is":"MUL","body":{"factors":[{"move":1,"factor":3},{"move":2,"factor":4}]}}]);
    });
  });

  describe('Alternate Multiplication', function() {
    it('should return a AST with ONE MUL instruction, with two factors (x3 and x4)', function() {
      var ast = [{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"IF","body":[{"is":"MOV","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"MOV","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"SFT","body":1},{"is":"MOV","body":-1},{"is":"MOV","body":-1},{"is":"SFT","body":-1}]}];
      assert.deepEqual(optimise({}, ast), [{"is":"SFT","body":2},{"is":"MUL","body":{"factors":[{"move":1,"factor":3},{"move":2,"factor":4}]}}]);
    });
  });
});

describe('Settings', function() {
  describe('Cell Bit Depth', function() {
    it('should return an array containing 65535, the highest possible unsigned 16bit integer', function() {
      let bf  = '-.';
      let c = uf.compiler({ type: Uint16Array, out: Number });
      assert.deepEqual(c.run(bf, ''), [ 65535 ]);
    });
  });

  describe('Tape Width', function() {
    it('should return undefined', function() {
      let bf  = '>>+.';
      let c = uf.compiler({ width: 2, out: Number });
      assert.deepEqual(c.run(bf, ''), [ undefined ]);
    });
  });

  describe('Interactive Target with optimization', function() {
    it('should return 0 and NOT 10', function( done ) {
      let bf  = ',++--[-].';
      let c = uf.compiler({ target: 'interactive-es6', in: Number, out: Number });

      let inp = () => 10;
      let out = (cell) => {
        done(assert.equal(cell, 0));
      }
      c.run(bf, inp, out);
    });
  });

  describe('Array tape type', function() {
    it('should return [256,0], NOT [0,0]', function() {
      let bf  = '+++++++++++++++[>+++++++++++++++++<-]>+.[-].';
      let c = uf.compiler({ type: Array, out: Number });
      assert.deepEqual(c.run(bf, ''), [256, 0]);
    });
  });
});

describe('AST Conversion', function() {
  describe('SFT', function() {
    describe('Positive', function() {
      it('should return an array containing a JS program that adds 2 to the current cell', function() {
        var ast = [{"is":"SFT","body":2}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]+=2"]);
      });
    });

    describe('Negative', function() {
      it('should return an array containing a JS program that subtracts 2 from the current cell', function() {
        var ast = [{"is":"SFT","body":-2}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]-=2"]);
      });
    });
  });

  describe('RELSFT', function() {
    it('should return an array containing a JS program that adds 1 to the current cell and the next cell', function() {
      var ast = [{"is":"RELSFT","body":{"value":1,"move":0}},{"is":"RELSFT","body":{"value":1,"move":1}}];
      assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]+=1","t[p+1]+=1"]);
    });
  });

  describe('MOV', function() {
    it('should return an array containing a JS program that moves the current cell pointer 2 cells to the right', function() {
      var ast = [{"is":"MOV","body":2}];
      assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["p+=2"]);
    });
  });

  describe('SET', function() {
    it('should return an array containing a JS program that sets the current cell to 5', function() {
      var ast = [{"is":"SET","body":5}];
      assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]=5"]);
    });
  });

  describe('MUL', function() {
    describe('Copying', function() {
      it('should return an array containing a JS program that sets the next cell to the same value as the current cell', function() {
        var ast = [{"is":"SFT","body":1},{"is":"MUL","body":{"factors":[{"move":1,"factor":1}]}}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]+=1","t[p+1]+=t[p]","t[p]=0"]);
      });
    });

    describe('Multiplicative Factor', function() {
      it('should return an array containing a JS program that sets the next cell to the result of 2*3', function() {
        var ast = [{"is":"SFT","body":3},{"is":"MUL","body":{"factors":[{"move":1,"factor":2}]}}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]+=3","t[p+1]+=t[p]*2","t[p]=0"]);
      });
    });
  });

  describe('INP', function() {
    describe('Simple ES6', function() {
      it('should return an array containing a JS program that pushes the next item in the input stack onto the current cell', function() {
        var ast = [{"is":"INP"}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]=(i.length<1?0:i.shift())"]);
      });
    });

    describe('Interactive ES6', function() {
      it('should return an array containing a JS program that pushes the result of the input function onto the current cell', function() {
        var ast = [{"is":"INP"}];
        assert.deepEqual(convert({ target: 'interactive-es6' }, ast), ["t[p]=i(t[p])"]);
      });
    });
  });

  describe('OUT', function() {
    describe('Simple ES6', function() {
      it('should return an array containing a JS program that pushes the current cell onto the output stack', function() {
        var ast = [{"is":"OUT"}];
        assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["o.push(t[p])"]);
      });
    });

    describe('Interactive ES6', function() {
      it('should return an array containing a JS program that runs the output function with the current cell\'s data', function() {
        var ast = [{"is":"OUT"}];
        assert.deepEqual(convert({ target: 'interactive-es6' }, ast), ["o(t[p])"]);
      });
    });
  });

  describe('IF', function() {
    it('should return an array containing a JS program that begins a while loop that will run once and shift the cell pointer one cell to the right', function() {
      var ast = [{"is":"SFT","body":1},{"is":"IF","body":[{"is":"MOV","body":1}]}];
      assert.deepEqual(convert({ target: 'simple-es6' }, ast), ["t[p]+=1","while(t[p]!=0){p+=1}"]);
    });
  });
});

describe('Simple Programs', function() {
  describe('Addition', function() {
    it('should return an array containing the number 15 (the result of 5+10)', function() {
      let bf  = '+++++>++++++++++<[->+<]>.';
      let c = uf.compiler({ out: Number });
      assert.deepEqual(c.run(bf, ''), [ 15 ]);
    });
  });

  describe('Multiplication', function() {
    it('should return an array containing the number 15 (the result of 3*5)', function() {
      let bf  = '+++[>+++++<-]>.';
      let c = uf.compiler({ out: Number });
      assert.deepEqual(c.run(bf, ''), [ 15 ]);
    });
  });

  describe('Nested IF blocks', function() {
    it('should return an that says "Hello, World!"', function() {
      let bf  = '>>>>--<-<<+[+[<+>--->->->-<<<]>]<<--.<++++++.<<-..<<.<+.>>.>>.<<<.+++.>>.>>-.<<<+.';
      let c = uf.compiler();
      assert.equal(c.run(bf, ''), 'Hello, World!');
    });
  });

  describe('I/O', function() {
    it('should return an array containing the character "a"', function() {
      let bf  = ',.';
      let c = uf.compiler();
      assert.deepEqual(c.run(bf, 'a'), 'a');
    });
  });

  describe('I/O + Addition', function() {
    it('should return an array containing the number 15 (from the addition of the input values 5 and 10)', function() {
      let bf  = ',>,<[>+<-]>.';
      let c = uf.compiler({ in: Number, out: Number });
      assert.deepEqual(c.run(bf, [5, 10]), [ 15 ]);
    });
  });

  describe('Async I/O', function() {
    it('should return 5, the number inputted by the input lambda', function( done ) {
      let bf  = ',.';
      let c = uf.compiler({ target: 'interactive-es6', in: Number, out: Number });

      let inp = () => { return 5 }
      let out = (cell) => { done( assert.equal(cell, 5) ) }
      c.run(bf, inp, out);
    });
  });
});

describe('Complex Programs', function() {
  describe('Bubble Sort', function() {
    it('should return the sorted string of "cba" ("abc")', function() {
      let bf  = `
        [bsort.b -- bubble sort
        (c) 2016 Daniel B. Cristofani
        http://brainfuck.org/]
        >>,[>>,]<<[
        [<<]>>>>[
        <<[>+<<+>-]
        >>[>+<<<<[->]>[<]>>-]
        <<<[[-]>>[>+<-]>>[<<<+>>>-]]
        >>[[<+>-]>>]<
        ]<<[>>+<<-]<<
        ]>>>>[.>>]
      `;
      let c = uf.compiler();
      assert.deepEqual(c.run(bf, 'cba'), 'abc');
    });
  });

  describe('Square Numbers', function() {
    it('should return the character 3 on the 245th output call', function( done ) {
      let bf  = `
        ++++[>+++++<-]>[<+++++>-]+<+[
        >[>+>+<<-]++>>[<<+>>-]>>>[-]++>[-]+
        >>>+[[-]++++++>>>]<<<[[<++++++++<++>>-]+<.<[>----<-]<]
        <<[>>>>>[>>>[-]+++++++++<[>-<-]+++++++++>[-[<->-]+[<<<]]<[>+<-]>]<<-]<<-
        ]
        [Outputs square numbers from 0 to 10000.
        Daniel B Cristofani (cristofdathevanetdotcom)
        http://www.hevanet.com/cristofd/brainfuck/]
      `;
      let c = uf.compiler({ target: 'interactive-es6' });

      let i = 0;

      let inp = (cell) => { return cell };
      let out = (cell) => {
        i++;
        if (i === 245) {
          done(assert.equal(cell, '3'));
        }
      };

      c.run(bf, inp, out);
    });
  });

  describe('ASCII Tree', function() {
    it('should return a ASCII evergreen tree', function() {
      let bf  = `
        [xmastree.b -- print Christmas tree
        (c) 2016 Daniel B. Cristofani
        http://brainfuck.org/]

        >>>--------<,[<[>++++++++++<-]>>[<------>>-<+],]++>>++<--[<++[+>]>+<<+++<]<
        <[>>+[[>>+<<-]<<]>>>>[[<<+>.>-]>>]<.<<<+<<-]>>[<.>--]>.>>.
      `;
      let c = uf.compiler();
      let tree = `     *
    ***
   *****
  *******
 *********
     *
`
      assert.deepEqual(c.run(bf, '5'), tree);
    });
  });
});
