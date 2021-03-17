// separation of concerns for DOM - create all of DOM in JS?

const gameBoard = (() => {
    const board = Array(9).fill(0);

    const drawTextBoard = () => {
        for (let i = 0; i < board.length; i++) {
            if ((i + 1) % 3 === 0) {
                console.log(board.slice(i - 2, i + 1));
            }
        }
        console.log("-------------");
    };

    const drawBoard = () => {

    }

    const setCell = (cell, value) => {
        board[cell-1] = value; 
    }

    const getCell = (cell) => board[cell-1];
    const getLength = () => board.length; 
    const getBoard = () => board;

    return { drawTextBoard, setCell, getCell, getLength, getBoard }
})();

const game = (() => {
    const moves = [];

    // Regex for isWin condition, see https://stackoverflow.com/a/65979060/15011558
    const isWin = () => /^(?:...)*([12])\1\1|^.?.?([12])..\2..\2|^([12])...\3...\3|^..([12]).\4.\4/.test(gameBoard.getBoard().join(""));
    const isDraw = () => moves.length === gameBoard.getLength();
    const isPlayable = () => !isWin() && !isDraw();

    const turn = () => 1 + moves.length % 2;
    const play = (move) => {
        if(gameBoard.getCell(move) !== 0 || !game.isPlayable()) return false; 
        gameBoard.setCell(move, turn());
        moves.push(move);
        console.log("Turn: " + moves.length);
        gameBoard.drawTextBoard();
        return true; 
    }

    const getMoves = () => moves.length
    
    return { play, getMoves, turn, isWin, isDraw, isPlayable }
})();

const Player = (name, playerType) => {
    const getName = () => name; 
    let move = 0; 
    
    function humanMove() {
        if (!game.isPlayable()) return false; 
        move = parseInt(prompt("Enter a grid position, " + name, 1));
        game.play(move);
    }

    function computerMove() {
        if (!game.isPlayable()) return false;
        move = Math.floor(Math.random() * 9) + 1
        game.play(move);
    }

    const isHuman = () => (playerType == "Human") ? true : false;

    return { humanMove, computerMove, isHuman }
}

(function main() {
    const playerOne = Player('Ben', "Bot");
    const playerTwo = Player('Robot', "Bot");

    gameBoard.drawTextBoard();
    simulateGame();

    function simulateGame() {
        while (game.isPlayable()) {
            if (!(game.turn() % 2) == 0) {
                console.log("Player 1");
                playerOne.isHuman() ? playerOne.humanMove() : playerOne.computerMove();
            } else {
                console.log("Player 2");
                playerTwo.isHuman() ? playerTwo.humanMove() : playerTwo.computerMove();
            }
        }
    }
})()

