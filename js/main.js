/*----- constants -----*/
class GamePiece {
    constructor(posX, posY) {
        this.pieceEl = document.createElement('span');
        this.posX = posX;
        this.posY = posY;
        // this.isSelected = false;
        this.isKing = false;
    }
    // toggleSelect() {      
    //     this.isSelected = !this.isSelected;
    // }
}

class BlackPiece extends GamePiece {
    constructor(posX, posY) {
        super(posX, posY);
        this.player = -1;
        this.color = 'black';
    }
    placePiece(square) {
        this.pieceEl.dataset.player = this.player;
        this.pieceEl.dataset.posX = this.posX;
        this.pieceEl.dataset.posY = this.posY;
        this.pieceEl.style.backgroundColor = this.color;
        square.appendChild(this.pieceEl);
    }
}

class RedPiece extends GamePiece {
    constructor(posX, posY) {
        super(posX, posY);
        this.player = 1;
        this.color = 'red';
    }
    placePiece(square) {
        this.pieceEl.dataset.player = this.player;
        this.pieceEl.dataset.posX = this.posX;
        this.pieceEl.dataset.posY = this.posY;
        this.pieceEl.style.backgroundColor = this.color;
        square.appendChild(this.pieceEl);
    }
}

/*----- app's state (variables) -----*/
let board;
let turn;

/*----- cached element references -----*/
const squareEls = document.querySelectorAll('.playable');
const titleEl = document.getElementById('turn');


/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleSelect);
document.getElementById('board').addEventListener('click', handleMove);
document.getElementById('reset').addEventListener('click', init);


/*----- functions -----*/
init();

function init() {
    board = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ];
    turn = -1;
    clearBoard();
    populateBoard();
}

function clearBoard() {
    squareEls.forEach(function(square) {
        if (square.hasChildNodes()) square.firstChild.remove();
    });
}

function populateBoard() {
    for (let i = 5; i < 8; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = new BlackPiece(i, j);
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = new RedPiece(i, j);
        }
    }
    render();
}

function render() {
    renderPieces();
    renderMessage();
}

function renderPieces() {
    squareEls.forEach(function(square) {
        let x = parseInt(square.dataset.x);
        let y = parseInt(square.dataset.y);
        if (!square.hasChildNodes()) { 
            square.classList.remove('occupied');
            if (board[x][y] !== null && board[x][y].posX === x && board[x][y].posY === y) {
                board[x][y].placePiece(square);
                square.classList.add('occupied');
            }
        }
    });
}

function renderMessage() {
    turn === -1 ? titleEl.textContent = "Black's Turn" : titleEl.textContent = "Red's Turn";
}

// function selectPiece(tar) {
//     board[parseInt(tar.dataset.posX)][parseInt(tar.dataset.posY)].toggleSelect();
// }

function handleSelect(evt) {
    if (evt.target.tagName !== 'SPAN' || parseInt(evt.target.dataset.player) !== turn) return;
    let selected = document.querySelector('.selected');
    if (selected !== null) {
        // selectPiece(selected);
        selected.classList.remove('selected');
    }
    // selectPiece(evt.target);
    evt.target.classList.add('selected');
}

function movePiece(cur, tar) {
    let curX = parseInt(cur.dataset.posX);
    let curY = parseInt(cur.dataset.posY);
    let x = parseInt(tar.dataset.x);
    let y = parseInt(tar.dataset.y);
    board[x][y] = board[curX][curY];
    board[curX][curY] = null;
    board[x][y].posX = x;
    board[x][y].posY = y;
}

function handleMove(evt) {
    if (evt.target.className !== 'playable' || evt.target.className === 'occupied') return;
    let selected = document.querySelector('.selected');
    if (selected && isValidMove(selected, evt.target)) {
        selected.parentNode.classList.remove('occupied');
        movePiece(selected, evt.target);
        selected.classList.remove('selected');
        turn *= -1;
        render();
    }
}

function isValidMove(sel, tar) {
    let playerVal = parseInt(sel.dataset.player);
    let curX = parseInt(sel.dataset.posX);
    let curY = parseInt(sel.dataset.posY);
    let tarX = parseInt(tar.dataset.x);
    let tarY = parseInt(tar.dataset.y);
    if (board[curX][curY].isKing || tarX === curX + playerVal) {
        if (tarY === curY) return true;
        else if (curX % 2 === 1 && tarY === curY - 1) {
            return true;
        } else if (curX % 2 === 0 && tarY === curY + 1) {
            return true;
        } else return false;
    }
}

function checkForJump() {
    board.forEach(function(rows, idx) {
        rows.forEach(function(item, idx) {
            console.log(item);
        });
    });

    // board[3][1]      board[3][2]
    //         board[4][1]
    // board[5][1]      board[5][2]
    //
    // board[x-1][y] & board[x-1][y+1]
    // board[x+1][y] & board[x+1][y+1]


    // board[2][0]      board[2][1]
    //         board[3][1]
    // board[4][0]      board[4][1]
    //
    // board[x-1][y-1] & board[x-1][y]
    // board[x+1][y-1] & board[x+1][y]
}