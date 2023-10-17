import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/clanlist.css";
import NavBar from '../components/NavBar'

//const API_URL = "https://monster-cat-world.onrender.com";
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}
const player_id = localStorage.getItem("player_id");

const ClanlistScreen = () => {
  const [clanData, setClanData] = useState([]);
  const [selectedClan, setSelectedClan] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${currentUrl}/api/clanDetails/listOfClans/${player_id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          navigate("/playforself");
        } else {
          setClanData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [navigate]);

  const displayResponse = () => {
    return clanData.map((clan) => (
      <option key={clan.clanID} value={clan.clanID}>
        {clan.clan_name}
      </option>
    ));
  };

  const goToGamePage = () => {
    localStorage.setItem(
      "clanIDForClanPage",
      selectedClan || clanData[0].clanID
    );
    navigate("/playforclan");
  };

  const switchtoPlayerPage=()=>{
    localStorage.removeItem("clanIDForClanPage");
    navigate("/playforself");
  }

  return (
  <div id="maincontainerforclanList">
    <NavBar/>
    <div id="container5">
      <div id="container">
        <div id="text">Do you wanna play for yourself?</div>
        <button id="buttontogoPlayforself" onClick={switchtoPlayerPage}>Play for yourself</button>
        <hr style={{marginTop:"30px"}}></hr>
        <div id="textandDropdown">
          <p id="text">Do you wanna play for your clans?If so choose clan first..</p>
          <div className="dropdownMenu">
            <li className="nav-item">
              <label id="clans">list of clans</label>
              <select
                id="listOfClans"
                onChange={(e) => setSelectedClan(e.target.value)}
              >
                {displayResponse()}
              </select>
            </li>
          </div>
          <button id="chooseClan" onClick={goToGamePage}>
            Play for Clan
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ClanlistScreen;
