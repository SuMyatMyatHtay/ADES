
///import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/inBetween.css'

function App() {

  function isLocalhost(url) {
    return url.includes('localhost') || url.includes('3001');
  }

  // const playURouteDataDiv = document.getElementById('PlayURouteData');
 
  //const searchButton = document.getElementById('searchButton');

  function searchButton(event) {
     const searchBox = document.getElementById('searchBox');
    const Username = searchBox.value;
    console.log(Username);
    const body = {
      "username": Username
    }
  //  http://localhost:3000/api/playURoute
  axios.post(` http://localhost:3000/api/playURoute`,body)
    //This is the axios post and the Link that I use for the route to search for
    .then(function (response) {
      const data = response.data[0];
      console.log(response);

      //displaying using the html for data
      const playURouteDataDiv = document.getElementById('PlayURouteData');
      playURouteDataDiv.innerHTML = `
    <h2>Your ID: ${data.yourID}</h2> 
    <h2>Username: ${data.Username}</h2>
    <h2>Created: ${data.Created}</h2>
    <h2>Your Points: ${data.yourPoints}</h2> 
  `;
    }) // used a catch function to show results
    .catch((error) => {
      console.error(error); // when runs and unsuccessful, it will throw error
    });
  }

return (
  <div className="App">
      <div class="navbar">
            <a href='/battlePlayer'>Create Player</a> 
            <a href='/battleScene'>BATTLE</a> 
            <a href='/battleAdversary'>Create Adversary</a>
        </div>
    <input type="text" id="searchBox" placeholder="Enter player Username" />
    <button id="searchButton" onClick={(event) => searchButton(event)} > search me! </button>
    <div id="PlayURouteData"></div>
  </div>

);

};

export default App;
