[ { type: Uint16Array, in: Number, out: Number } ]

,>,			# Set first two cells from the input buffer
<[			# Go back to first cell and begin loop
	->+<	# Subtract from the first add to the second
]			# When first cell reaches zero stop loop
>.			# Output second cell's value (Sum)