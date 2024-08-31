// Gameboard creation and rendering
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => Cell())
    );

    const getBoard = () => board;

    function renderBoard(board, handleClick) {
        const table = document.createElement('table');
        board.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cell, colIndex) => {
                const td = document.createElement('td');
                td.textContent = cell.getValue();
                
                td.addEventListener('click', () => handleClick(rowIndex, colIndex, td));
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        return table;
    }

    function getFlatBoard() {
        return board.flat().map(cell => cell.getValue());
    }

    function printBoard() {
        return board.map((row) => row.map((cell) => cell.getValue()));
    }

    return { getBoard, renderBoard, getFlatBoard, printBoard  };
}

// Cell logic
function Cell() {
    let value = '';

    const addMark = (player) => {
        if (value === '') {
            value = player;
            return true;
        }
        return false;
    };

    const getValue = () => value;

    return { addMark, getValue };
}

// Game logic
function gameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    let board = Gameboard();

    let winsPlayerOne = 0, winsPlayerTwo = 0;

    const players = [
        { name: playerOneName, mark: 'X' },
        { name: playerTwoName, mark: 'O' }
    ];

    let activePlayer = players[0];

    const switchingPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        showActivePlayer();
    };

    const getActivePlayer = () => activePlayer;

    const showActivePlayer = () => {
        const p = document.getElementById('playingText');
        p.textContent = `${getActivePlayer().name}'s turn`;
    };

    const handleClick = (rowIndex, colIndex, cellElement) => {
        if (board.getBoard()[rowIndex][colIndex].addMark(getActivePlayer().mark)) {
            cellElement.textContent = board.getBoard()[rowIndex][colIndex].getValue();

            const winningCells = checkForWin(board.getFlatBoard());
            if (winningCells) {
                onWinScreen();

                if(getActivePlayer().mark === 'X'){
                    winsPlayerOne++;
                }else{
                    winsPlayerTwo++;
                }

                updateWinCounter();

                const allCells = document.querySelectorAll('td');
                allCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)));
            } else {
                switchingPlayers();
            }
        }
    };

    const showWinCounter = () => {
        let winCounter = document.getElementById('winCounter');
       
        if(!winCounter){
            winCounter = document.createElement('div');
            winCounter.id = 'winCounter';
            const showWinsPlayerOne = document.createElement('div');
            const showWinsPlayerTwo = document.createElement('div');

            showWinsPlayerOne.id = 'winsPlayerOne';
            showWinsPlayerTwo.id = 'winsPlayerTwo';

            updateWinCounter();
            
            winCounter.append(showWinsPlayerOne, showWinsPlayerTwo);
            document.body.appendChild(winCounter);
        }
    }

    const  updateWinCounter = () => {
        const showWinsPlayerOne = document.getElementById('winsPlayerOne');
        const showWinsPlayerTwo = document.getElementById('winsPlayerTwo');

        if (showWinsPlayerOne) {
            showWinsPlayerOne.textContent = `${playerOneName} Wins: ${winsPlayerOne}`;
        }
        if (showWinsPlayerTwo) {
            showWinsPlayerTwo.textContent = `${playerTwoName} Wins: ${winsPlayerTwo}`;
        }
        console.log(winsPlayerOne);
    }

    const checkForWin = (squares) => {
        const winLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < winLines.length; i++) {
            const [a, b, c] = winLines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return winLines[i];
            }
        }
        return null;
    };
 
    const onWinScreen = () => {
        const winScreen = document.createElement('div');
        winScreen.id = 'winScreen';

        const showWinnerScreen = document.createElement('div');
        showWinnerScreen.id = 'winner';
        showWinnerScreen.textContent = `${getActivePlayer().name} won the round`;
        
        const newRoundBtn = document.createElement('button');
        newRoundBtn.id = 'newRoundBtn';
        newRoundBtn.textContent = 'New Round';

        newRoundBtn.addEventListener('click', () => {
            const table = document.querySelector('table');
            const win = document.getElementById('winScreen');
            if (table) table.remove();
            if (win) win.remove();

            activePlayer = players[0];

            board = Gameboard();

            playRound()
        });

        winScreen.append(showWinnerScreen, newRoundBtn);
        document.body.append(winScreen);
    }

    const restartGameButton = document.getElementById('restart');
    restartGameButton.addEventListener('click', () => {
        const table = document.querySelector('table');
        const win = document.getElementById('winScreen');
        if (table) table.remove();
        if (win) win.remove();

        activePlayer = players[0];

        winsPlayerOne = 0;
        winsPlayerTwo = 0;
    
        // Reset the win counter display
        updateWinCounter();

        board = Gameboard();

        playRound()
    });

    const playRound = () => {
        document.body.appendChild(board.renderBoard(board.getBoard(), handleClick));
        showActivePlayer();
        showWinCounter();
    };

    return { playRound };
}

const game = gameController();
game.playRound(); // Start the game
