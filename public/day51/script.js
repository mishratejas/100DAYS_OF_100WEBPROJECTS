// script.js — Minimax Tic Tac Toe (ES module)
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('newGameBtn');
const playerChoice = document.getElementById('playerChoice');

let board = Array(9).fill(null); // null, 'X' or 'O'
let human = 'X';
let ai = 'O';
let isHumanTurn = true;
let gameOver = false;

function init() {
  board = Array(9).fill(null);
  gameOver = false;
  human = playerChoice.value;
  ai = human === 'X' ? 'O' : 'X';
  isHumanTurn = human === 'X'; // X always goes first
  renderBoard();
  updateStatus();
  if (!isHumanTurn) {
    // ai starts
    setTimeout(aiMove, 300);
  }
}

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, i) => {
    const el = document.createElement('div');
    el.className = 'cell' + (cell || gameOver ? ' disabled' : '');
    el.textContent = cell ? cell : '';
    el.addEventListener('click', () => onCellClick(i));
    boardEl.appendChild(el);
  });
}

function onCellClick(i) {
  if (gameOver || board[i] || !isHumanTurn) return;
  board[i] = human;
  isHumanTurn = false;
  renderBoard();
  checkFlow();
  if (!gameOver) {
    setTimeout(aiMove, 250);
  }
}

function aiMove() {
  if (gameOver) return;
  const best = minimax(board, ai);
  if (best.index !== undefined) {
    board[best.index] = ai;
  } else {
    // pick first free as fallback
    const idx = board.findIndex((c) => c === null);
    if (idx >= 0) board[idx] = ai;
  }
  isHumanTurn = true;
  renderBoard();
  checkFlow();
}

function checkFlow() {
  const winner = checkWinner(board);
  if (winner) {
    gameOver = true;
    renderBoard();
    if (winner === 'tie') {
      statusEl.textContent = "It's a tie!";
    } else {
      statusEl.textContent = winner === human ? 'You win! 🎉' : 'AI wins — try again.';
    }
  } else {
    updateStatus();
  }
}

function updateStatus() {
  if (gameOver) return;
  statusEl.textContent = isHumanTurn ? "Your move" : "AI is thinking...";
}

// returns 'X'|'O'|null or 'tie'
function checkWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b1,c] of lines){
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  if (b.every(Boolean)) return 'tie';
  return null;
}

// Minimax algorithm returning {index, score}
function minimax(newBoard, player) {
  const avail = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);

  const winner = checkWinner(newBoard);
  if (winner === human) return {score: -10};
  else if (winner === ai) return {score: 10};
  else if (winner === 'tie') return {score: 0};

  const moves = [];

  for (let i=0;i<9;i++){
    if (newBoard[i] === null) {
      const move = {};
      move.index = i;
      newBoard[i] = player;

      if (player === ai) {
        const result = minimax(newBoard, human);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, ai);
        move.score = result.score;
      }

      newBoard[i] = null;
      moves.push(move);
    }
  }

  // choose best move
  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (const mv of moves){
      if (mv.score > bestScore){ bestScore = mv.score; bestMove = mv; }
    }
  } else {
    let bestScore = Infinity;
    for (const mv of moves){
      if (mv.score < bestScore){ bestScore = mv.score; bestMove = mv; }
    }
  }
  return bestMove || {score:0};
}

// wire buttons
newGameBtn.addEventListener('click', init);
playerChoice.addEventListener('change', init);

// initial render
init();
