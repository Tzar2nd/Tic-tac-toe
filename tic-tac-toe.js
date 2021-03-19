const gameBoard = (() => {
    let board = Array(9).fill(0);

    const drawTextBoard = () => {
        for (let i = 0; i < board.length; i++) {
            if ((i + 1) % 3 === 0) {
                console.log(board.slice(i - 2, i + 1));
            }
        }
        console.log("-------------");
    };

    const setCell = (cell, value) => {
        board[cell-1] = value; 
    }

    const getValidMoves = () => {
        // !board[i] returns all non-falsy items. Non-falsy includes non-zero items 
        // so it returns free cells as free cells are zeros.  
        return [...board.keys()].filter(i => !board[i])
    }

    const getCell = (cell) => board[cell-1];
    const getLength = () => board.length; 
    const getBoard = () => board;
    const resetBoard = () => board = Array(9).fill(0);

    return { drawTextBoard, setCell, getCell, getLength, getBoard, getValidMoves,
            resetBoard }
})();

const game = (() => {
    let moves = [];
    let paused = false;

    const setPaused = (state) => paused = state;
    const isPaused = () => paused; 

    // Regex for isWin condition, see https://stackoverflow.com/a/65979060/15011558
    const isWin = () => /^(?:...)*([12])\1\1|^.?.?([12])..\2..\2|^([12])...\3...\3|^..([12]).\4.\4/.test(gameBoard.getBoard().join(""));
    const isDraw = () => moves.length === gameBoard.getLength();
    const isPlayable = () => !isWin() && !isDraw() && !isPaused();
    const turn = () => 1 + moves.length % 2;
    const getMoves = () => moves.length;
    const getgameStatus = (player) => {
        if (isWin()) {
            let winner = turn() % 2 + 1;
            return `Player ${winner} wins!`;
        }
        if (isDraw()) return `It's a draw`;
        if (isPlayable()) return ``;
        if (isPaused()) return ``;
    }

    const play = (move) => {
        if(gameBoard.getCell(move) !== 0 || !game.isPlayable()) return false; 
        gameBoard.setCell(move, turn());
        moves.push(move);
        console.log("Turn: " + moves.length);
        gameBoard.drawTextBoard();
        return true; 
    }

    const resetGame = () => {
        gameBoard.resetBoard();
        moves = [];
        paused = false;
        DOM.resetBoard();
        DOM.updategameStatus();
    }
    
    return { play, getMoves, turn, isWin, isDraw, isPlayable, setPaused, 
            isPaused, getgameStatus, resetGame }
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
        moves = gameBoard.getValidMoves();
        move = moves[Math.floor(Math.random() * moves.length)] + 1; // random
        console.log("Computer playing " + move);
        return game.play(move);
    }

    const isHuman = () => (playerType == "Human") ? true : false;

    return { getName, humanMove, computerMove, isHuman }
}

const DOM = (() => {
    const boardDiv = document.querySelector("#game-container");
    const message = document.querySelector("#message");
    const gameDiv = document.querySelector("#game-container");
    const resetButton = document.querySelector("#reset-button")
    const playerOneImage = document.querySelector("#player-one-image");
    const playerTwoImage = document.querySelector("#player-two-image");

    const getBoardDiv = () => boardDiv;
    const getMessage = () => message;
    const getResetButton = () => resetButton;
    const updategameStatus = (player) => {
        message.innerHTML = game.getgameStatus(player);
        
        if (game.turn() == 1) {
            playerOneImage.classList.add('glowing');
            playerTwoImage.classList.remove('glowing');
        } else {
            playerTwoImage.classList.add('glowing');
            playerOneImage.classList.remove('glowing');
        }

        if (!game.isPlayable()) { 
            gameDiv.classList.add('inactive');
        } else {
            gameDiv.classList.remove('inactive');
        }

        if (game.isWin() || game.isDraw()) {
            playerOneImage.classList.remove('glowing');
            playerTwoImage.classList.remove('glowing');
            resetButton.classList.remove('hideButton');
            resetButton.classList.add('showButton');

        }
    }

    const updateBoard = () => {
        board = gameBoard.getBoard();
        board.forEach((cell, i) => { 
            boardDiv.children[i].className = " XO"[cell] 
        });
    }

    const resetBoard = () => {
        board = gameBoard.getBoard();
        board.forEach((cell, i) => { 
            boardDiv.children[i].className = "";
        });
        resetButton.classList.remove('showButton');
        resetButton.classList.add('hideButton');
    }

    return { getBoardDiv, getMessage, updategameStatus, updateBoard, resetBoard,
             getResetButton }

})();

(function main() {
    const playerOne = Player('Carla', "Human");
    const playerTwo = Player('Ben-Bot', "Bot");

    DOM.getResetButton().addEventListener("click", (e) =>{
        game.resetGame();
    });

    DOM.getBoardDiv().addEventListener("click", (e) => {
        let move = Array.prototype.indexOf.call(e.target.parentNode.children, e.target) + 1;

        if (game.isPaused() == false && game.isPlayable()) {
            if (game.turn() == 1) {
                console.log("Player 1");
                playValidMove(playerOne, move);
                DOM.updateBoard();
                DOM.updategameStatus(playerOne);
            } 
            
            if (!playerTwo.isHuman() && game.isPlayable() && game.turn() ==2) {
                console.log("Player 2");
                console.log(gameBoard.getValidMoves());
                playValidMove(playerTwo, move);
            }
        }

    });

    function playValidMove(player, move) {
        if (player.isHuman()) {
            player.humanMove(move);
        } else { 
            game.setPaused(true);
            DOM.updategameStatus();
            console.log("paused");
            setTimeout(() => {
                console.log("unpaused");
                game.setPaused(false);
                player.computerMove();
                DOM.updateBoard();
                DOM.updategameStatus(playerTwo);
            }, 500); 
        };
    }

})()

