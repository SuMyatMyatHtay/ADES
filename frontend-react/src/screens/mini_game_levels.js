import { React, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/gamelevels.css";

const clanID = localStorage.getItem("clanIDForClanPage");
const LevelsScreen = () => {
  const { minigameID } = useParams();
  const navigate = useNavigate();
  let textfordescription;

  if (minigameID === "1") {
    textfordescription = "\"Extension speed increases with level while the width get narrower\"";
  } else if (minigameID === "2") {
    textfordescription = "\"More compact and faster Hogs as the level rises\"";
  }
  useEffect(() => {
    console.log(document.getElementById("levelDescription"));
    document.getElementById("levelDescription").innerHTML = textfordescription;
  }, []);
  const handleLevelClick = (level) => {
    if (minigameID === "1") {
      navigate(`/firstminigame/${level}`);
    } else {
      navigate(`/secondminigame/${level}`);
    }
  };
  
  const handleBack = () => {
    if (clanID === null) {
      navigate("/playforself");
    } else {
      navigate("/playforclan");
    }
  };

  return (
    <div id="containerForgameLevel">
      <div id="containerforback">
        <button id="backButton" onClick={() => handleBack()}>Back</button>
      </div>
      <div id="secondcontainer">
      <div >
        <div>
          <h1 id="titleForgamelevel">Game Levels</h1>
        </div>
        <div id="thirdContainer">
          <p id="levelDescription"></p>
          <div id="buttonForLevels">
            <button id="level1" onClick={() => handleLevelClick(1)}>Easy</button>
            <button id="level2" onClick={() => handleLevelClick(2)}>Medium</button>
            <button id="level3" onClick={() => handleLevelClick(3)}>Hard</button>
          </div>
        </div>
        </div>
        </div>
    </div>
  );
};

export default LevelsScreen;
