/*----- constants -----*/
class GamePiece {
    constructor(player) {
        this.player = player;
        this.piece = document.createElement('span');
    }
    positionPiece(position) {
        if (this.player === 1) this.piece.style.backgroundColor = 'black';
        if (this.player === -1) this.piece.style.backgroundColor = 'red';
        position.appendChild(this.piece);
    }
}


/*----- app's state (variables) -----*/
let board;


/*----- cached element references -----*/
const squareEls = document.querySelectorAll('.playable');


/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', selectPiece);


/*----- functions -----*/

init();

function init() {
    board = [
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
    ];

    render();
}

function render() {
    squareEls.forEach(function(square) {
        if (board[square.dataset.x][square.dataset.y] === 1) {
            let blackPiece = new GamePiece(1);
            blackPiece.positionPiece(square);
        } 
        if (board[square.dataset.x][square.dataset.y] === -1) {
            let redPiece = new GamePiece(-1);
            redPiece.positionPiece(square);
        }
    });
}

function selectPiece(evt) {
    if (evt.target.tagName !== 'SPAN') return;
    console.log('game piece');
}