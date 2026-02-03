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

    function getNumPlaced() {
        return numPlaced;
    }

    function setNumPlaced(n) {
        numPlaced = n;
    }

    return { getBoard, putMarker, resetBoard, getNumPlaced, setNumPlaced };
})();

function createPlayer(name, marker) {
    return { name, marker }
}

const GameController = (function () {
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");
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
        if (GameBoard.getNumPlaced() === 9) {
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
        GameBoard.setNumPlaced(0);
    }

    function getTurn() {
        return playerOneTurn;
    }

    return { makeMove, checkWinner, resetGame, playerOne, playerTwo, getTurn }
})();

const DisplayController = (function () {
    const boardContainer = document.querySelector(".board-container");
    const playerOneName = document.querySelector(".player-one-name");
    const playerTwoName = document.querySelector(".player-two-name");
    const gameMessage = document.querySelector(".game-message");
    const resetButton = document.querySelector("#reset");

    function renderGame() {
        GameController.resetGame();
        boardContainer.textContent = "";
        const board = GameBoard.getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const grid = document.createElement("div");
                grid.setAttribute("id", `${i}-${j}`);
                grid.textContent = board[i][j];
                boardContainer.appendChild(grid);
            }
        }
        playerOneName.textContent = GameController.playerOne.name;
        playerTwoName.textContent = GameController.playerTwo.name;

        gameMessage.textContent = `${GameController.playerOne.name}'s Turn`;
    }

    boardContainer.addEventListener("click", e => {
        const id = e.target.id;
        const i = id.at(0);
        const j = id.at(-1);
        const isOver = GameController.makeMove(i, j);
        e.target.textContent = GameBoard.getBoard()[i][j];
        switch(isOver) {
            case 1:
                gameMessage.textContent = `${GameController.playerOne.name} Wins!`;
                break;
            case 2:
                gameMessage.textContent = `${GameController.playerTwo.name} Wins!`;
                break;
            case 3:
                gameMessage.textContent = "Tie!";
                break;
            case 0:
                gameMessage.textContent = GameController.getTurn() ? `${GameController.playerOne.name}'s Turn` : `${GameController.playerTwo.name}'s Turn`;
                break;
        }
    });

    resetButton.addEventListener("click", () => {
        renderGame();
    });

    return { renderGame };
})();

DisplayController.renderGame();