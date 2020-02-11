/*----- constants -----*/
class GamePiece {
    constructor(player) {
        this.player = player;
        this.piece = document.createElement('span');
    }
    positionPiece(position) {
        if (this.player === -1) {
            this.piece.style.backgroundColor = 'black';
            this.piece.dataset.idx = this.player;
        }
        if (this.player === 1) {
            this.piece.style.backgroundColor = 'red';
            this.piece.dataset.idx = this.player;
        }
        position.appendChild(this.piece);
    }
}


/*----- app's state (variables) -----*/
let board;
let turn;

/*----- cached element references -----*/
const squareEls = document.querySelectorAll('.playable');
const titleEl = document.getElementById('turn');


/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', selectPiece);
document.getElementById('board').addEventListener('click', movePiece);
document.getElementById('reset').addEventListener('click', init);


/*----- functions -----*/
init();

function init() {
    board = [
        [ 1, 1, 1, 1],
        [ 1, 1, 1, 1],
        [ 1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
    ];
    turn = -1;
    render();
}

function render() {
    turn === -1 ? titleEl.textContent = "Black's Turn" : titleEl.textContent = "Red's Turn";
    renderPieces();
}

function renderPieces() {
    squareEls.forEach(function(square) {
        if (square.hasChildNodes()) square.firstChild.remove();
        if (board[square.dataset.x][square.dataset.y] === -1) {
            let blackPiece = new GamePiece(board[square.dataset.x][square.dataset.y]);
            blackPiece.positionPiece(square);
        } 
        if (board[square.dataset.x][square.dataset.y] === 1) {
            let redPiece = new GamePiece(board[square.dataset.x][square.dataset.y]);
            redPiece.positionPiece(square);
        }
    });
}

function selectPiece(evt) {
    if (evt.target.tagName !== 'SPAN') return;
    if (parseInt(evt.target.dataset.idx) !== turn) return;
    squareEls.forEach(function(square) {
        if (square.firstChild) square.firstChild.classList.remove('selected');
    });
    evt.target.classList.add('selected');
}

function movePiece(evt) {
    if (evt.target.className !== 'playable') return;
    if (board[evt.target.dataset.x][evt.target.dataset.y] !== 0) return;
    squareEls.forEach(function(square) {
        if (square.firstChild) {
            if (square.firstChild.className === 'selected') {
                board[evt.target.dataset.x][evt.target.dataset.y] = parseInt(square.firstChild.dataset.idx);
                board[square.dataset.x][square.dataset.y] = 0;
                turn *= -1;
                render();
            }
        } 
    });
}