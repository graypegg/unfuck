# Bf2 Language Reference

## Original Syntax

### `+` (Addition)
#### Action
Adds 1 to the current cell on the tape.

#### Side effects
None

### `-` (Subtraction)
#### Action
Subtracts 1 to the current cell on the tape.

#### Side effects
None

### `>` (Right Shift)
#### Action
Increases the current cell register by 1.

#### Side effects
None

### `<` (Left Shift)
#### Action
Decreases the current cell register by 1.

#### Side effects
None

### `[` (Loop/If statement)
#### Action
* Contents (until the matching `]`) are executed if the current cell is not 0.
* Contents will loop over again if the contents of the loop result on a cell value that is not 0 after execution

#### Side effects
None

### `,` (Input)
#### Action
Remove one item from input array and place into current cell on the tape.

#### Side effects
Data pulled is erased from input array.

### `.` (Output)
#### Action
Insert a copy of the current cell onto the end of the output array.

#### Side effects
None
