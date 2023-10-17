const API_URL = 'https://monster-cat-world.onrender.com'
const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
const missElement = document.getElementById("miss")
const restartBox = document.getElementById("containerForQuitAndRestart");
const startBox = document.getElementById("containerToStart");
const startButton = document.getElementById("start");
const scoreText = document.getElementById("scoreText");
const restartButton = document.getElementById("restart");
const quitButton = document.getElementById("quitFromGame");

//get clanID and playerID from local storage
const clanID = localStorage.getItem("clanIDForClanPage");
const playerID = localStorage.getItem("player_id");

if (clanID == null) {
  window.location.assign(API_URL + "/listOfClan.html");
}
let score = 0;
let misses = 0;
let gameTimer;
let characterTimer;
restartBox.style.display = "none";
gameArea.addEventListener("click", function (event) {
  if (event.target.classList.contains("character")) {
    event.target.style.display = "none";
    event.target.classList.remove("character");
    score++;
    scoreElement.textContent = score;
  }
});

function createcharacter() {
  var character = document.createElement("img");

  // Set the source and alt attributes
  character.src = "./images/cuteAnimal.png";
  character.alt = "Mini Game Hero";
  character.className = "character";
  const positionX = Math.floor(
    Math.random() * (gameArea.offsetWidth - 50)
  );
  const positionY = Math.floor(
    Math.random() * (gameArea.offsetHeight - 50)
  );
  character.style.left = positionX + "px";
  character.style.top = positionY + "px";
  gameArea.appendChild(character);
}

function startGame() {
  clearInterval(gameTimer);
  clearInterval(characterTimer);
  score = 0;
  misses = 0;
  scoreElement.textContent = score;
  gameArea.innerHTML = "";

  gameTimer = setInterval(function () {
    characterTimer = setTimeout(function () {
      createcharacter();
    }, 500);

    const characters = document.getElementsByClassName("character");
    if (characters.length > 0) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const character = characters[randomIndex];
      character.style.display = "block";

      setTimeout(function () {
        character.style.display = "none";
        character.parentNode.removeChild(character);
        if (character.classList.contains("character")) {
          misses++;
          missElement.textContent = misses;
          if (misses === 2) {
            gameOver();
          }
        }
        character.classList.remove("character");
      }, 1000);
    }
  }, 1500);
}

function gameOver() {
  clearInterval(gameTimer);
  clearInterval(characterTimer);
  let finalScores = scoreElement.innerHTML;
  console.log(finalScores);
  let text = `You got ${finalScores} points`;

  //update clan points
  const body = {
    clanID: clanID,
    scores: finalScores,
  };
  const bodyData = {
    playerID: playerID,
    clanID: clanID,
    points: finalScores,
  };
  console.log(body);
  console.log(bodyData);

  const axiosRequestToIncreasePoints = axios.put(
    API_URL + "/api/clanPoint/increaseClanPoints",
    body
  );
  const axiosRequestupdateInGameHistory = axios.post(
    API_URL + "/api/clanPoint/updateInGameHistory",
    bodyData
  );
  Promise.all([
    axiosRequestToIncreasePoints,
    axiosRequestupdateInGameHistory,
  ])
    .then(([response1, response2]) => {
      // Handle the responses from both requests
      console.log("Response from API 1:", response1.data);
      console.log("Response from API 2:", response2.data);
    })
    .catch((error) => {
      // Handle any errors that occurred during the requests
      console.error("Error:", error);
    });
  scoreText.innerHTML = text;
  restartBox.style.display = "block";
  gameArea.innerHTML = "";
}

//start Game
startBox.style.display = "block";
startBox.onclick = TostartGame;

function TostartGame() {
  startBox.style.display = "none";
  startGame();
}

restartButton.onclick = restartGame;

function restartGame() {
  restartBox.style.display = "none";
  startGame();
}

quitButton.onclick = goToclanPage;

function goToclanPage() {
  window.location.assign(API_URL + "/clanPointsPage.html");
}