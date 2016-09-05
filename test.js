var uf = require(".");
var c = uf.compiler({in:Number,out:Number});
console.log(c.compile(`

	>,[>,]
	<[<]
	>[.>]

`));