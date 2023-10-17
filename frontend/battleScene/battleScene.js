// Get DOM elements
const playerHealthElem = document.querySelector("#player-health span");
const playerMovesElem = document.querySelector("#player-moves span");
const attackButton = document.querySelector("#attack-button");
const battleMessageElem = document.querySelector("#battle-message");
const playerSelectElem = document.querySelector("#player-select");
const adversarySelectElem = document.querySelector("#adversary-select");

function isLocalhost(url) {
    return url.includes('localhost') || url.includes('127.0.0.1');
}

API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');

let player = null;
let adversary = null;

function updatePlayerStats() {
    playerHealthElem.textContent = player ? player.health : '';
    playerMovesElem.textContent = player ? player.moves : '';
}

function updateBattleMessage(message) {
    battleMessageElem.textContent = message;
}

let selectedPlayerId =null;

playerSelectElem.addEventListener('change', (event) => {
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
            attackButton.disabled = false;
            updateBattleMessage("Battle has begun");
        }
    } else {
        player = null;
        attackButton.disabled = true;
        updateBattleMessage("");
    }
});

function attack() {
    if (player && adversary) {
        const selectedPlayerId = playerSelectElem.value;
        const selectedAdversaryId = adversarySelectElem.value;
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

    axios.post(API_URL + '/api/battlePointsRoute', battleData)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
}

function populateSelectOptions(selectElement, data) {
    selectElement.innerHTML = '';

    data.forEach(item => {
       
        const option = document.createElement('option');
        option.value = item.player_id;
        option.textContent = `ID: ${item.player_id} | Health: ${item.health} Moves Left: ${item.moves_left}`;
        selectElement.appendChild(option);
    });
}

function populateSelectOption(selectElement, data) {
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
        const response = await axios.get(API_URL + '/api/adversaryRoute/');
        const adversaries = response.data;
        populateSelectOption(adversarySelectElem, adversaries);
        console.log(adversaries);
    } catch (error) {
        console.log(error);
    }
}


adversarySelectElem.addEventListener('change', (event) => {
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
            attackButton.disabled = false;
            updateBattleMessage("Battle has begun");
        }
    } else {
        adversary = null;
        attackButton.disabled = true;
        updateBattleMessage("");
    }
});

attackButton.addEventListener('click', () =>
attack(selectedPlayerId));

// document.getElementById("attack-button").addEventListener("click", function() {
//     // Perform your button's functionality here
//     attack();
//   });

getAllPlayers();
getAllAdversaries();