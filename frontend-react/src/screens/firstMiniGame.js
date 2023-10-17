import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/firstMiniGame.css";
import miniGameHero from "../images/miniGameHero.png";
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

const MiniGame = () => {
  const { level } = useParams();
  Array.prototype.last = function () {
    return this[this.length - 1];
  };

  Math.sinus = function (degree) {
    return Math.sin((degree / 180) * Math.PI);
  };

  const canvasRef = useRef(null);
  const heroImageRef = useRef(null);

  const [heroLoaded, setHeroLoaded] = useState(false);
  const [platforms, setPlatforms] = useState([{ x: 50, w: 50 }]);
  const [sticks, setSticks] = useState([{ x: 0, length: 0, rotation: 0 }]);
  const [phase, setPhase] = useState("waiting");
  const [lastTimestamp, setLastTimestamp] = useState(undefined);
  const [sceneOffset, setSceneOffset] = useState(0);
  const [score, setScore] = useState(0);
  const canvasWidth = 375;
  const canvasHeight = 375;
  const [heroX, setHeroX] = useState(canvasWidth / 2); // Provide the initial X position for the hero
  const [heroY, setHeroY] = useState(0);
  const platformHeight = 100;
  const heroDistanceFromEdge = 10;
  const paddingX = 100;
  let stretchingSpeed;
  if (level === "1") {
    stretchingSpeed = 35;
  } else if (level === "2") {
    stretchingSpeed = 25;
  } else {
    stretchingSpeed = 15;
  }
  const turningSpeed = 10; //4
  const walkingSpeed = 10; //4
  const transitioningSpeed = 2;
  const heroWidth = 45;
  const heroHeight = 45;
  const [ctx, setCtx] = useState(null);
  const heroImage = new Image();
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();
  let minimumGap;
  let maximumGap;
  let minimumWidth;
  let maximumWidth;
  let predefinedPlatforms = [];
  if (level === "1") {
    predefinedPlatforms = [
      { x: 50, w: 50 },
      { x: 180, w: 100 },
      { x: 400, w: 90 },
      { x: 600, w: 105 },
    ];
  } else if (level === "2") {
    predefinedPlatforms = [
      { x: 50, w: 50 },
      { x: 265, w: 90 },
      { x: 580, w: 80 },
      { x: 778, w: 75 },
    ];
  } else if (level === "3") {
    predefinedPlatforms = [
      { x: 50, w: 50 },
      { x: 250, w: 50 },
      { x: 500, w: 80 },
      { x: 750, w: 60 },
    ];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found in the DOM.");
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    setCtx(ctx); // Set the canvas context using useState hook

    resetGame();

    heroImage.onload = () => {
      heroImageRef.current = heroImage;
      setHeroLoaded(true);
    };
    heroImage.src = miniGameHero;
  }, [heroLoaded]);

  useEffect(() => {
    if (phase !== "waiting" && heroLoaded && ctx) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [phase, heroLoaded, ctx]);

  useEffect(() => { }, [phase, score]);

  function resetGame() {
    setPhase("waiting");
    setLastTimestamp(undefined);
    setSceneOffset(0);
    setScore(0);
    document.getElementById("containerForTwobuttons").style.display = "none";
    document.getElementById("score").innerText = score;

    setPlatforms(predefinedPlatforms.slice());

    setSticks([{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }]);

    setHeroX(platforms[0].x + platforms[0].w - heroDistanceFromEdge);
    setHeroY(0);
    draw();
  }

  function generatePlatform() {
    if (level === "1") {
      minimumGap = 80;
      maximumGap = 200;
      minimumWidth = 90;
      maximumWidth = 130;
    } else if (level === "2") {
      minimumGap = 80;
      maximumGap = 300;
      minimumWidth = 50;
      maximumWidth = 110;
    } else if (level === "3") {
      minimumGap = 80;
      maximumGap = 400;
      minimumWidth = 30;
      maximumWidth = 100;
    }
    setPlatforms((prevPlatforms) => {
      const lastPlatform = prevPlatforms[prevPlatforms.length - 1];
      const furthestX = lastPlatform ? lastPlatform.x + lastPlatform.w : 0;

      const x =
        furthestX +
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap));
      const w =
        minimumWidth +
        Math.floor(Math.random() * (maximumWidth - minimumWidth));

      return [...prevPlatforms, { x, w }];
    });
  }

  const handleMouseDown = () => {
    if (phase === "waiting") {
      setPhase("stretching");
      setLastTimestamp(performance.now());
    }
  };

  // Mouse up event handler
  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (phase === "stretching") {
      setPhase("turning");
    }
  };

  function animate(timestamp) {
    if (!lastTimestamp) {
      return;
    }

    switch (phase) {
      case "waiting":
        return;
      case "stretching": {
        const newSticks = [...sticks];
        newSticks.last().length +=
          (timestamp - lastTimestamp) / stretchingSpeed;
        setSticks(newSticks);
        break;
      }
      case "turning": {
        const newSticks = [...sticks];
        newSticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

        if (newSticks.last().rotation > 90) {
          newSticks.last().rotation = 90;

          const [nextPlatform] = thePlatformTheStickHits();
          if (nextPlatform) {
            //setScore((prevScore) => prevScore + 1);
            if (level === "1") {
              setScore((prevScore) => prevScore + 1);
            } else if (level === "2") {
              setScore((prevScore) => prevScore + 2);
            } else {
              setScore((prevScore) => prevScore + 3);
            }
            generatePlatform();
          }

          setSticks(newSticks);
          setPhase("walking");
        }
        break;
      }
      case "walking": {
        document.getElementById("score").innerText = score;
        const [nextPlatform] = thePlatformTheStickHits();

        if (nextPlatform) {
          const maxHeroX =
            nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
          const newHeroX =
            heroX + ((timestamp - lastTimestamp) / walkingSpeed) * walkingSpeed;

          // Ensure the hero does not move past the maximum maxHeroX position
          if (newHeroX > maxHeroX) {
            setHeroX(maxHeroX);
            setPhase("transitioning");
          } else {
            setHeroX(newHeroX);
          }
        } else {
          // If there's no next platform, the hero falls
          const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
          const newHeroX =
            heroX + ((timestamp - lastTimestamp) / walkingSpeed) * walkingSpeed;

          // Ensure the hero does not move past the maximum maxHeroX position
          if (newHeroX > maxHeroX) {
            setHeroX(maxHeroX);
            setPhase("falling");
            // setPhase('waiting');
          } else {
            setHeroX(newHeroX);
          }
        }
        break;
      }
      case "transitioning": {
        const newSceneOffset =
          sceneOffset + (timestamp - lastTimestamp) / transitioningSpeed;

        const [nextPlatform] = thePlatformTheStickHits();
        if (newSceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
          const newSticks = [...sticks];
          newSticks.push({
            x: nextPlatform.x + nextPlatform.w,
            length: 0,
            rotation: 0,
          });
          setSticks(newSticks);
          setPhase("secTransitioning");
        }

        setSceneOffset(newSceneOffset);
        break;
      }
      case "secTransitioning": {
        setPhase("waiting");
        break;
      }
      case "falling": {
        if (sticks.last().rotation < 180) {
          const newSticks = [...sticks];
          newSticks.last().rotation +=
            (timestamp - lastTimestamp) / turningSpeed;
          setSticks(newSticks);
          setHeroY(100);

          // Adding a delay of 1000 milliseconds (1 second) before setting the phase
          setTimeout(() => {
            setPhase("loadstickfalling");
          }, 150);
        }
        break;
      }
      case "loadstickfalling": {
        setPhase("gameover");
        break;
      }
      case "gameover": {
        setLastTimestamp(undefined);
        const finalscore = score;
        const score_s = parseInt(finalscore);
        let textScoress = `You got ${score_s}.00 points`;
        document.getElementById("scoreText").innerHTML = textScoress;
        document.getElementById("containerForTwobuttons").style.display =
          "block";
        const body = {
          clanID: clanID,
          scores: score_s,
        };
        const bodyData = {
          playerID: playerID,
          clanID: clanID,
          points: score_s,
          gameID: "1"
        };
        console.log(body);
        console.log(bodyData);
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
            .then(([response1, response2]) => {
              // Handle the responses from both requests
              console.log("Response from API 1:", response1.data);
              console.log("Response from API 2:", response2.data);
            })
            .catch((error) => {
              // Handle any errors that occurred during the requests
              console.error("Error:", error);
            });
        }
        return;
      }
      default:
        throw Error("Wrong phase");
    }

    draw();
    animationFrameRef.current = requestAnimationFrame(animate);

    setLastTimestamp(timestamp);
  }

  function thePlatformTheStickHits() {
    if (sticks.last().rotation !== 90) {
      throw new Error(`Stick is ${sticks.last().rotation}°`);
    }

    const stickFarX = sticks.last().x + sticks.last().length;

    // Use filter to find intersecting platforms
    const intersectingPlatforms = platforms.filter(
      (platform) =>
        platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    return intersectingPlatforms;
  }

  function draw() {
    if (!ctx) return; // Ensure ctx is available before drawing
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.translate(
      (window.innerWidth - canvasWidth) / 2 - sceneOffset,
      (window.innerHeight - canvasHeight) / 2
    );
    drawPlatforms();
    drawHero();
    drawSticks();
    ctx.restore();
  }

  function drawPlatforms() {
    platforms.forEach(({ x, w }) => {
      if (!ctx) return; // Check if ctx is defined before using it

      const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
      gradient.addColorStop(0, "#d9d9d9");
      gradient.addColorStop(1, "black");
      ctx.fillStyle = gradient;

      ctx.fillRect(
        x,
        canvasHeight - platformHeight,
        w,
        platformHeight + (window.innerHeight - canvasHeight) / 2
      );
    });
  }

  function drawHero() {
    if (!ctx || !heroLoaded || !heroImageRef.current) return;

    ctx.drawImage(
      heroImageRef.current,
      heroX - heroWidth / 2 - 10,
      //heroY + canvasHeight - platformHeight - heroHeight,
      heroY + canvasHeight - platformHeight - heroHeight + 5,
      heroWidth,
      heroHeight
    );
  }

  const drawSticks = () => {
    if (!ctx) {
      console.error("Canvas context (ctx) is not available.");
      return;
    }

    // Loop through the sticks and draw them
    sticks.forEach((stick) => {
      ctx.save();

      // Move the anchor point to the start of the stick and rotate
      ctx.translate(stick.x, canvasHeight - platformHeight);
      ctx.rotate((Math.PI / 180) * stick.rotation);

      // Draw stick
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -stick.length);
      ctx.stroke();

      // Restore transformations
      ctx.restore();
    });
  };

  const handleQuit = () => {
    if (clanID === null) {
      navigate("/playforself");
    } else {
      navigate("/playforclan");
    }
  };

  const handleRestart = () => {
    resetGame();
    document.getElementById("containerForTwobuttons").style.display = "none";
    setPhase("waiting");
    setHeroLoaded(false);
  };

  const handleSelectLevels = () => {
    navigate("/minigamelevel/1");
  };

  return (
    <div id="body_container">
      <div className="container">
        <div id="score"></div>
        <canvas
          ref={canvasRef}
          id="game"
          width="375"
          height="375"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        ></canvas>

        <div id="containerForTwobuttons">
          <div>
            <div style={{ textAlign: "center" }}>
              <p id="scoreText"></p>
            </div>
            <div>
              <button id="quitFromGame" onClick={() => handleQuit()}>
                QUIT
              </button>
              <button id="restartFromGame" onClick={() => handleRestart()}>
                RESTART
              </button>
              <button id="reselectGamelevels" onClick={() => handleSelectLevels()}>
                RESELECT LEVELS
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MiniGame;
