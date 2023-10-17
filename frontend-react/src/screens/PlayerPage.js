import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../css/clanDetailsAndGames.css";

var url =  "http://localhost:3001";
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}

const PlayerPageScreen = () => {
  //const API_URL = "https://monster-cat-world.onrender.com";
  const [playerName, setplayerName] = useState("");
  const [playerGold, setplayerGold] = useState("");
 
  const playerID = localStorage.getItem("player_id");

  const getplayerGold = useCallback(() => {
    axios
      .get(`${currentUrl}/api/clanDetails/playergold/${playerID}`)
      .then((response) => {
        setplayerName(response.data.playerName);
        setplayerGold(response.data.playerGold);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [playerID]);

  useEffect(() => {
      getplayerGold();  
  }, [
    getplayerGold,
  ]);

  const switchToGamePage = () => {
    window.location.assign(url + '/minigamelevel/1');
   // navigate("/firstminigame");
  };

  const switchToSecMiniGame = () => {
    window.location.assign(url + '/minigamelevel/2');
    //navigate("/secondminigame");
  };

 
  return (
    <div style={{ marginLeft: "20px" }}>
      <div className="containerForClanDetailsPage">
        <div className="thirdContainerForPlayerPage">
          <h1 id="clanNameInPage">{playerName}</h1>
        </div>
        <div id="SecContainer">
          <h2 className="white-text" id="clanPointsAndGold">
            Your Gold: {playerGold}
          </h2>
          <div>
          </div>
        </div>
        <div id="container4">
          <div>
            <h3 className="white-text" id="gameTitle">
              Mini Games
            </h3>
            <div style={{ display: "flex" }}>
              <button id="togoFirstGame" onClick={switchToGamePage}></button>
              <button id="togoSecGame" onClick={switchToSecMiniGame}></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPageScreen;
