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
    // check if human or ai player have played in that spot 
    if (typeof origBoard[square.target.id] == 'number') {
        //if nobody have played in that spot 
        //following
        //human player taking a turn
        turn(square.target.id, huPlayer)
        //ai taking a turn 
        if (!checkTie()) turn(bestSpot(), aiPlayer);
    }

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
//gameoverfunction
function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            //if human player win, bkgrndcolor = blue, for ai = red 
            gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

//declare winner function passing in who for the declared winner
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

//empty squares function
function emptySquares() {
    //filter if type of element = a number
    //if we want to return number 
    return origBoard.filter(s => typeof s == 'number');
}

//best spot function, to find a spot for ai player to play
function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}
//check tie function
//checking if there is any empty squares left, if not = tie
function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

//Minimax function


function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);
    //check if someone is winning
    // returning value accordingly  
    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
        // 0 = there is no more room to play -> tie 
    } else if (availSpots.length === 0) {
        return { score: 0 }
    }
    //Collect the scores for each spot to evaluate 
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    // minimax should choose with the highest score when ai is playing
    // minimax should choose the lowest score when human is playing 
    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    }
    return moves[bestMove];
}
