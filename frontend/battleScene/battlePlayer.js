// const { moveCursor } = require("readline");
// const axios = require('axios');
// const { response } = require("express");

const createPlayerForm = document.getElementById('create-player-form');
const getPlayerButton = document.getElementById('get-players-button');
const playerList = document.getElementById('player-list');

function isLocalhost(url) {
    return url.includes('localhost') || url.includes('127.0.0.1');
}

API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');

createPlayerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
})

// const battleData = {
//     location: 'Arena',
//     time: 'any'
// };

// axios.post('http://localhost:3000/api/userRoute/')
// .then(response => {
//     console.log(response.data);
// })
// .catch(error => {
//     console.log(results);
// })

//to create players and their info about their attack type health and moves
//more as follows


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

document.getElementById('create-player-form').addEventListener('submit', createPlayer);

document.getElementById('get-players-button').addEventListener('click', GetAllPlayers);

document.getElementById('updating-player-form').addEventListener('submit', updatePlayers);

document.getElementById('deletePlayer').addEventListener('submit', deletePlayers);