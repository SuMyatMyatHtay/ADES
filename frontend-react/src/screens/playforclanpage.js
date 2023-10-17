import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/playforclan.css";
import clanprofile from "../images/clanprofile.jpg";

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
  const [clanName, setClanName] = useState("");
  const [playerName, setplayerName] = useState("");
  const [clanPoints, setClanPoints] = useState("");
  const [numberOfCards, setNumberOfCards] = useState([]);
  const [noOfFirstprize , setnoOfFirstprize] = useState(0);
  const [noOfSecprize , setnoOfSecprize] = useState(0);
  const [noOfTthirdprize , setnoOfTthirdprize] = useState(0);

  const clanID = localStorage.getItem("clanIDForClanPage");
  const playerID = localStorage.getItem("player_id");

  useEffect(() => {
    if (clanID === null) {
      //navigate("/clanlist");
    } else {
      const fetchClanInfo = axios.get(
        `${currentUrl}/api/clanDetails/clanInformation/${clanID}`
      );
      const fetchNumberOfCards = axios.get(
        `${currentUrl}/api/freeGiftCard/numberOfCards/${clanID}`
      );
      const fetchPlayerName = axios.get(
        `${currentUrl}/api/clanDetails/playergold/${playerID}`
      );

      Promise.all([fetchClanInfo, fetchPlayerName, fetchNumberOfCards])
        .then(([clanInfoResponse, playername, numberOfCardsResponse]) => {
          // Process each response here
          // const { clanName, clanPoint } = clanInfoResponse.data;
          console.log(clanInfoResponse.data);
          setClanName(clanInfoResponse.data.clanName);
          setClanPoints(clanInfoResponse.data.clanPoint);
          setplayerName(playername.data.playerName);
          setNumberOfCards(numberOfCardsResponse.data);
          console.log(numberOfCardsResponse.data);
          if(numberOfCardsResponse.data === null){
            setnoOfFirstprize(0);
            setnoOfSecprize(0);
            setnoOfTthirdprize(0);
          }
          else {
            for (let i = 0; i < numberOfCardsResponse.data.length; i++){
            if(numberOfCardsResponse.data[i].freeCard_Name === "First Prize"){
              console.log(numberOfCardsResponse.data[i].no_of_cards);
             setnoOfFirstprize(numberOfCardsResponse.data[i].no_of_cards)
            }
            else if (numberOfCardsResponse.data[i].freeCard_Name === "Second Prize"){
              setnoOfSecprize(numberOfCardsResponse.data[i].no_of_cards)
            }
            else if (numberOfCardsResponse.data[i].freeCard_Name === "Third Prize"){
              setnoOfTthirdprize(numberOfCardsResponse.data[i].no_of_cards)
            }
          }
          }
          console.log(numberOfCards);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [clanID]);

    const switchToGamePage = () => {
      window.location.assign(url + '/minigamelevel/1');
      //navigate("/firstminigame");
    };

    const switchToSecMiniGame = () => {
      window.location.assign(url+ '/minigamelevel/2');
      //navigate("/secondminigame");
    };

    const switchToFreeCardPage = () => {
      navigate("/giftCardPage");
    };

    const exitFromClanPage = () => {
      localStorage.removeItem("clanIDForClanPage");
      navigate("/clanlist");
    };

    const switchtoStatisticsPage  = () => {
      navigate("/minigamestatistics");
    };

    const switchToLuckyWheelPage  = () => {
      navigate("/luckywheel");
    };

  return (
    <div id="maincontainerforclanpagev2">
      <div id="containerforback">
        <button id="backbuttoninclanpage" onClick={exitFromClanPage}>Back</button>
      </div>
      <div id="containerforgrid">
        <div className="grid-container">
          <div className="item1">
            <img src={clanprofile} alt="Image description"></img>
          </div>
          <div className="item2">
            <p>
              Clan Name<span id="clannametext">{clanName}</span>
            </p>
            <hr></hr>
          </div>
          <div className="item3">
            <p>
              Player Name<span id="playernametext">{playerName}</span>
            </p>
            <hr></hr>
          </div>
          <div className="item4">
            <p>
              Clan Points<span id="clanpointstext">{clanPoints}</span>
            </p>
            <hr></hr>
          </div>
          <div className="item5">
            <div>
              <div style={{ display: "flex",marginBottom:"10%",gap: "50px" ,marginLeft:"7%" }}>
                <div className="prizes"><i className="fa fa-trophy" id="firsttrophyIcons" aria-hidden="true"></i>{noOfFirstprize}</div>
                <div className="prizes"><i className="fa fa-trophy" id="secondtrophyIcons" aria-hidden="true"></i>{noOfSecprize}</div>
                <div className="prizes"><i className="fa fa-trophy" id="thirdtrophyIcons" aria-hidden="true"></i>{noOfTthirdprize}</div>
              </div>
              <div style={{ display: "flex",marginLeft:"7%" }}>
                <button id="StatisticsInGames" onClick={switchtoStatisticsPage}>Statistics</button>
                <button id="freeGiftCard" onClick={switchToFreeCardPage} >Free Gift Card</button>
                <button id="luckywheelbutton" onClick={switchToLuckyWheelPage} >Lucky Wheel</button>
              </div>
            </div>
          </div>
          <div className="item6">
            <div>
              <div id="minigametext">
                <p style={{ fontFamily: 'Verdana',fontWeight:"bold" }}>MiniGames</p>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                <button id="firstGamebutton" onClick={switchToGamePage}></button>
                <p>Little Adventure</p>
                </div>
                <div>
                <button id="secondGamebutton" onClick={switchToSecMiniGame}></button>
                <p>Protect your treasures</p>
                </div>
              </div>
            </div>
          </div>
          <div className="item7">
            <div id="containerfordescription">
              <p className="textfordesc" style={{fontSize:"25px"}}>Little Adventure</p>
              <p className="textfordesc" >"Help the little monster wiht his journey by building bridges in betweens."</p>
              <p className="textfordesc"style={{fontSize:"25px"}}>Protect Your Treasures</p>
              <p className="textfordesc">"Sometimes the little  hogs will come to steal your treasures, get them out
little ground hogs"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playforclanscreen;