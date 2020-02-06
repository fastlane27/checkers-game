# Checkers

### Description
Play classic **American Checkers** on an 8x8 checkerboard requiring two human players.

### User Stories
- AAU click on a checker to select it for a move.
- AAU click on a valid square to move the selected piece.
- AAU click the replay button to reset the board and start a new game.

### Wireframe
![alt text](wireframe.png "Checkers Wireframe")

### Pseudocode

```
1. Define required constants
 - Define two-dimensional array to store checkerboard positions
 - Define game object housing checker pieces by color for each player

2. Define game state variables
 - Define a turn variable to store and track player turns
 - Define a winner variable to track and check for win condition

3. Store elements on the page that will be accessed
 - Store the grid elements of the checkerboard
 - Store the turn/win message element
 
4. Initialize state variables
 - Initialize player turn by setting to 1 or -1 for player 1 and 2 respectively
 - Initialize winner to null to represent no current winner

5. Render the game based on state
 - Loop over the game object and render the game pieces to the board
 - Use the indexs of board to place each pieces in the correct position
 - If game piece captured, render to side of board
 - Set the turn/win message to display player turn if game not over or win message if winner
 
6. Handle players clicking game pieces and replay button
 - Obtain the index of the grid position clicked on by player and game piece
 - Obtain the indexs on the grid of valid move positions
 - If player clicks on valid position, move selected piece to new position
 - If move 'jumps' over enemy piece, remove ('capture') enemy piece
 - Remove handler from pieces captured
 - If player moves a piece, flip the turn value
 - If a player has no pieces on board, set win value to player number with pieces still on the grid
 - Reinitialize the game if player clicks on replay button
```
