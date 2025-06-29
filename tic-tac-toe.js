let cells = document.querySelectorAll('.cell');
let statusText = document.getElementById('status');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let aiEnabled = false;
let xWins = localStorage.getItem('xWins') || 0;
let oWins = localStorage.getItem('oWins') || 0;

const xScore = document.getElementById('x-score');
const oScore = document.getElementById('o-score');
xScore.textContent = xWins;
oScore.textContent = oWins;

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || gameOver) return;

  makeMove(index);

  if (aiEnabled && currentPlayer === 'O' && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index) {
  board[index] = currentPlayer;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = currentPlayer;

  if (checkWinner()) {
    showWinnerMessage(currentPlayer);
    highlightWinningCells();
    updateScore(currentPlayer);
    gameOver = true;
  } else if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function highlightWinningCells() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.querySelector(`.cell[data-index='${a}']`).classList.add('winner-cell');
      document.querySelector(`.cell[data-index='${b}']`).classList.add('winner-cell');
      document.querySelector(`.cell[data-index='${c}']`).classList.add('winner-cell');
    }
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winner-cell');
  });
  document.getElementById('winner-box').classList.remove('show');
}

function showWinnerMessage(player) {
  const winnerBox = document.getElementById('winner-box');
  const message = document.getElementById('winner-message');
  message.innerHTML = `${player} wins! 🎉`;
  winnerBox.classList.add("show");
}

function updateScore(player) {
  if (player === 'X') {
    xWins++;
    localStorage.setItem('xWins', xWins);
    xScore.textContent = xWins;
  } else {
    oWins++;
    localStorage.setItem('oWins', oWins);
    oScore.textContent = oWins;
  }
}

function toggleAI() {
  aiEnabled = !aiEnabled;
  document.getElementById('ai-btn').textContent = `Play vs AI: ${aiEnabled ? 'ON' : 'OFF'}`;
}

function aiMove() {
  const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomIndex);
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}