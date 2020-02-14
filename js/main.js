/*----- constants -----*/
class GamePiece {
    constructor(posX, posY) {
        this.pieceEl = document.createElement('span');
        this.posX = posX;
        this.posY = posY;
        this.isKing = false;
    }
    renderKing() {
        this.pieceEl.innerHTML = '<img src="imgs/crown.png">';
    }
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
let jumpPositions;
let blackPoints;
let redPoints;

/*----- cached element references -----*/
const boardEl = document.getElementById('board');
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
    blackPoints = 12;
    redPoints = 12;
    jumpPositions = [];
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
        if (square.hasChildNodes() && board[x][y] === null) {
            square.classList.remove('occupied');
            square.firstChild.remove();
        }
        if (board[x][y] !== null && board[x][y].isKing) {
            board[x][y].renderKing();
        }
    });
}

function renderMessage() {
    if (blackPoints === 0 || redPoints === 0) {
        blackPoints === 0 ? titleEl.textContent = 'Red Wins!' : titleEl.textContent = 'Black Wins!';
    } else {
        turn === -1 ? titleEl.textContent = "Black's Turn" : titleEl.textContent = "Red's Turn";
    }
}

function handleSelect(evt) {
    if (evt.target.tagName !== 'SPAN' || parseInt(evt.target.dataset.player) !== turn) return;
    let selected = document.querySelector('.selected');
    if (selected !== null) {
        selected.classList.remove('selected');
    }
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
    makeKing(board[x][y]);
}

function clearPiece(x, y) {
    board[x][y].player === -1 ? blackPoints-- : redPoints--;
    checkWinner();
    board[x][y] = null;
}

function isValidMove(sel, tar) {
    let playerVal = parseInt(sel.dataset.player);
    let curX = parseInt(sel.dataset.posX);
    let curY = parseInt(sel.dataset.posY);
    let tarX = parseInt(tar.dataset.x);
    let tarY = parseInt(tar.dataset.y);
    if (jumpPositions.length === 0 || jumpPositions.every(elem => elem.jumpPos === null)) {
        if ((board[curX][curY].isKing && (tarX === curX - 1 || tarX === curX + 1)) || tarX === curX + playerVal) {
            if (tarY === curY) return true;
            else if (curX % 2 === 1 && tarY === curY - 1) {
                return true;
            } else if (curX % 2 === 0 && tarY === curY + 1) {
                return true;
            } else return false;
        }
    } else if (jumpPositions.some(elem => elem.jumpPos !== null)) {
        for (let i = 0; i < jumpPositions.length; i++) {
            if (curX === jumpPositions[i].startPos[0] && curY === jumpPositions[i].startPos[1] && tarX === jumpPositions[i].jumpPos[0] && tarY === jumpPositions[i].jumpPos[1]) {
                clearPiece(jumpPositions[i].adjacentPos[0], jumpPositions[i].adjacentPos[1]);
                return true;
            } 
        }
        return false;
    }
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
        jumpPositions = [];
        checkAdjacent();
    }
}

function checkAdjacent() {
    let pos = '';
    board.forEach(function(rows, x) {
        rows.forEach(function(position, y) {
            if (position !== null && position.player === turn) {
                if (x % 2 === 1) {
                    if (x > 0 && y > 0 && board[x-1][y-1] !== null && board[x-1][y-1].player !== position.player) {
                        if (position.player === -1 || position.isKing) {
                            pos = 'tl';
                            jumpPositions.push(storeJumpData(x, y, x-1, y-1, checkJump(x-1, y-1, pos)));
                        }
                    }
                    if (x > 0 && board[x-1][y] !== null && board[x-1][y].player !== position.player) {
                        if (position.player === -1 || position.isKing) {
                            pos = 'tr';
                            jumpPositions.push(storeJumpData(x, y, x-1, y, checkJump(x-1, y, pos)));
                        }
                    }
                    if (x < 7 && y > 0 && board[x+1][y-1] !== null && board[x+1][y-1].player !== position.player) {
                        if (position.player === 1 || position.isKing) {
                            pos = 'bl';
                            jumpPositions.push(storeJumpData(x, y, x+1, y-1, checkJump(x+1, y-1, pos)));
                        }
                    }
                    if (x < 7 && board[x+1][y] !== null && board[x+1][y].player !== position.player) {
                        if (position.player === 1 || position.isKing) {
                            pos = 'br';
                            jumpPositions.push(storeJumpData(x, y, x+1, y, checkJump(x+1, y, pos)));
                        }
                    }
               }
               if (x % 2 === 0) {
                    if (x > 0 && board[x-1][y] !== null && board[x-1][y].player !== position.player) {
                        if (position.player === -1 || position.isKing) {
                            pos ='tl';
                            jumpPositions.push(storeJumpData(x, y, x-1, y, checkJump(x-1, y, pos)));
                        }
                    }
                    if (x > 0 && y < 3 && board[x-1][y+1] !== null && board[x-1][y+1].player !== position.player) {
                        if (position.player === -1 || position.isKing) {
                            pos = 'tr';
                            jumpPositions.push(storeJumpData(x, y, x-1, y+1, checkJump(x-1, y+1, pos)));
                        }
                    }
                    if (x < 7 && board[x+1][y] !== null && board[x+1][y].player !== position.player) {
                        if (position.player === 1 || position.isKing) {
                            pos = 'bl';
                            jumpPositions.push(storeJumpData(x, y, x+1, y, checkJump(x+1, y, pos)));
                        }
                    }
                    if (x < 7 && y < 3 && board[x+1][y+1] !== null && board[x+1][y+1].player !== position.player) {
                        if (position.player === 1 || position.isKing) {
                            pos = 'br';
                            jumpPositions.push(storeJumpData(x, y, x+1, y+1, checkJump(x+1, y+1, pos)));
                        }
                    }
                }
            }
        });
    });
}

function checkJump(x, y, pos) {
    if (x % 2 === 1) {
        if (pos === 'tl' && x > 0 && y > 0 && board[x-1][y-1] === null) return [x-1, y-1];
        else if (pos === 'tr' && x > 0 && board[x-1][y] === null) return [x-1, y];
        else if (pos === 'bl' && x < 7 && y > 0 && board[x+1][y-1] === null) return [x+1, y-1];
        else if (pos === 'br' && x < 7 && board[x+1][y] === null) return [x+1, y];
        else return null;
    }
    if (x % 2 === 0) {
        if (pos === 'tl' && x > 0 && board[x-1][y] === null) return [x-1, y];
        else if (pos === 'tr' && x > 0 && y < 3 && board[x-1][y+1] === null) return [x-1, y+1];
        else if (pos === 'bl' && x < 7 && board[x+1][y] === null) return [x+1, y];
        else if (pos === 'br' && x < 7 && y < 3 && board[x+1][y+1] === null) return [x+1, y+1];
        else return null;
    }
}

function storeJumpData(startX, startY, adjX, adjY, jPos) {
    let jumpObj = {
        startPos: [startX, startY],
        adjacentPos: [adjX, adjY],
        jumpPos: jPos
    }
    return jumpObj;
}

function makeKing(piece) {
    if (piece.player === -1 && piece.posX === 0) piece.isKing = true;
    if (piece.player === 1 && piece.posX === 7) piece.isKing = true;
}

function checkWinner() {
    if (blackPoints === 0 || redPoints === 0) boardEl.style.pointerEvents = 'none';
    else boardEl.style.pointerEvents = 'auto'; 
}