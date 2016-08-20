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
	type: <Any Array-like object, typed arrays work best>,
	in: <Number | String>,
	out: <Number | String>,
	width: <Any Integer>
}
```

---

`compiler.compile( Brainfuck String )`

Returns an object containing the sanitized brainfuck code, a copy of the Abstract Syntax Tree, and the outputted Javascript function in a string. See example below for example output of this function.

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
      "is": "INC",
      "body": 6
    },
    {
      "is": "SFT",
      "body": 1
    },
    {
      "is": "INC",
      "body": 10
    },
    {
      "is": "MUL"
    },
    {
      "is": "SFT",
      "body": 1
    },
    {
      "is": "INC",
      "body": 5
    },
    {
      "is": "OUT"
    }
  ],
  "js": "(function(i){o=[];i=i||[];t=new Uint16Array(9999);p=0;t[p]+=6;p+=1;t[p]+=10;t[p]=t[p]*t[p-1];p+=-1;p+=1;t[p]+=5;o.push(t[p]);return o.map(x=>String.fromCharCode(x)).join('')})"
}
```
