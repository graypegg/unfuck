var uf = require('.');

var d = new uf({
	in:Number,
	out:Number,
	type:Uint16Array
});
var c = new uf({
	in:Number,
	type:Uint16Array
});

var program = ">,[>,]<[<]>[.>]"

console.log("result: ",c.run(program,[10,20,30,40,50]));
console.log(c.compile(program));
console.log(c.settings)
