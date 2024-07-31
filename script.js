const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameActive = true;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.setResult("");
    };

    const playRound = (index) => {
        if (gameActive && Gameboard.updateBoard(index, players[currentPlayerIndex].marker)) {
            if (checkWinner()) {
                DisplayController.setResult(`${players[currentPlayerIndex].name} wins!`);
                gameActive = false;
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                DisplayController.setResult("It's a tie!");
                gameActive = false;
            } else {
                currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            }
            DisplayController.renderBoard();
        }
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            return board[pattern[0]] !== "" &&
                   board[pattern[0]] === board[pattern[1]] &&
                   board[pattern[0]] === board[pattern[2]];
        });
    };

    return { startGame, playRound };
})();

const DisplayController = (() => {
    const gameboardDiv = document.getElementById('gameboard');
    const resultDiv = document.getElementById('result');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');

    startBtn.addEventListener('click', () => {
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;
        if (player1Name && player2Name) {
            Game.startGame(player1Name, player2Name);
        } else {
            alert("Please enter names for both players.");
        }
    });

    restartBtn.addEventListener('click', () => {
        Game.startGame(players[0].name, players[1].name);
    });

    gameboardDiv.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === "DIV") {
            const index = Array.from(gameboardDiv.children).indexOf(e.target);
            Game.playRound(index);
        }
    });

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        gameboardDiv.innerHTML = "";
        board.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = cell;
            gameboardDiv.appendChild(cellDiv);
        });
    };

    const setResult = (message) => {
        resultDiv.textContent = message;
    };

    return { renderBoard, setResult };
})();
