
const API_URL = 'https://monster-cat-world.onrender.com'


var ClanID;
const queryParams = new URLSearchParams(window.location.search);
const clan_Name = queryParams.get('Clan_Name');
const player_id = localStorage.getItem('player_id');
let noMore = false;
//document.getElementById
let jumpBtn = document.getElementById('jumpBtn');
let discoCat = document.getElementById('discoCat');
let getGold = document.getElementById('getGold');
let exit = document.getElementById('exit');
//click
discoCat.onclick = mysteryChest;
jumpBtn.onclick = jump;
exit.onclick = () => {
    window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clan_Name}`)
};

//for jump
//make sure jump is finish to jump again
var progressDone = 1


const audio = document.querySelector('audio');
audio.addEventListener('canplay', () => {
    audio.volume = 0.2;

});

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
                        removeFromHive()
                        insertIntoDC();
                        getPlayers();
                    }
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
    jumpBtn.style.display = 'none';
    getGold.style.display = 'none';

});



function insertIntoDC() {
    console.log("CLANID", ClanID)
    const bodyData = {
        "player_id": player_id,
        "ClanID": ClanID
    }
    axios.post(`${API_URL}/api/rooms/insertToDC`, bodyData)
        .then((response) => {
            console.log(response);
            return;
        })
        .catch((error) => {
            console.log(error);
            return;
        })

}

function removeFromHive() {
    console.log("CLANID", ClanID)
    const hiveEntranceCd = ClanID + '' + player_id
    console.log(hiveEntranceCd);
    axios.delete(`${API_URL}/api/rooms/deleteFromHive/${hiveEntranceCd}`)
        .then((result) => {
            console.log("delete was successful", result);
        })
        .catch((error) => {
            console.log(error);
        })

}

function getPlayers() {
    console.log("CLANID", ClanID)
    //for later use (image position)
    //Places where players avatar can be. to avoid overlapping 
    //i tried not to 'hard code' it but it caused a lag on the website
    let position = [
        "top:190px;left:1080px",
        "top:160px;left:-10px",
        "top:35px;left:440px",
        "top:50px;left:100px",
        "top:90px;left:550px",
        "top:40px;left:270px",
        "top:35px;left:680px",
        "top:75px;left:1000px",
        "top:50px;left:820px",
        "top:200px;left:370px",
        "top:170px;left:903px",
        "top:220px;left:770px"]


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
                                //choose position from array (to allow some sort of variation whenever player enter this discoCosmo.html)
                                var randomIndex = Math.floor(Math.random() * position.length)
                                var topLeft = position[randomIndex];
                                position.splice(randomIndex, 1)
                                document.getElementById('players').innerHTML += `
                                        <div id='playerDiv${player_id}' class='playerDiv'style='position:absolute;${topLeft}'>
                                        <img src='${result.data}' id='${player_id}'/>
                                        <p class="playerName">${player_username}</p>
                                        </div>
                                            `
                                document.getElementById('raveName').innerHTML = clan_Name + `<p> Rave</p>`;
                                document.getElementById('jumpBtn').style.display = 'block';
                                document.getElementById('loading').style.display = 'none';
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

document.addEventListener("click", getCursorPosition, false);

function getCursorPosition(e) {
    audio.play();
    if (e.target.id == "jumpBtn" || e.target.id == "exit" || e.target.id == "discoCat") {
        return;
    }
    else {
        console.log(e.target.id);
        var currentPlayerDiv = document.querySelector(`#playerDiv${player_id}`);

        // Calculate new x and y positions
        var xPosition = e.clientX - currentPlayerDiv.offsetLeft - (currentPlayerDiv.offsetWidth / 2);
        var yPosition = e.clientY - currentPlayerDiv.offsetTop - (currentPlayerDiv.offsetHeight / 2) - (currentPlayerDiv.offsetWidth / 2);

        // Check if new position is within bounds
        if (yPosition < 0) {
            yPosition = 0;
        }
        var translateValue = `translate3d(${xPosition}px,${yPosition}px,0)`;
        currentPlayerDiv.style.transform = translateValue;
    }
}

function jump() {
    audio.play();
    if (progressDone == 1) {
        var playerDiv = document.getElementById(`playerDiv${player_id}`);
        var top = parseInt(playerDiv.style.top) || 0;
        var jumpHeight = 30;
        var jumpDuration = 200;
        var startTime = null;

        function animateJump(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }
            var elapsedTime = currentTime - startTime;
            var progress = Math.min(elapsedTime / jumpDuration, 1);
            progressDone = progress
            var deltaY = jumpHeight * 4 * progress * (1 - progress);
            playerDiv.style.top = (top - deltaY) + "px";
            if (progress < 1) {
                requestAnimationFrame(animateJump);
            }
        }
        requestAnimationFrame(animateJump);
    }

}

function mysteryChest() {
    if (noMore == false) {
        var mysteryNum = Math.floor(Math.random() * 100);
        console.log(mysteryNum);
        var duelNum = Math.floor(Math.random() * 100);
        console.log(duelNum);
        //basically if the num are equal, they get gold;
        if (mysteryNum == duelNum) {
            let bodyData = {
                "gold": 10.00
            }
            axios.put(`${API_URL}/api/players/updateGold/${player_id}`, bodyData)
                .then((result) => {
                    console.log(result);
                    getGold.style.display = 'block'
                    getGold.innerHTML = `lucky ! $5.00<span style="display:block">for you !</span>`
                    setTimeout(() => {
                        getGold.style.display = 'none';
                    }, 1000)
                    noMore = true;
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            getGold.style.display = 'block';
            getGold.innerHTML = `unlucky !<span style="display:block">try again !</span>`
            setTimeout(() => {
                getGold.style.display = 'none';
            }, 1000)
        }
    }
    else {
        getGold.style.display = 'block';
        getGold.innerHTML = `no more <span style="display:block">for now</span>`
        setTimeout(() => {
            getGold.style.display = 'none';
        }, 1000)
    }
}

