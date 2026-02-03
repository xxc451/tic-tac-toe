const GameBoard = (function () {
    const board = Array.from({ length: 3 }, () => Array(3).fill(null));
    let numPlaced = 0

    function putMarker(x, y, marker) {
        if (board[x][y] === null) {
            board[x][y] = marker;
            numPlaced++;
            return true;
        }
        return false;
    }

    function getBoard() {
        const boardCopy = [];
        board.forEach((subArray) => boardCopy.push([...subArray]));
        return boardCopy
    }

    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = null;
            }
        }
        numPlaced = 0;
    }

    return { getBoard, putMarker, resetBoard, numPlaced };
})();

function createPlayer(name, marker) {
    return { name, marker }
}

const GameController = (function () {
    const playerOne = createPlayer("Player 1", "x");
    const playerTwo = createPlayer("Player 2", "o");
    const winPos = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ]
    let playerOneTurn = true;
    let gameOver = false;

    function makeMove(x, y) {
        if (!gameOver) {
            GameBoard.numPlaced++;
            let success = false;
            if (playerOneTurn) {
                success = GameBoard.putMarker(x, y, playerOne.marker);
            } else {
                success = GameBoard.putMarker(x, y, playerTwo.marker);
            }
            if (success) {
                playerOneTurn = !playerOneTurn;
                return checkWinner();
            }
        }
    }

    function checkWinner() {
        const board = GameBoard.getBoard()
        for (let i = 0; i < winPos.length; i++) {
            if (board[winPos[i][0][0]][winPos[i][0][1]] === board[winPos[i][1][0]][winPos[i][1][1]] && 
                board[winPos[i][0][0]][winPos[i][0][1]] === board[winPos[i][2][0]][winPos[i][2][1]] && 
                board[winPos[i][0][0]][winPos[i][0][1]] !== null) {
                    gameOver = true;
                    return playerOne.marker === board[winPos[i][0][0]][winPos[i][0][1]] ? 1 : 2;
            }
        }
        if (GameBoard.numPlaced === 9) {
            gameOver = true;
            return 3;
        } else {
            return 0;
        }
    }

    function resetGame() {
        playerOneTurn = true;
        gameOver = false;
        GameBoard.resetBoard();
        GameBoard.numPlaced = 0;
    }

    return { makeMove, checkWinner, resetGame }
})();