import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/clanDetailsAndGames.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

var url =  "http://localhost:3001";
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Players' matches(current year)",
    },
  },
};
const ClanDetailsAndMiniGames = () => {
 const API_URL = "https://monster-cat-world.onrender.com";
  const navigate = useNavigate();
  const [clanName, setClanName] = useState("");
  const [clanPoints, setClanPoints] = useState("");
  const [playerGold, setplayerGold] = useState("");
  const [clanMembers, setClanMembers] = useState([]);
  const [topPlayer, setTopPlayer] = useState("");
  const [numberOfCards, setNumberOfCards] = useState([]);
  const [chartData, setChartData] = useState(null);

  const clanID = localStorage.getItem("clanIDForClanPage");
  const playerID = localStorage.getItem("player_id");
  const getClanInformation = useCallback(() => {
    axios
      .get(`${API_URL}/api/clanDetails/clanInformation/${clanID}`)
      .then((response) => {
        const { clanName, clanPoint } = response.data;
        setClanName(clanName);
        setClanPoints(clanPoint);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [API_URL, clanID]);

  const getplayerGold = useCallback(() => {
    axios
      .get(`${currentUrl}/api/clanDetails/playergold/${playerID}`)
      .then((response) => {
        setplayerGold(response.data.playerGold);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [playerID]);

  const getClanMemberDetails = useCallback(() => {
    axios
      .get(`${API_URL}/api/clanDetails/ClanMemberDetails/${clanID}`)
      .then((response) => {
        setClanMembers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [API_URL, clanID]);

  const getTopPlayer = useCallback(() => {
    axios
      .get(`${API_URL}/api/clanDetails/topPlayer/${clanID}`)
      .then((response) => {
        if (response.data.length !== 0) {
          setTopPlayer(response.data[0].player_username);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [API_URL, clanID]);

  const getNumberOfCards = useCallback(() => {
    axios
      .get(`${API_URL}/api/freeGiftCard/numberOfCards/${clanID}`)
      .then((response) => {
        setNumberOfCards(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [API_URL, clanID]);

  useEffect(() => {
    if (clanID === null) {
      navigate("/clanlist");
    } else {
      getClanInformation();
      getClanMemberDetails();
      getTopPlayer();
      getNumberOfCards();
      getplayerGold();
    }

    axios
      .get(`${API_URL}/api/clanDetails/playersAndtheirMatches/${clanID}`)
      .then((response) => {
        const data = response.data;
        const usernames = [];
        const points = [];
        console.log(response.data);
        data.forEach((item) => {
          usernames.push(item.player_username);
          points.push(item.points);
        });

        setChartData({
          labels: usernames,
          datasets: [
            {
              label: "Matchess",
              data: points,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [
    clanID,
    getClanInformation,
    getClanMemberDetails,
    getNumberOfCards,
    getTopPlayer,
    getplayerGold,
  ]);

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

  return (

    <div id='clanDetailsAndMiniGames' style={{ paddingLeft: "20px" }}>
      <div className="containerForClanDetailsPage">
        <div className="thirdContainer">
          <button id="togoGiftCardpage" onClick={switchToFreeCardPage}>
            Free Gift Card
          </button>
          <h1 id="clanNameInPage">{clanName}</h1>
          <button id="exit" onClick={exitFromClanPage}>
            Exit
          </button>
        </div>
        <div id="SecContainer">
          <h2 className="white-text" id="clanPointsAndGold">
            Clan Points: {clanPoints}
          </h2>
          <h2 className="white-text" id="clanPointsAndGold">
            Your Gold: {playerGold}
          </h2>
          <div>
            <div id="noOfCards">
              {numberOfCards.length === 0 ? (
                <div>
                  <div>First Prize: 0</div>
                  <div>Second Prize: 0</div>
                  <div>Third Prize: 0</div>
                </div>
              ) : (
                numberOfCards.map((card, index) => (
                  <div key={index}>
                    {card.freeCard_Name}: {card.no_of_cards}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <h3 className="white-text" id="topPlayer">
          {topPlayer && `Best Player from this mini game: ${topPlayer}`}
        </h3>
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
          <div>
            <table id="tableFormembers">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody id="tableBodyForMembers">
                {clanMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{member.player_username}</td>
                    <td>{member.Role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="chart-container">
          {chartData ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClanDetailsAndMiniGames;
