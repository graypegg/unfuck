# Unf*ck. [![Build Status](https://travis-ci.org/toish/unfuck.svg?branch=master)](https://travis-ci.org/toish/unfuck) [![codecov](https://codecov.io/gh/toish/unfuck/branch/master/graph/badge.svg)](https://codecov.io/gh/toish/unfuck)

This module exposes a simple API to convert Brainf*ck to a Javascript function.

## Installation
```bash
$ npm install --save unfuck
```

```javascript
var uf = require('unfuck');
```

## API
`uf.compiler({ Settings Object })`

Returns a compiler object preloaded with the settings provided.

```javascript
{
	type: <Uint8Array | Uint16Array | Int8Array ... etc>,
	width: <Any Integer>,
	in: <Number | String>,
	out: <Number | String>,
	target: <'simple-es6' | 'interactive-es6'>,
}
```

### type
**Takes:** An array constructor<br>
**Default:** `Uint8Array`<br>
Dictates the type of the array representing the 'tape'. I suggest using [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#TypedArray_objects) because most versions of Brainfuck require some kind of bounded integer, but you can use the `Array` constructor as a value here for full 64bit integers. (Uint8Array is the most common, this bounds the values in the tape between 0 and 254)

### width
**Takes:** `Number`<br>
**Default:** `10240`<br>
The length of the 'tape'. Values at cells beyond this number, or less than 0, result in a error. You'll want this to be high, but not too high, as all cells are initiated with the value `0`, so 10240 8bit cells uses 10kB of memory at start-up. *(The size of each cell is determined by the type setting)*

### in
**Takes:** A type constructor (`String` or `Number`)<br>
**Default:** `String`<br>
The type of data the resulting javascript function will take as input. (The target option determines the source of input.)

* If it's set to `String`, the function will insert each [charCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt) sequentially when `,` is used.
* If it's set to `Number`, the function will insert the number supplied as input sequentially when `,` is used.

### out
**Takes:** A type constructor (`String` or `Number`)<br>
**Default:** `String`<br>
The type of data the resulting javascript function will return or include in it's output callback. (The target option determines the mode of output.)

* If it's set to `String`, the function will convert the number on the tape to a character via [fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)
* If it's set to `Number`, the function will return the numerical value of the cell on the tape.

### target
**Takes:** `String`<br>
**Default:** `'simple-es6'`<br>
Unfuck comes with a couple different compilation targets which affect how the outputted javascript can be used.

| Name | Description | Example Usage |
| :--: | ----------- | ------------- |
| `'simple-es6'` | Input is taken as an `Array` or `String` *(depending input type, `Number` and `String` respectively)* in the first and only parameter of the outputted javascript function. Each instance of `,` in Brainfuck will take the first element off of this array and insert it onto the tape. Output is the returned value of the function.| `c.use(',-.')([4,3])`<br>`c.use(',-.')('abc')` |
| `'interactive-es6'` | Input is received synchronously from the first parameter to the outputted javascript function, it should be a function which can take the current cell value as it's first parameter. The output is also processed synchronously by the second parameter which should be a function that takes the current cell as it's first parameter. | `c.use(',-.')((x)=>{`<br>&nbsp;&nbsp;`getLine('Number?')`<br>`}, (x)=>{`<br>&nbsp;&nbsp;`console.log(x)`<br>`})` |

---

`compiler.compile( Brainfuck String )`

Returns an object containing the sanitized brainfuck code, a copy of the Abstract Syntax Tree, and the outputted compiled code in a string. See example below for example output of this function.

---

`compiler.use( Brainfuck String )`

Returns a real Javascript function which takes input as it's only parameter and returns output, both in the type specified by the compiler object.

---

`compiler.run( Brainfuck String, Input )`

Executes the brainfuck function with input. Input should be pre-formatted to the compilers specs. (I.E. Number => [Int], String => "String")


## Example

```javascript
var uf = require('unfuck');

var compiler = uf.compiler({
	type: Uint16Array,
	in: Number,
	out: String,
	width: 9999
})

console.log( compiler.compile('++++++[>++++++++++<-]>+++++.') )
```

Which outputs the following:

```javascript
{
    "bf": "++++++[>++++++++++<-]>+++++.",
    "ast": [
        {
            "is": "SFT",
            "body": 6
        },
        {
            "is": "MUL",
            "body": {
                "factors": [
                    {
                        "move": 1,
                        "factor": 10
                    }
                ]
            }
        },
        {
            "is": "RELSFT",
            "body": {
                "value": 5,
                "move": 1
            }
        },
        {
            "is": "MOV",
            "body": 1
        },
        {
            "is": "OUT"
        }
    ],
    "out": "(function(i){var i=i.split('').map(x=>x.charCodeAt())||[];var o=[];var t=new Uint8Array(30000);var p=0;t[p]+=6;t[p+1]+=t[p]*10;t[p]=0;t[p+1]+=5;p+=1;o.push(t[p]);return o.map(x=>String.fromCharCode(x)).join('');})"
}
```
