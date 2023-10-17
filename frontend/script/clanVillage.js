
const API_URL = 'https://monster-cat-world.onrender.com'

const player_id = localStorage.getItem('player_id');
var ClanID;
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
document.addEventListener("DOMContentLoaded", function (event) {
    if (player_id == null) {
        window.location.assign(`${API_URL}/Clan.html`)
    }
    axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
        .then((response) => {
            if (response.data.ClanID == null) {
                window.location.assign(`${API_URL}/Clan.html`);
            }
            ClanID = response.data.ClanID;
            console.log(response.data.ClanID);
            axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                .then((result) => {
                    console.log(result)
                    if (result.data.length == 0) {
                        window.location.assign(`${API_URL}/Clan.html`)
                    }
                    else {
                        removeFromHive();
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
    //for back button which is yes, character avatar
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
        .then((response) => {

            axios.get(`${API_URL}/api/players/getPlayerAvatar/${response.data.image_id}`)
                .then((result) => {
                    document.getElementById('showClans').src = result.data
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })


});


const rockPaperScissors = document.getElementById('RPS');
const discoCosmo = document.getElementById('DC');
const theHive = document.getElementById('TH');
const clanDashboard = document.getElementById('CD');

rockPaperScissors.onclick = goRPS;
discoCosmo.onclick = goDC;
theHive.onclick = gotheHive;
clanDashboard.onclick = goClanDashboard;

function goRPS() {
    let queryParams = new URLSearchParams(window.location.search);
    let clan_Name = queryParams.get('Clan_Name');
    window.location.assign(`${API_URL}/RockPaperScissors.html?Clan_Name=${clan_Name}`)
}

function goDC() {
    let queryParams = new URLSearchParams(window.location.search);
    let clan_Name = queryParams.get('Clan_Name');
    window.location.assign(`${API_URL}/DiscoCosmo.html?Clan_Name=${clan_Name}`);
}

function gotheHive() {
    let queryParams = new URLSearchParams(window.location.search);
    let clan_Name = queryParams.get('Clan_Name');
    window.location.assign(`${API_URL}/TheHive.html?Clan_Name=${clan_Name}`);
}

function goClanDashboard() {
    let queryParams = new URLSearchParams(window.location.search);
    let clan_Name = queryParams.get('Clan_Name');
    window.location.assign(`${API_URL}/clanDashboard.html?Clan_Name=${clan_Name}`);
}

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


function removeFromHive() {
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





