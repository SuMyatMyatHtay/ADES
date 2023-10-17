// const { moveCursor } = require("readline");
// const axios = require('axios');
// const { response } = require("express");
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/battleScene.css'
const playerHealthElem = document.querySelector("#player-health span");
const playerMovesElem = document.querySelector("#player-moves span");
const attackButton = document.querySelector("#attack-button");
const battleMessageElem = document.querySelector("#battle-message");
const playerSelectElem = document.querySelector("#player-select");
const adversarySelectElem = document.querySelector("#adversary-select");

let player = null;
let adversary = null;


function App() {
    // Get DOM elements
    function isLocalhost(url) {
        return url.includes('localhost') || url.includes('3001');
    }

    const API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');


    function updatePlayerStats() {
        const playerHealthElem = document.querySelector("#player-health span");
        const playerMovesElem = document.querySelector("#player-moves span");
        playerHealthElem.textContent = player ? player.health : '';
        playerMovesElem.textContent = player ? player.moves : '';
    }

    function updateBattleMessage(message) {
        const battleMessageElem = document.querySelector("#battle-message");
        battleMessageElem.textContent = message;
    }

    let selectedPlayerId = null;

    function playerSelect(event) {
        const attackButton = document.querySelector("#attack-button");
        const playerSelectElem = document.querySelector("#player-select");
        const selectedPlayerId = event.target.value;
        console.log(event.target);
        if (selectedPlayerId) {
            playerSelectElem.disabled = true;
            player = {
                id: selectedPlayerId,
                health: '',
                moves: ''
            };
            console.log(selectedPlayerId);
            updatePlayerStats();
            if (adversary) {
                const attackButton = document.querySelector("#attack-button");
                attackButton.disabled = false;
                updateBattleMessage("Battle has begun");
            }
        } else {
            player = null;
            attackButton.disabled = true;
            updateBattleMessage("");
        }
    };

    function attack() {
        const attackButton = document.querySelector("#attack-button");
        const playerSelectElem = document.querySelector("#player-select");
        const adversarySelectElem = document.querySelector("#adversary-select");
        if (player && adversary) {
            // const selectedPlayerId = playerSelectElem.value;
            // const selectedAdversaryId = adversarySelectElem.value;
            const playerAttackDamage = Math.floor(Math.random() * 16) + 5;
            const adversaryAttackDamage = Math.floor(Math.random() * 16) + 5;

            player.health -= adversaryAttackDamage;
            adversary.health -= playerAttackDamage;
            // console.log(player.id.value);

            if (player.health <= 80 && adversary.health <= 80) {
                updateBattleMessage("It's a tie!");
                saveBattleResults(player.id, adversary.id, "tie", "location");
            }
            else if (player.health <= 85) {
                updateBattleMessage("The adversary defeated the player!");
                saveBattleResults(player.id, adversary.id, "adversary", "location");
            }
            else if (adversary.health <= 85) {
                updateBattleMessage("The player defeated the adversary!");
                saveBattleResults(player.id, adversary.id, "player", "location");
            }

            player.moves--;

            updatePlayerStats();

            // Clear player and adversary selection
            player = null;
            adversary = null;
            playerSelectElem.value = '';
            adversarySelectElem.value = '';

            // Enable player and adversary selection
            playerSelectElem.disabled = false;
            adversarySelectElem.disabled = false;

            // Disable attack button
            attackButton.disabled = true;
        }
    }
    function saveBattleResults(playerId, adversaryId, winner, location) {

        const battleData = {
            player_id: playerId,
            adversary_id: adversaryId,
            winner: winner,
            location: location
        };
        console.log(battleData)

        axios.post(API_URL + '/api/battlePointsRoute', battleData)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function populateSelectOptions(selectElement, data) {
        var selectElement = document.querySelector("#player-select");
        selectElement.innerHTML = '';

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.player_id;
            option.textContent = `ID: ${item.player_id} | Health: ${item.health} Moves Left: ${item.moves_left}`;
            selectElement.appendChild(option);
        });
    }

    function populateSelectOption(selectElement, data) {
        var selectElement = document.querySelector("#adversary-select");
        selectElement.innerHTML = '';

        data.forEach(items => {
            const option = document.createElement('option');
            option.value = items.adversary_id;
            option.textContent = `ID: ${items.adversary_id} | Health: ${items.health} Moves Left: ${items.moves_left}`;
            selectElement.appendChild(option);
        });
    }

    async function getAllPlayers() {
        try {
            const playerSelectElem = document.querySelector("#player-select");
            const response = await axios.get(API_URL + '/api/userRoute/');
            const players = response.data;
            console.log(players);
            populateSelectOptions(playerSelectElem, players);
        } catch (error) {
            console.log(error);
        }
    }

    async function getAllAdversaries() {
        try {
            const adversarySelectElem = document.querySelector("#adversary-select");
            const response = await axios.get(API_URL + '/api/adversaryRoute/');
            const adversaries = response.data;
            populateSelectOption(adversarySelectElem, adversaries);
            console.log(adversaries);
        } catch (error) {
            console.log(error);
        }
    }

    function AdversarySelect(event) {
        const adversarySelectElem = document.querySelector("#adversary-select");
        const attackButton = document.querySelector("#attack-button");
        const selectedAdversaryId = event.target.value;
        if (selectedAdversaryId) {
            adversarySelectElem.disabled = true;
            adversary = {
                id: selectedAdversaryId,
                health: '',
                moves: ''
            };
            console.log(selectedAdversaryId);
            updatePlayerStats();
            if (player) {
                const attackButton = document.querySelector("#attack-button");
                attackButton.disabled = false;
                updateBattleMessage("Battle has begun");
            }
        } else {
            adversary = null;
            attackButton.disabled = true;
            updateBattleMessage("");
        }
    };

    function attackClick() {
        console.log("here")
        // const attackButton = document.querySelector("#attack-button");
        attack(selectedPlayerId);
    }
    // document.getElementById("attack-button").addEventListener("click", function() {
    //     // Perform your button's functionality here
    //     attack();
    //   });

    getAllPlayers();
    getAllAdversaries();

    return (
        <div className="App">
            <div class="navbar">
                <a href='./battlePlayer'> Create Player </a>
                <a href='./battleAdversary'>Create Adversary</a>
                <a href='./inBetween'> Your Characters</a>
            </div>
            <h1> The Arena </h1>
            <div id="player-info">
                <h2> Player </h2>
                <div id="player-health">Health: <span></span></div>
                <div id="player-moves">Moves Left: <span></span></div>
            </div>

            <div id="battle-scene">
                <div id="battle-message"></div>
            </div>
            <div class="split">
                <div class="split left">
                    <div class="centered">
                        <img src={require("../images/bananameow.png")} alt="banana cat" />
                        <div id="selection">
                            <h2> Select Player </h2>
                            <select id="player-select" onChange={(e) => playerSelect(e)}></select>
                        </div>
                        <p>meow meow meow</p>
                    </div>
                </div>

                <div id="fifth" class="split center">
                    <button id="attack-button" onClick={() => attackClick()} > Attack! </button>
                </div>

                <div class="split right">
                    <div class="centered">
                        <img src={require("../images/watermelonmeow.png")} alt="watermelon cat" />
                        <div id="selection">
                            <h2> Select Adversary </h2>
                            <select id="adversary-select" onChange={(e) => AdversarySelect(e)}></select>
                        </div>
                        <p>rawr rawr</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default App;