import React, { useEffect, useState } from "react";
import "../css/luckywheelStatistics.css";
import axios from "axios";

const url = "https://monster-cat-world.onrender.com";
var currentUrl = window.location.protocol + "//" + window.location.host;
if (
  window.location.hostname === "localhost" &&
  window.location.port === "3001"
) {
  currentUrl =
    window.location.protocol + "//" + window.location.hostname + ":3000";
}

const LuckyWheelStatistics = () => {
  const clanID = localStorage.getItem("clanIDForClanPage");

  const [statisticsData, setstatisticsData] = useState([]);
 

  useEffect(() => {
    axios.get(`${currentUrl}/api/freeGiftCard/luckywheelStatisticsDetails/${clanID}`)
    .then((response)=>{
        setstatisticsData(response.data);
    })
    
  }, []);

  const backtoLuckyWheel = () => {
    window.location.assign(url+ '/luckywheel');
  }

  return (
    <div id="maincontainerforlwStat">
    <div id='containerforluckywheelStatistics'>
         <div className="header">
        <button className="backButton" onClick={backtoLuckyWheel}>Back</button>
        <h1 style={{color:"black",marginRight:"40%",fontStyle:'italic'}}>Statistics</h1>
      </div>
        <div>
            <table className="statisticsTable">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Attempts</th>
                  <th>Clan Points Earned</th>
                  <th>1st Prizes Earned</th>
                  <th>2nd Prizes Earned</th>
                  <th>3rd Prizes Earned</th>
                </tr>
              </thead>
              <tbody id="tableBodyForMembers">
                {statisticsData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.playerName}</td>
                    <td>{data.times}</td>
                    <td>{data.totalPoints}</td>
                    <td>{data.totalFirstPrize}</td>
                    <td>{data.totalSecondPrize}</td>
                    <td>{data.totalThirdPrize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      
    </div>
    </div>
  );
};

export default LuckyWheelStatistics;
