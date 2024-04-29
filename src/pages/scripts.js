let origBoard;
let difficulty = "facil";

const huPlayer = { id: "O", icon: "/zero.svg" };
const aiPlayer = { id: "X", icon: "/equis.svg" };
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const statusGameVariables = {
  tie: "Tie Game!",
  win: "You win!",
  lose: "You lose!",
};

const button = document.querySelector(".replayButton");
button.addEventListener("click", startGame, false);

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endGame").style.display = "none";
  document.querySelector(".end-game-overlay").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer.id) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player.id;
  document.getElementById(
    squareId
  ).innerHTML = `<img class="vector" src="${player.icon}" />`;
  const gameWon = checkWin(origBoard, player.id);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  const plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (const [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (const index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer.id ? "greenyellow" : "#EA3333";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer.id ? "win" : "lose");
  document.querySelector(".endGame .text").style.color =
    gameWon.player == huPlayer.id ? "greenyellow" : "#EA3333";
}

function declareWinner(who) {
  document.querySelector(".endGame").style.display = "block";
  console.log(who);
  document.querySelector(".endGame .text").innerText = statusGameVariables[who];
  document.querySelector(".end-game-overlay").style.display = "flex";
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function getRandomNumber(probabilities) {
  const randomNumber = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomNumber < cumulativeProbability) {
      return i;
    }
  }
}

function bestSpot() {
  const spots = emptySquares();

  const randomSpot = spots[Math.floor(Math.random() * spots.length)];

  /* TODO CAMBIAR LA DIFICULTAD */
  const probabilityError = {
    extremo: 0.9,
    dificil: 0.7,
    medio: 0.5,
    facil: 0.3,
  };

  const errorProbably = getRandomNumber([
    probabilityError[difficulty],
    1 - probabilityError[difficulty],
  ]);

  if (errorProbably === 1) {
    return randomSpot;
  } else {
    return minimax(origBoard, aiPlayer.id).index;
  }
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "orange";
      cells[i].removeEventListener("click", turnClick, false);
    }
    document.querySelector(".endGame .text").style.color = "orange";
    declareWinner("tie");

    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  const availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer.id)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer.id)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer.id) {
      const result = minimax(newBoard, huPlayer.id);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer.id);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer.id) {
    let bestScore = -10000;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function getAllElements(searchTerm) {
  const elements = document.querySelectorAll(searchTerm);
  return Array.from(elements);
}

const buttons = getAllElements(".difficultyButton");

function normalizeString(string) {
  return string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    difficulty = normalizeString(button.textContent);
    getAllElements(".selected").forEach((button) =>
      button.classList.remove("selected")
    );
    button.classList.add("selected");
  });
  if (difficulty === normalizeString(button.textContent)) {
    button.classList.add("selected");
  }
});
