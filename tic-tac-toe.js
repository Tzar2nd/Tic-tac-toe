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

    const updateBoard = (boardDiv) => {
        board.forEach((cell, i) => { boardDiv.children[i].className = " XO"[cell] });
    }

    const setCell = (cell, value) => {
        board[cell-1] = value; 
    }

    const getCell = (cell) => board[cell-1];
    const getLength = () => board.length; 
    const getBoard = () => board;

    return { drawTextBoard, setCell, getCell, getLength, getBoard, updateBoard }
})();

const game = (() => {
    const moves = [];
    let paused = false;

    const setPaused = (state) => paused = state;
    const getPaused = () => paused; 

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
    
    return { play, getMoves, turn, isWin, isDraw, isPlayable, setPaused, getPaused }
})();

const Player = (name, playerType) => {
    const getName = () => name; 
    let move = 0; 
    
    function humanMove(move) {
        if (!game.isPlayable()) return false; 
        return game.play(move);
    }

    function computerMove() {
        if (!game.isPlayable()) return false;
        move = Math.floor(Math.random() * 9) + 1
        return game.play(move);
    }

    const isHuman = () => (playerType == "Human") ? true : false;

    return { humanMove, computerMove, isHuman }
}

(function main() {
    const boardDiv = document.querySelector("#game-container");
    const playerOne = Player('Ben', "Human");
    const playerTwo = Player('Robot', "Bot");

    boardDiv.addEventListener("click", (e) => {
        let move = Array.prototype.indexOf.call(e.target.parentNode.children, e.target) + 1;
        let round = 0;

        while (round < 2 && game.isPlayable()) {
            while(game.getPaused() == false) {
                if (!(game.turn() % 2) == 0) {
                    console.log("Player 1");
                    if (playValidMove(playerOne, move)) round++;
                    gameBoard.updateBoard(boardDiv);
                } else {
                    console.log("Player 2");
                    if (playValidMove(playerTwo, move)) round++;

                    game.setPaused(true);
                    setTimeout(() => {
                        game.setPaused(false);
                        gameBoard.updateBoard(boardDiv);
                    }, 500); 
                }
            }
        }
    });

    function playValidMove(player, move) {
        if (player.isHuman()) {
            return player.humanMove(move);
        } else { 
            return player.computerMove();
        };
    }

})()

