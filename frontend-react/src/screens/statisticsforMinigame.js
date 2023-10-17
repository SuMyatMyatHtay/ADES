import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/minigameStatistics.css";
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

var url = 'https://monster-cat-world.onrender.com';
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

const Playforclanscreen = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);
  const [topPlayer, setTopPlayer] = useState("");

  const clanID = localStorage.getItem("clanIDForClanPage");
  //const playerID = localStorage.getItem("player_id");

  useEffect(() => {
    const fetchChartData = axios.get(
      `${currentUrl}/api/clanDetails/playersAndtheirMatches/${clanID}`
    );
    const fetchTopPlayer = axios.get(
      `${currentUrl}/api/clanDetails/topPlayer/${clanID}`
    );
    Promise.all([fetchChartData, fetchTopPlayer])
      .then(([response1, response2]) => {
        const data = response1.data;
        const usernames = [];
        const points = [];
        console.log(response1.data);
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
        if (response2.data.length !== 0) {
          setTopPlayer(response2.data[0].player_username);
        } else {
          document.getElementById("topPlayerContainer").style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [clanID]);

  const switchToClanPage = () => {
    window.location.assign(url + "/playforclan");
    //navigate("/secondminigame");
  };

  return (
    <div id="maincontainerforstatisticsIngames">
      <div style={{ display: "flex" }}>
        <button id="gobacktoPlayerPage" onClick={switchToClanPage}>
          Back
        </button>
        <p style={{ fontSize: "40px", fontWeight: "bold", marginLeft: "35%" }}>
          Statistics
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>
          <div className="statistics-chart-container">
            {chartData ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
          <div id="topPlayerContainer">
            <p id="topPlayerText">Top Player&nbsp;&nbsp;:&nbsp;&nbsp; <span style={{fontStyle:"italic",fontWeight:"bold"}}>{topPlayer}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playforclanscreen;

