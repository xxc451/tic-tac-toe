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

    return { getBoard, putMarker, resetBoard };
})();