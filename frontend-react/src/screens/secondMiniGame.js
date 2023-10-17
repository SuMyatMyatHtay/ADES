import React, { useState, useEffect, useRef } from "react";
import cuteAnimal from "../images/cuteAnimal.png";
import "../css/secondMiniGame.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
//const API_URL = 'https://monster-cat-world.onrender.com'

var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}
const clanID = localStorage.getItem("clanIDForClanPage");
const playerID = localStorage.getItem("player_id");

const SecondMiniGame = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameTimer, setGameTimer] = useState(null);
  const [characterTimer, setCharacterTimer] = useState(null);
  const [isGameStarted, setGameStarted] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const finalScoreRef = useRef(0);

  const gameAreaClickHandler = (event) => {
    if (event.target.classList.contains("character")) {
      event.target.style.display = "none";
      event.target.classList.remove("character");
      let score_increasingrate;
      if (level === "1") {
        score_increasingrate = 1;
      } else if (level === "2") {
        score_increasingrate = 2;
      } else {
        score_increasingrate = 3;
      }
      setScore((prevScore) => {
        const newScore = prevScore + score_increasingrate;
        finalScoreRef.current = newScore; // Update the final score using the ref
        return newScore;
      });
    }
  };

  const createCharacter = () => {
    var character = document.createElement("img");
    character.src = cuteAnimal;
    character.alt = "Mini Game Hero";
    character.className = "character";
    const positionX = Math.floor(Math.random() * (window.innerWidth - 150));
    const positionY = Math.floor(Math.random() * (window.innerHeight - 150));
    character.style.left = positionX + "px";
    character.style.top = positionY + "px";
    document.getElementById("gameArea").appendChild(character);
    let width;
    let height;
    if (level === "1") {
      width = "70px";
      height = "70px";
    } else if (level === "2") {
      width = "60px";
      height = "60px";
    } else {
      width = "50px";
      height = "50px";
    }
    character.style.width = width; // Set the desired width in pixels or any other CSS unit
    character.style.height = height;
  };

  const startGame = () => {
    setScore(0);
    setMisses(0);
    setGameStarted(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      document.getElementById("containerforscoreandmiss").style.display =
        "block";
      let game_speed;
      if (level === "1") {
        game_speed = 1000;
      } else if (level === "2") {
        game_speed = 850;
      } else {
        game_speed = 700;
      }
      const gameInterval = setInterval(() => {
        setCharacterTimer(
          setTimeout(() => {
            createCharacter();
          }, 200)
        );

        const characters = document.getElementsByClassName("character");
        if (characters.length > 0) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          const character = characters[randomIndex];
          character.style.display = "block";

          setTimeout(() => {
            character.style.display = "none";
            character.parentNode.removeChild(character);
            if (character.classList.contains("character")) {
              setMisses((prevMisses) => prevMisses + 1);
              if (misses === 1) {
                gameOver(score);
              }
            }
            character.classList.remove("character");
          }, 300);
        }
      }, game_speed);

      setGameTimer(gameInterval);

      return () => {
        clearInterval(gameInterval);
        clearTimeout(characterTimer);
      };
    }
  }, [isGameStarted, misses, isGameOver]);

  const quitGame = () => {
    console.log(clanID);
    if (clanID === null) {
      navigate("/playforself");
    } else {
      navigate("/playforclan");
    }
  };

  const restartGame = () => {
    document.getElementById("containerForQuitAndRestart").style.display =
      "none";
    startGame();
  };

  const handleSelectLevels = () => {
    navigate("/minigamelevel/2");
  };

  const gameOver = () => {
    clearInterval(gameTimer);
    clearTimeout(characterTimer);
    let finalScores = finalScoreRef.current;
    let text = "";
    console.log(clanID);
    text += `You got ${finalScores}.00 points`;
    document.getElementById("scoreTextforsecgame").innerHTML = text;
    document.getElementById("containerForQuitAndRestart").style.display =
      "block";
    document.getElementById("gameArea").innerHTML = "";
    setGameStarted(false);
    setGameOver(true);
    const body = {
      clanID: clanID,
      scores: finalScores,
    };
    const bodyData = {
      playerID: playerID,
      clanID: clanID,
      points: finalScores,
      gameID :"1"
    };
    if (clanID == null) {
      const axiosRequestToIncreaseGold = axios.put(
        currentUrl + "/api/clanPoint/increasePlayerGold",
        bodyData
      );
      const axiosRequestupdatePlayerHistory = axios.post(
        currentUrl + "/api/clanPoint/updatePlayerHistory",
        bodyData
      );
      Promise.all([
        axiosRequestToIncreaseGold,
        axiosRequestupdatePlayerHistory,
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
    } else {
      console.log(clanID);
      const axiosRequestToIncreasePoints = axios.put(
        currentUrl + "/api/clanPoint/increaseClanPoints",
        body
      );
      const axiosRequestupdateInGameHistory = axios.post(
        currentUrl + "/api/clanPoint/updateInGameHistory",
        bodyData
      );
      Promise.all([
        axiosRequestToIncreasePoints,
        axiosRequestupdateInGameHistory,
      ])
        .then(([response1, response2, response3]) => {
          // Handle the responses from both requests
          console.log("Response from API 1:", response1.data);
          console.log("Response from API 2:", response2.data);
        })
        .catch((error) => {
          // Handle any errors that occurred during the requests
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="containersss">
      <div id="containerforscoreandmiss">
        <p>
          Score: <span id="secgamescore">{score}</span>Miss:{" "}
          <span id="miss">{misses}</span>/2
        </p>
      </div>
      <div id="containerForQuitAndRestart" style={{ display: "none" }}>
        <div>
          <div style={{ textAlign: "center" }}>
            <p id="scoreTextforsecgame"></p>
          </div>
          <div>
            <button id="quitFromSecGame" onClick={quitGame}>
              QUIT
            </button>
            <button id="restartforsecgame" onClick={restartGame}>
              RESTART
            </button>
            <button
              id="reselectSecGamelevels"
              onClick={() => handleSelectLevels()}
            >
              RESELECT LEVELS
            </button>
          </div>
        </div>
      </div>
      {isGameStarted ? (
        <div>
          <div id="containersss">
            <div id="gameArea" onClick={gameAreaClickHandler}></div>
          </div>
        </div>
      ) : (
        <div>
          {misses >= 2 ? (
            <div style={{ display: "none" }}></div>
          ) : (
            <div id="containerToStart">
              <div>
                <div id="starttextforsecgame">
                  <p>Click on the groundhog before he disappears :</p>
                </div>
                <div>
                  <button id="startforsec" onClick={startGame}>
                    START
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecondMiniGame;
