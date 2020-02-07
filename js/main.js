/*----- constants -----*/
class GamePiece {
    constructor(piece) {
        this.piece = 'O';
    }
}

/*----- app's state (variables) -----*/


/*----- cached element references -----*/
const gridEls = document.querySelectorAll('section');

/*----- event listeners -----*/


/*----- functions -----*/

// on or off the board
// red or black
// position

init();

function init() {
    render();
}

function render() {
    for (let gridEl in gridEls) {
        // console.log(gridEl.dataset.y);
        console.log(gridEl);
    }
}

/*
02, 04, 06, 08
09, 11, 13, 15
17, 19, 21, 23
*/