/* Denne funksjonen kal lage brettet */

function Gameboard(){
    const rows = 3;
    const columns = 3;
    const board = Array.from({ length: rows }, () => 
        Array.from({ length: columns }, () => Cell())
    );

    //Lager en 2d array som skal representere brettet
    // for (let i = 0; i < rows; i++) {
    //     board[i] = [];
    //     for (let j = 0; j < columns; j++) {
    //         board[i].push(Cell());
            
    //     }
    // }

    //Dette henter inn brettet
    const getBoard = () => board;

    function renderBoard(board) {
        const table = document.createElement('table');
        board.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            row.forEach((cell, colIndex) => {
                const td = document.createElement('td');
                td.textContent = cell.getValue();

                const handleClick = () => {
                    
                   if( placeMark(rowIndex, colIndex, game.getActivePlayer().mark)){
                        td.textContent = cell.getValue();

                        if (game.checkForWin(getFlatBoard())) {
                            
                            alert(`${game.getActivePlayer().name} won the round`);
                            
                            const allCells = document.querySelectorAll('td');

                            allCells.forEach(cell => {
                                cell.replaceWith(cell.cloneNode(true));
                            });
                            
                        } else {
                            game.switchingPlayers();
                        }
                   }
                }
                
                td.addEventListener('click', handleClick);
                tr.appendChild(td)
            })
            table.appendChild(tr)
        });
        return table;
    }
    


    function placeMark(row, column, player) {
          // Ensure the row and column are within bounds and the cell is available
        const cell = board[row][column];
        return cell.addMark(player);
    }
    

    function getFlatBoard() {
        return board.flat().map(cell => cell.getValue())
    }

    function printBoard() {
        return board.map((row) => row.map((cell) => cell.getValue()))
    }


    return {getBoard, placeMark, printBoard, renderBoard, getFlatBoard};
}

function Cell() {
    let value = 0

    const addMark = (player) => {
        if (value === 0) {
            value = player;
            return true;
        }
        return false;
    };

    const getValue = () => value;

    return {addMark, getValue}
}

function gameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            mark: 'X'
        },
        {
            name: playerTwoName,
            mark: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchingPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    

    

    const playRound = () => {
        document.body.appendChild(board.renderBoard(board.getBoard()));
    };

    const checkForWin = (squares) => {
        const winLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        for (let i = 0; i < winLines.length; i++) {
            const [a, b, c] = winLines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
           }
           return null;
        }
    return { playRound, getActivePlayer, checkForWin, switchingPlayers };
}

const game = gameController();

game.playRound(); // Start the game

