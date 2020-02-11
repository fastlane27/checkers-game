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
        let x = parseInt(square.dataset.x);
        let y = parseInt(square.dataset.y);
        if (board[x][y] === -1) {
            let blackPiece = new GamePiece(board[x][y]);
            blackPiece.positionPiece(square);
        } 
        else if (board[x][y] === 1) {
            let redPiece = new GamePiece(board[x][y]);
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
    let x = parseInt(evt.target.dataset.x);
    let y = parseInt(evt.target.dataset.y);
    if (board[x][y] !== 0) return;
    squareEls.forEach(function(square) {
        let selected = square.firstChild;
        let curPosX = parseInt(square.dataset.x);
        let curPosY = parseInt(square.dataset.y);
        if (selected) {
            if (selected.className === 'selected' && validMove(parseInt(selected.dataset.idx), curPosX, curPosY, x, y)) {
                board[x][y] = parseInt(selected.dataset.idx);
                board[curPosX][curPosY] = 0;
                turn *= -1;
                render();
            }
        } 
    });
}

function validMove(sIdx, curX , curY, tarX, tarY) {
    if (tarX === curX + sIdx) {
        if (tarY === curY) return true;
        else if (curX % 2 === 1 && tarY === curY - 1) {
            return true;
        } else if (curX % 2 === 0 && tarY === curY + 1) {
            return true;
        } else return false;
    }
}
