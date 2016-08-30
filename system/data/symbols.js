module.exports = [
	{
		"symbol": "[-]",
		"ast": {
			"is": "SET",
			"body": 0
		}
	},
	{
		"symbol": "[->+<]",
		"ast": {
			"is": "SUM"
		}
	},
	{
		"symbol": "[>+<-]",
		"ast": {
			"is": "SUM"
		}
	},
	{
		"symbol": ",[>,]",
		"ast": {
			"is": "RINP"
		}
	},
	{
		"symbol": "[.>]",
		"ast": {
			"is": "ROUT"
		}
	},
	{
		"symbol": "[]",
		"ast": false
	}
]