import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/leaderBoard.css";
import NavBar from "../components/NavBar"
const API_URL = "https://monster-cat-world.onrender.com";
const LeaderBoardScreen = () => {
  const [data, setData] = useState({
    firstClans: [],
    secondClans: [],
    thirdClans: [],
  });

  useEffect(() => {
    axios
      .get(API_URL + "/api/clanPoint/topClans")
      .then((response) => {
        console.log(response.data); // View in Browser's Developer Tools
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderFirstClans = () => {
    return data.firstClans.map((clan, index) => (
      <tr key={index}>
        <td>First</td>
        <td>{clan.clanName}</td>
        <td>{clan.clanPoint}</td>
      </tr>
    ));
  };

  const renderSecondClans = () => {
    return data.secondClans.map((clan, index) => (
      <tr key={index}>
        <td>Second</td>
        <td>{clan.clanName}</td>
        <td>{clan.clanPoint}</td>
      </tr>
    ));
  };

  const renderThirdClans = () => {
    return data.thirdClans.map((clan, index) => (
      <tr key={index}>
        <td>Third</td>
        <td>{clan.clanName}</td>
        <td>{clan.clanPoint}</td>
      </tr>
    ));
  };

  return (
    <div id="leaderboard">
      <div>
        <NavBar />
        <div className="container">
          <h1 id="title">LeaderBoard</h1>
        </div>
        <table id="topThreeClans" className="center">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Clan Name</th>
              <th>Clan Point</th>
            </tr>
          </thead>
          <tbody>{renderFirstClans()}</tbody>
          <tbody>{renderSecondClans()}</tbody>
          <tbody>{renderThirdClans()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoardScreen;
