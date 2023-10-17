// const { moveCursor } = require("readline");
// const axios = require('axios');
// const { response } = require("express");
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/battleAdversary.css'

function App() {
   
    function isLocalhost(url) {
        return url.includes('localhost') || url.includes('127.0.0.1');
    }
    
    const API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');
    
    const createAdversaryForm = document.getElementById('create-adversary-form');
    const adversaryList = document.getElementById('adversary-list');
    
    const createAdversary = async (event) => {
        event.preventDefault();
        const attackTypeInput = document.getElementById('attack-type-input'); //attack type
        const healthInput = document.getElementById('health-input'); // health input
        const movesLeftInput = document.getElementById('moves-left-input');
        const statusInput = document.getElementById('status-input');
        const powerInput = document.getElementById('power-input');
    
        try {
            const response = await axios.post(API_URL + '/api/adversaryRoute/', {
                attack_type: attackTypeInput.value,
                health: healthInput.value,
                moves_left: movesLeftInput.value,
                status: statusInput.value,
                power: powerInput.value,
            });
            // console.log(response);
            window.alert("Adversary created succesfully");
    
        }
        catch (error) {
            console.log(error);
        }
    };
    
    //to get all players
    const GetAllAdversary = async () => {
        try {
            const response = await axios.get(API_URL + '/api/adversaryRoute/');
            const adversary = response.data;
            const playerList = document.getElementById('adversary-list');
            playerList.innerHTML = '';
    
            adversary.forEach(adversary => {
                const listItem = document.createElement('li');
                listItem.textContent = `Adversary ID: ${adversary.adversary_id} | Health: ${adversary.health} Moves Left: ${adversary.moves_left} | Status: ${adversary.status} | Power: ${adversary.power}`;
                playerList.appendChild(listItem);
            });
            // console.log(players)
            window.alert("Adversary get succesfully");
        }
        catch (error) {
            console.log(error);
        }
    };
    
    //to get players by ID
    const GetAdversaryById = async () => {
        try {
            const adversaryIdInput = document.getElementById('adversary-id-input');
            const adversaryId = adversaryIdInput.value;
    
            const response = await axios.get(API_URL + '/api/adversaryRoute/' + adversaryId);
            const adversary = response.data[0];
    
            const adversaryInfo = document.getElementById('adversary-info');
            adversaryInfo.innerHTML = '';
    
            if (!adversary) {
                console.log('No Adversary within this ID is avail');
                return;
            }
    
            const listItem = document.createElement('li');
            listItem.textContent = `Adversary ID: ${adversary.adversary_id} | Health: ${adversary.health} Moves Left: ${adversary.moves_left} | Status: ${adversary.status} | Power: ${adversary.power}`;
            adversaryList.appendChild(listItem);
        }
        catch (error) {
            console.log(error);
        }
    };
    
    // to update players
    const updateAdversary = async (event) => {
        event.preventDefault();
        const updateAdversaryId = document.getElementById('updateAdversaryIdInput').value;
        const updateAttack = document.getElementById('updateAttackInput');
        const updateHealth = document.getElementById('updateHealthInput');
        const updateMoves = document.getElementById('updateMovesInput');
        const updateStatus = document.getElementById('updateStatusInput');
        const updatePower = document.getElementById('updatePowerInput');
    
        try {
            const response = await axios.put(API_URL + `/api/adversaryRoute/` + updateAdversaryId, {
                attack_type: updateAttack.value,
                health: updateHealth.value,
                moves_left: updateMoves.value,
                status: updateStatus.value,
                power: updatePower.value,
            });
            // console.log(response);
            window.alert("Adversary updated succesfully");
        }
        catch (error) {
            console.log(error);
        }
    
    };
    
    const deleteAdversary = async (event) => {
        event.preventDefault();
        const deleteAdversaryId = document.getElementById('deleteAdversaryId').value;
    
        try {
            const response = await axios.delete(API_URL + `/api/adversaryRoute/` + deleteAdversaryId);
            window.alert("Adversary deleted successfully");
        }
        catch (error) {
            console.log(error);
        }
    }
    
    return (
         <div className="App">
          <div className="navbar">
            <a href='./battlePlayer'>Create Player</a>
            <a href='./battleScene'>Battle</a>
            <a href='./inBetween'>Your Characters</a>
          </div>
     
          <div className="container">
            <div className="box">
              <h2>Create Adversary</h2>
              <form id="create-adversary-form" onSubmit={createAdversary}>
      
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
    
                <button type="submit" onClick={createAdversary}>Create</button>
              </form>
            </div>
    
            <div className="box">
              <h2>Get all of the players</h2>
              <div id="all-adversary"></div>
              <ul id="adversary-list"></ul>
              <button id="get-adversary-button" onClick={GetAllAdversary}>
                All available players
              </button>
              <div>
                <label htmlFor="adversary-id-input">Enter Adversary ID: </label>
                <input type="text" id="adversary-id-input" />
                <button id="get-adversary-by-id-button" onClick={GetAdversaryById}>
                  Get adversary by ID
                </button>
              </div>
              <ul id="player-info"></ul>
            </div>
    
            <div className="box">
              <h2>Updating Adversary by ID</h2>
              <form id="updating-adversary-form">
                <label htmlFor="updateAdversaryId">Adversary ID: </label>
                <input
                  type="number"
                  id="updateAdversaryIdInput"
                  name="updateAdversaryId"
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
    
                <button type="submit" onClick={updateAdversary}>Update</button>
              </form>
            </div>
    

            <div className="box">
              <h2>Delete Adversary by ID</h2>
              <form id="deleteAdversary">
                <label htmlFor="deleteAdversaryId">Player ID: </label>
                <input
                  type="number"
                  id="deleteAdversaryId"
                  name="deleteAdversaryId"
                  required
                />
                <button type="submit" onClick={deleteAdversary}>Delete</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
export default App;