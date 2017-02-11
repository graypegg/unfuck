let prepare  = require('../src/steps/prepare');
let analyse  = require('../src/steps/analyse');
let optimise = require('../src/steps/optimise');
let convert  = require('../src/steps/convert');
let wrap     = require('../src/steps/wrap');
let uf       = require('../dist/unfuck.js');

let assert  = require('assert');

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
      assert.deepEqual(optimise({}, analyse({}, '++')), [ { is: 'SFT', body: 2 } ]);
    });
  });

  describe('Nullifying', function() {
    it('should return a AST with no content', function() {
      assert.deepEqual(optimise({}, analyse({}, '++-++---+-+++-+---')), [ ]);
    });
  });

  describe('Cell Clearing', function() {
    it('should return a AST with SFT+10 and SET=0', function() {
      assert.deepEqual(optimise({}, analyse({}, '++++++++++[-]')), [ { is: 'SFT', body: 10 }, { is: 'SET', body: 0 } ]);
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
    it('should return an array containing the number 15 (from the addition of the input values 5 and 10)', function( done ) {
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
