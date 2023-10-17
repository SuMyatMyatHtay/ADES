const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate()
const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemeber",
    "October",
    "November",
    "December"
]
const playerArr = []
var ClanID;
document.getElementById('exit').onclick = () => { window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clan_Name}`) }

//get all players in the hive when browser is loaded
document.addEventListener("DOMContentLoaded", function (event) {

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
                        showAllPlayers()
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


function showAllPlayers() {

    axios.get(`${API_URL}/api/clanDetails/getAllMembers/${clan_Name}`)
        .then((result) => {

            for (let x = 0; x < result.data.length; x++) {
                if (result.data[x] != null) {
                    let date = new Date(`${result.data[x].date_joined}`)
                    let day = date.getDate();
                    let month = monthArr[date.getMonth()]
                    let year = date.getFullYear();
                    let formattedDate = day + ' ' + month + ' ' + year
                    playerArr.push(result.data[x].player_id);
                    if (x >= 5) {
                        document.getElementById('players').innerHTML += `
                    <div id="player${x}" class="charDiv">
                    <img src="${result.data[x].image_path}" class="characters" id="character${x}"/>
                    <div class="details" id="details${x}">
                        <p>Name: <span class="charInfo"> ${result.data[x].player_username}</span></p>
                        <p>Clan Role: <span class="charInfo">${result.data[x].PlayerRole}</span></p>
                        <p>Date Joined: <span class="charInfo">${formattedDate}</span></p>
                        <p>No. of RPS plays today: <span class="charInfo" id="rps${x}"></span></p>
                    </div>
                </div> 
                    `
                    }
                    else {
                        document.getElementById('players2').innerHTML += `
            <div id="player${x}" class="charDiv">
            <img src="${result.data[x].image_path}" class="characters" id="character${x}"/>
            <div class="details" id="details${x}">
                <p>Name: <span class="charInfo"> ${result.data[x].player_username}</span></p>
                <p>Clan Role: <span class="charInfo">${result.data[x].PlayerRole}</span></p>
                <p>Date Joined: <span class="charInfo">${formattedDate}</span></p>
                <p>No. of RPS plays today: <span class="charInfo" id="rps${x}"></span></p>
            </div>
        </div>
            `
                    }
                }
            }

            playerArr.forEach((element,index) => {
                const bodyData2 = {
                    "ClanName": clan_Name,
                    "date": todayDate.toString().padStart(2, '0'),
                    "month": todayMonth.toString().padStart(2, '0'),
                    "year": todayYear
                }

                axios.post(`${API_URL}/api/rps/noOfPlaysToday/${element}`, bodyData2)
                    .then((response) => {
                        let no_of_plays = response.data[0].no_of_plays
                        document.getElementById(`rps${index}`).innerHTML = `${no_of_plays}`;
                        if(index==(playerArr.length-1)){
                            document.getElementById('loading').innerHTML = ''
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        return;
                    })
               
            })
            
        })
        .catch((error) => {
            console.log(error);
            return;
        })
    
}
