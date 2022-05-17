'use strict'

let closeBtn, gameOverMenu, winnerTeam, shader;
let currWinner = null, audioTrigger; 
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

const PLAYER="O",  AI="X";

let board;
let turn;

const SOLUTIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

window.onload = () => {
  turn = 1;
  gameInit();
}


let cellsClicked = (event) => {
  let cellAvailable = addArea(board, event.target.id, PLAYER);
  if (cellAvailable) {
    let result = checkWinner(board);
    turn = 0;
    if (result != false) {
      setResult(result);
    }else if (turn == 0) {
      computerTurn(board);
      turn = 1;
    }
  }
}

let gameInit = () => {
  currWinner = null;
  board = new Array(9);
  audioTrigger = true;

  closeBtn = document.getElementById("close");
  gameOverMenu= document.getElementById("gameOver")
  winnerTeam = document.getElementById("winTeam")
  shader = document.getElementById("shader");

  if (turn == 0) {
    setTimeout(()=>{
      randomMove(board);
    }, 500);
    turn = 1;
  }

  closeBtn.addEventListener("click", closeGameOverMenu, false);
  restartBtn.style.display="none";

  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].innerHTML = "";
    cells[cellIndex].style.backgroundColor = "pink"
    board.fill(null);
    cells[cellIndex].addEventListener ("click", cellsClicked, false);
  }
}

let closeGameOverMenu = () => {
  shader.style.opacity = "0";
  gameOverMenu.style.opacity = "0";

  setTimeout(()=> {
    shader.style.display = "none"
    gameOverMenu.style.display = "none";
  }, 300);
}

let playSound = (soundIndex) => {
  let musicArr = ["win","click","areaAdded","error"];
  if (Number.isInteger(soundIndex) != true) soundIndex = 2;
  let winSound = new Audio(`music/${musicArr[soundIndex]}.mp3`);
  winSound.volume = (soundIndex == 0) ? 0.3 : 0.7;
  winSound.play();
}

let gameOver = (result) => {
  setTimeout(playSound(0), 900);
  currWinner = result.winner;
  let winner = ( currWinner == 1) ? {team:"You", scoreId:"playerScore"} : (currWinner == 0)? {team:"Robot", scoreId:"enemyScore"} : {team: "Draw", scoreId: null};
  if (winner.scoreId != null) {
    let scorer = document.getElementById(winner.scoreId);
    scorer.innerHTML = Number(scorer.innerHTML) + 1;
  }
  shader.style.display = "block";
  gameOverMenu.style.display = "block";
  setTimeout(()=> {
    shader.style.opacity = "1.0"
    gameOverMenu.style.opacity = "1.0";
    restartBtn.style.display = "block";
  },300);
  winnerTeam.innerHTML = winner.team;
}
