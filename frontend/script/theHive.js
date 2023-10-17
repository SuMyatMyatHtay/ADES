const API_URL = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
var ClanID
//get all players in the hive when browser is loaded
document.addEventListener("DOMContentLoaded", function (event) {
    if (player_id == null) {
        window.location.assign(`${API_URL}/Clan.html`)
    }
    //check if player belongs to clan
    axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
        .then((response) => {
            if (response.data.ClanID == null) {
                window.location.assign(`${API_URL}/Clan.html?${player_id}`);
            }
            ClanID = response.data.ClanID;
            axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                .then((result) => {
                    if (result.data.length == 0) {
                        window.location.assign(`${API_URL}/Clan.html`)
                    }
                    else {
                        putInHive();
                        getPlayers();
                        removeFromDC();
                    }

                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
    document.getElementById('loading').innerHTML = 'loading...'


});

function removeFromDC() {
    console.log("CLANID", ClanID)
    const DCEntranceCd = ClanID + '' + player_id
    console.log(DCEntranceCd);
    axios.delete(`${API_URL}/api/rooms/deleteFromDisco/${DCEntranceCd}`)
        .then((result) => {
            console.log("delete was successful", result);
        })
        .catch((error) => {
            console.log(error);
        })

}

document.getElementById('door').onclick = () => {
    window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clan_Name}`)
}
document.getElementById('exit').onclick = () => { window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clan_Name}`) }
//when clicked...
document.addEventListener("click", getCursorPosition, false);

function getCursorPosition(e) {
    var currentPlayerDiv = document.querySelector(`#playerDiv${player_id}`);

    // Calculate new x and y positions
    var xPosition = e.clientX - currentPlayerDiv.offsetLeft - (currentPlayerDiv.offsetWidth / 2);
    var yPosition = e.clientY - currentPlayerDiv.offsetTop - (currentPlayerDiv.offsetHeight / 2) - (currentPlayerDiv.offsetWidth / 2);

    // Check if new position is within bounds
    if (yPosition < 0) {
        yPosition = 0;
    }
    console.log(yPosition);

    var translateValue = `translate3d(${xPosition}px,${yPosition}px,0)`;
    currentPlayerDiv.style.transform = translateValue;
}



function getPlayers() {
    //for later use (image position)
    let position = [
        'top:90px;left:100px',
        'top:160px;left:370px',
        'top:150px;left:1080px',
        'top:50px;left:800px',
        'top:123px;left:600px',
        'top:0px;left:420px',
        'top:-20px;left:1000px',
        'top:150px;left:-20px',
        'top:-20px;left:680px',
        'top:-20px;left:0px',
        'top:150px;left:903px',
        'top:-20px;left:220px']

    //get location (The Hive or Disco Cosmo or RPS)
    var path = window.location.pathname;
    var removeLocalHost = path.split("/").pop();
    var removeHtml = removeLocalHost.split(".html");
    var location = removeHtml[0];
    let bodyData = {
        'location': location
    }

    axios.post(`${API_URL}/api/rooms/getAllPlayersInRoom/${ClanID}`, bodyData)
        .then((response) => {
            console.log(response.data);
            response.data.forEach((result) => {
                let player_id = result;
                axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
                    .then((result) => {
                        const image_id = result.data.image_id;
                        const player_username = result.data.player_username
                        console.log(image_id)
                        axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                            .then((result) => {
                                //Places where players avatar can be to avoid overlapping 
                                //i tried not to 'hard code' it but it caused a lag on the website
                                //choose position from array (to allow some sort of variation whenever player enter this TheHive.html)
                                var randomIndex = Math.floor(Math.random() * position.length)
                                var topLeft = position[randomIndex];
                                position.splice(randomIndex, 1)
                                document.getElementById('players').innerHTML += `
                                        <div id='playerDiv${player_id}' class='playerDiv'style='position:absolute;${topLeft}'>
                                        <img src='${result.data}' id='${player_id}'/>
                                        <p class="playerName">${player_username}</p>
                                        </div>
                                            `
                                document.getElementById('clanName').innerHTML = clan_Name + `'s Hive`
                                document.getElementById('loading').remove();
                                return;
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            });

        })
        .catch((error) => {
            console.log(error);
            return;
        })

}

function putInHive() {
    const bodyData = {
        "player_id": player_id,
        "ClanID": ClanID
    }
    axios.post(`${API_URL}/api/rooms/insertToHive`, bodyData)
        .then((response) => {
            console.log(response);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })
}