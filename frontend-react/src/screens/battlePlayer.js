// const { moveCursor } = require("readline");
// const axios = require('axios');
// const { response } = require("express");
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/battleUser.css'

function App() {
  
    function isLocalhost(url) {
        return url.includes('localhost') || url.includes('3001');
    }

    const API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');

    const createPlayerForm = document.getElementById('create-player-form');
    const playerList = document.getElementById('player-list');


    const createPlayer = async (event) => {
        event.preventDefault();
        const attackTypeInput = document.getElementById('attack-type-input'); //attack type
        const healthInput = document.getElementById('health-input'); // health input
        const movesLeftInput = document.getElementById('moves-left-input');
        const statusInput = document.getElementById('status-input');
        const powerInput = document.getElementById('power-input');

        try {
            const response = await axios.post(API_URL + '/api/userRoute/', {
                attack_type: attackTypeInput.value,
                health: healthInput.value,
                moves_left: movesLeftInput.value,
                status: statusInput.value,
                power: powerInput.value,
            });
            // console.log(response);
            window.alert("Player created succesfully");

        }
        catch (error) {
            console.log(error);
        }
    };

    //to get all players
    const GetAllPlayers = async () => {
        try {
            const response = await axios.get(API_URL + '/api/userRoute/');
            const players = response.data;
            const playerList = document.getElementById('player-list');
            playerList.innerHTML = '';

            players.forEach(player => {
                const listItem = document.createElement('li');
                listItem.textContent = `Player ID: ${player.player_id} | Health: ${player.health} Moves Left: ${player.moves_left} | Status: ${player.status} | Power: ${player.power}`;
                playerList.appendChild(listItem);
            });
            // console.log(players)
            window.alert("Player get succesfully");
        }
        catch (error) {
            console.log(error);
        }
    };

    //to get players by ID
    const GetPlayerById = async () => {
        try {
            const playerIdInput = document.getElementById('player-id-input');
            const playerId = playerIdInput.value;

            const response = await axios.get(API_URL + '/api/userRoute/' + playerId);
            const player = response.data[0];

            const playerInfo = document.getElementById('player-info');
            playerInfo.innerHTML = '';

            if (!player) {
                console.log('No Player within this ID is avail');
                return;
            }

            const listItem = document.createElement('li');
            listItem.textContent = `Player ID: ${player.player_id} | Health: ${player.health} Moves Left: ${player.moves_left} | Status: ${player.status} | Power: ${player.power}`;
            playerList.appendChild(listItem);
        }
        catch (error) {
            console.log(error);
        }
    };

    // to update players
    const updatePlayers = async (event) => {
        event.preventDefault();
        const updatePlayerId = document.getElementById('updatePlayerIdInput').value;
        const updateAttack = document.getElementById('updateAttackInput');
        const updateHealth = document.getElementById('updateHealthInput');
        const updateMoves = document.getElementById('updateMovesInput');
        const updateStatus = document.getElementById('updateStatusInput');
        const updatePower = document.getElementById('updatePowerInput');

        try {
            const response = await axios.put(API_URL + `/api/userRoute/` + updatePlayerId, {
                attack_type: updateAttack.value,
                health: updateHealth.value,
                moves_left: updateMoves.value,
                status: updateStatus.value,
                power: updatePower.value,
            });
            // console.log(response);
            window.alert("Player updated succesfully");
        }
        catch (error) {
            console.log(error);
        }

    };

    const deletePlayers = async (event) => {
        event.preventDefault();
        const deletePlayerId = document.getElementById('deletePlayerId').value;

        try {
            const response = await axios.delete(API_URL + `/api/userRoute/` + deletePlayerId);
            // console.log(response);
            window.alert("Player deleted successfully");
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
          <div className="navbar">
            <a href='./battleAdversary'>Create Adversary</a>
            <a href='./battleScene'>Battle</a>
            <a href='./inBetween'>Your Characters</a>
          </div>
    
     
          <div className="container">
            <div className="box">
              <h2>Create Player</h2>
              <form id="create-player-form" onSubmit={createPlayer}>
      
                <label htmlFor="attack-type-input">Attack Type: </label>
                <input type="text" id="attack-type-input" name="attack_type" />
    
                <label htmlFor="health-input">Health: </label>
                <input type="number" id="health-input" name="health" />
    
                <label htmlFor="moves-left-input">Moves Left: </label>
                <input type="number" id="moves-left-input" name="moves_left" />
    
                <label htmlFor="status-input">Status: </label>
                <input type="text" id="status-input" name="status" />
    
                <label htmlFor="power-input">Power: </label>
                <input type="number" id="power-input" name="power" />
    
                <button type="submit">Create</button>
              </form>
            </div>
    
            <div className="box">
              <h2>Get all of the players</h2>
              <div id="all-players"></div>
              <ul id="player-list"></ul>
              <button id="get-players-button" onClick={GetAllPlayers}>
                All available players
              </button>
              <div>
                <label htmlFor="players-id-input">Enter Player ID: </label>
                <input type="text" id="player-id-input" />
                <button id="get-players-by-id-button" onClick={GetPlayerById}>
                  Get player by ID
                </button>
              </div>
              <ul id="player-info"></ul>
            </div>
    
            <div className="box">
              <h2>Updating Players by ID</h2>
              <form id="updating-player-form">
                <label htmlFor="updatePlayerId">Player ID: </label>
                <input
                  type="number"
                  id="updatePlayerIdInput"
                  name="updatePlayerId"
                  required
                />
    
                <label htmlFor="updateAttack">Update attack: </label>
                <input
                  type="text"
                  id="updateAttackInput"
                  name="updateAttack"
                  required
                />
    
                <label htmlFor="updateHealth">Update Health: </label>
                <input
                  type="number"
                  id="updateHealthInput"
                  name="updateHealth"
                  required
                />
    
                <label htmlFor="updateMoves">Update Moves: </label>
                <input
                  type="number"
                  id="updateMovesInput"
                  name="updateMoves"
                  required
                />
    
                <label htmlFor="updateStatus">Update Status: </label>
                <input
                  type="text"
                  id="updateStatusInput"
                  name="updateStatus"
                  required
                />
    
                <label htmlFor="updatePower">Update Power: </label>
                <input
                  type="number"
                  id="updatePowerInput"
                  name="updatePower"
                  required
                />
    
                <button type="submit" onClick={updatePlayers}>Update</button>
              </form>
            </div>
    

            <div className="box">
              <h2>Delete Player by ID</h2>
              <form id="deletePlayer">
                <label htmlFor="deletePlayerId">Player ID: </label>
                <input
                  type="number"
                  id="deletePlayerId"
                  name="deletePlayerId"
                  required
                />
                <button type="submit" onClick={deletePlayers}>Delete</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    
    export default App;