var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
//winning combos available 
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
//Function to start the game
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    //For loop to remove x & o from board when game restart
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    turn(square.target.id, huPlayer)
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    //check if game is won
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}



//function for the checkwin 
function checkWin(board, player) {
    //check what places on board have already been played in
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    //check if game is won by looping through every possible win combo 
    for (let [index, win] of winCombos.entries()) {
        //has the player in everyspot that counts as a win,if 
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player }
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            //if human player win, bkgrndcolor = blue, for ai = red 
            gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
}