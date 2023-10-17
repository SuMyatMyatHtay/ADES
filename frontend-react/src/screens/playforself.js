import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/playforself.css";
import clanprofile from "../images/clanprofile.jpg";
import NavBar from '../components/NavBar'

var url = 'https://monster-cat-world.onrender.com';
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}

const Playforclanscreen = () => {
  const navigate = useNavigate();
  // const API_URL = "https://monster-cat-world.onrender.com";
  // const [clanName, setClanName] = useState("");
  const [playerName, setplayerName] = useState("");
  const [gold, setGold] = useState("");
  const [dateCreated, setdateCreated] = useState("");
  const [game1maxscore, setGame1maxscore] = useState("");
  const [game2maxscore, setGame2maxscore] = useState("");
  const [hasClan , sethasclan] = useState(true);

  //const clanID = localStorage.getItem("clanIDForClanPage");
  const playerID = localStorage.getItem("player_id");

  useEffect(() => {
    const fetchPlayerInfo = axios.get(
      `${currentUrl}/api/clanDetails/playergold/${playerID}`
    );

    const fetchMaxscoreGame1 = axios.get(
      `${currentUrl}/api/clanDetails/playermaxscoresforgame1/${playerID}`
    );

    const fetchMaxscoreGame2 = axios.get(
      `${currentUrl}/api/clanDetails/playermaxscoresforgame2/${playerID}`
    );
    const fetchPlayerClans= axios
    .get(`${currentUrl}/api/clanDetails/listOfClans/${playerID}`)
    Promise.all([fetchPlayerInfo, fetchMaxscoreGame1, fetchMaxscoreGame2,fetchPlayerClans])
      .then(
        ([
          playerInfoResponse,
          game1maxscoreResponse,
          game2maxscoreResponse,
          clanlist
        ]) => {
          if (clanlist.data.length === 0) {
            sethasclan(false);
            document.getElementById("containerforbackinself").style.display =
              "none";
            document.getElementById("containerforgridinself").style.marginTop="1%"
          } else {
            document.getElementById("textToJoinClan").style.display = "none";
          }
          setplayerName(playerInfoResponse.data.playerName);
          setGold(playerInfoResponse.data.playerGold);
          setdateCreated(playerInfoResponse.data.playerdateCreated);

          setGame1maxscore(
            parseInt(game1maxscoreResponse.data.max_score_game1)
          );

          setGame2maxscore(
            parseInt(game2maxscoreResponse.data.max_score_game2)
          );
        }
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [playerID]);

  const switchToGamePage = () => {
    window.location.assign(url + "/minigamelevel/1");
    //navigate("/firstminigame");
  };

  const switchToSecMiniGame = () => {
    window.location.assign(url + "/minigamelevel/2");
    //navigate("/secondminigame");
  };

  const exitFromClanPage = () => {
    localStorage.removeItem("clanIDForClanPage");
    navigate("/clanlist");
  };

  const gotoclanrequestpage = () => {
    navigate("/ClanRequest");
  };

  return (
    <div id="maincontainerforplayerpage">
       {hasClan === false ? ( <NavBar/>
       ):(
      <div id="containerforbackinself">
        <button id="backbuttoninself" onClick={exitFromClanPage}>
          Back
        </button>
      </div>)}
      <div id="containerforgridinself">
        <div className="sec-grid-container">
          <div className="secitem1">
            <img src={clanprofile} alt="Image description"></img>
          </div>
          <div className="secitem2">
            <p>
              Player Name<span id="secplayernametext">{playerName}</span>
            </p>
            <hr></hr>
          </div>
          <div className="secitem3">
            <p>
              Gold <span id="goldtext">{gold}</span>
            </p>
            <hr></hr>
          </div>
          <div className="secitem4">
            <p>
              Joined On<span id="joinedOntext">{dateCreated}</span>
            </p>
            <hr></hr>
          </div>
          <div className="secitem5">
            <div>
              <p
                style={{
                  fontFamily: "Verdana",
                  fontWeight: "bold",
                  fontSize: "23px"
                }}
              >
                Highest Score
              </p>
              <p className="highestscorestext">
                Little Adventure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ fontSize: "25px" }}>{game1maxscore}</span>
              </p>
              <p className="highestscorestext">
                Protect your treasures &nbsp;&nbsp;
                <span style={{ fontSize: "25px" }}>{game2maxscore}</span>
              </p>
            </div>
          </div>
          <div className="secitem6">
            <div>
              <div id="secminigametext">
                <p style={{ fontFamily: "Verdana", fontWeight: "bold" }}>
                  MiniGames
                </p>
              </div>
              <div style={{ display: "flex", marginLeft: "10px" }}>
                <div>
                  <button
                    id="firstGamebutton2"
                    onClick={switchToGamePage}
                  ></button>
                  <p>Little Adventure</p>
                </div>
                <div>
                  <button
                    id="secondGamebutton2"
                    onClick={switchToSecMiniGame}
                  ></button>
                  <p>Protect your treasures</p>
                </div>
              </div>
              <div id="textToJoinClan">
                <div>
                  <p style={{ marginLeft: "20px", marginBottom: "5px" }}>
                    To get more challenges,
                    <span style={{ fontWeight: "bold" }}>Join Clan</span>{" "}
                  </p>
                </div>
                <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                <button id="joinclanbutton" onClick={gotoclanrequestpage}>Join</button>
                </div>
              </div>
            </div>
          </div>
          <div className="secitem7">
            <div id="seccontainerfordescription">
              <p className="sectextfordesc" style={{ fontSize: "25px" }}>
                Little Adventure
              </p>
              <p className="sectextfordesc">
                "Help the little monster wiht his journey by building bridges in
                betweens."
              </p>
              <p className="sectextfordesc" style={{ fontSize: "25px" }}>
                Protect Your Treasures
              </p>
              <p className="sectextfordesc">
                "Sometimes the little  hogs will come to steal your treasures, get them out
little ground hogs"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playforclanscreen;
