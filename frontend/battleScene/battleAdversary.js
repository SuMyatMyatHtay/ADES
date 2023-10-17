
const createAdversaryForm = document.getElementById('create-adversary-form');
const createAdversaryButton = document.getElementById('create-adversary-button');
const getAdversaryButton = document.getElementById('get-adversary-button');
const adversaryList = document.getElementById('adversary-list');

function isLocalhost(url) {
    return url.includes('localhost') || url.includes('127.0.0.1');
}

API_URL = (isLocalhost(window.location.hostname) != true ? 'https://' + window.location.hostname : 'http://localhost:3000');


createAdversaryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
})

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
        // console.log(response);
        window.alert("Adversary deleted successfully");
    }
    catch (error) {
        console.log(error);
    }
}

document.getElementById('create-adversary-form').addEventListener('submit', createAdversary);

document.getElementById('get-adversary-button').addEventListener('click', GetAllAdversary);

document.getElementById('updating-adversary-form').addEventListener('submit', updateAdversary);

document.getElementById('deleteAdversary').addEventListener('submit', deleteAdversary);