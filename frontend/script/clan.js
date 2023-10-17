//necessities

const player_id = localStorage.getItem('player_id');
const clan = document.getElementById("clans");
var player_username;
//when page loads
document.addEventListener("DOMContentLoaded", function (event) {
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
    .then((result)=>{
    //save player username
    player_username=result.data.player_username
    //rename url 
    const redirectUrl = `${API_URL}/clan.html?${result.data.player_username}`
    window.history.pushState("", "new page with player_id", redirectUrl);
    //getAllClans()
    getAllClans();
    })
    .catch((error) => {
        console.log(error)
    })
});


//getAllClans player_id is in
function getAllClans() {
    console.log(player_id)
    axios.post(`${API_URL}/api/clanDetails/getAllClans/${player_id}`)
        .then((response) => {
            const clan = document.getElementById("clans")
            // for each clans that player_id is in append 
            response.data.forEach((clanData) => clan.innerHTML += createClanInfo(clanData))
            if (response.data.length < 4) {
                for (let x = (4 - response.data.length); x > 0; x--) {
                    //if player hasn't join 4 clans, encourage them to join by putting a plus button
                    //and linking them to the join clan page
                    clan.innerHTML += `
                    <div class="clanDiv">
                    <i class="fa fa-plus" onClick="goClanRequest()"></i>
                    <p id="joinAClan" onClick="goClanRequest()">Join a Clan</p>
                    </div>`
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })

}

//append info
function createClanInfo(clanData) {
    //different functions for different things
    //if clan is created by player_id, they can delete the clan
    if (clanData.CreatedBy == player_id) {
        return `    <div class="clanDiv" id="clanDiv${clanData.ClanID}">
        <div class="clanInfo">
            <div class="clanDetails">
                <p class="clanName">Clan Name: <span>${clanData.ClanName}</span></p>
                <p class="clanType">Clan Type: <span>${clanData.ClanType}</span></p>
                <p class="clanPoints">Clan Points: <span>${clanData.clan_point}</span></p>
                <p>Clan Role: <span> ${clanData.PlayerRole}</span></p>
            </div>
            <button class="members" onClick="deleteClan('${clanData.ClanName}',${clanData.ClanID})">Delete Clan</button>
            <button class="goClan" onClick="goToClan('${clanData.ClanName}')">Go to Clan</button>
        </div>
    </div>
    `
    }
    //if it is not created by player_id then players can unjoin them
    else {

        return `
    <div class="clanDiv" id="clanDiv${clanData.ClanID}">
    <div class="clanInfo">
        <div class="clanDetails">
            <p class="clanName">Clan Name: <span>${clanData.ClanName}</span></p>
            <p class="clanType">Clan Type: <span>${clanData.ClanType}</span></p>
            <p class="clanPoints">Clan Points: <span>${clanData.clan_point}</span></p>
            <p>Clan Role: <span> ${clanData.PlayerRole}</span></p>
        </div>
        <button class="members" onClick="unjoinClan('${clanData.ClanName}',${clanData.ClanID})">unjoin Clan</button>
        <button class="goClan" onClick="goToClan('${clanData.ClanName}')">Go to Clan</button>
    </div>
</div>

`
    }

}

//unjoining of clans for members
function unjoinClan(ClanName,ClanID){
    //ask if they really want to unjoin
 document.getElementById('alert').innerHTML=`
 <div id="alert-unjoin">
 <p>
     Are you sure you want to unjoin '${ClanName}' ?
 </p>
 <button id="yesUnjoin" class="unjoin" onClick="yesUnjoin('${ClanID}')">yes</button>
 <button  id="noUnjoin" class="unjoin" onClick="noUnjoin()">no</button>
</div>
`
}

//deleting of clans by clan creator
function deleteClan(ClanName,ClanID){
    //prompt if they really want to delete
    document.getElementById('alert').innerHTML=`
    <div id="alert-unjoin">
    <p>
        Are you sure you want to delete '${ClanName}' ?
    </p>
    <button id="yesUnjoin" class="unjoin" onClick="yesDelete('${ClanID}')">yes</button>
    <button  id="noUnjoin" class="unjoin" onClick="noDelete()">no</button>
   </div>
   `
   }
   

// confirm unjoin
function yesUnjoin(ClanID){
    console.log('ClanID'+ClanID);
    // delete player_id
    axios.delete(`${API_URL}/api/clanDetails/unjoinClan/${ClanID}/${player_id}`)
    .then((result)=>{
        console.log(result);
        //remove clanDiv
        document.getElementById(`clanDiv${ClanID}`).remove();
        //add join a clan to encourage players to join a clan
        document.getElementById('alert-unjoin').remove();
        //add new clanDiv to ask players if they want to join clan
        clan.innerHTML += `<div class="clanDiv">
        <i class="fa fa-plus" onClick="goClanRequest()"></i>
        <p id="joinAClan" onClick="goClanRequest()">Join a Clan</p>
        </div>`
        return;
    })
    .catch((error)=>{
        console.log(error)
        return;
    })
}


function noUnjoin(){
    //remove alert since say no
    document.getElementById('alert-unjoin').remove();
    return;
}

//delete clan created
function yesDelete(ClanID){
    console.log('ClanID'+ClanID);
    //delete clan
    axios.delete(`${API_URL}/api/clanDetails/deleteClan/${ClanID}`)
    .then((result)=>{
        console.log(result);
        //remove the div
        document.getElementById(`clanDiv${ClanID}`).remove();
        //remove alert
        document.getElementById('alert-unjoin').remove();
        //add new clanDiv that asks if players wants to create a clan
        clan.innerHTML += `<div class="clanDiv">
        <i class="fa fa-plus" onClick="goClanRequest()"></i>
        <p id="joinAClan" onClick="goClanRequest()">Create a Clan</p>
        </div>`
        return;
    })
    .catch((error)=>{
        console.log(error)
        return;
    })
}

//remove alert if they decide to not join clan
function noDelete(){
    document.getElementById('alert-unjoin').remove();
    return;
}

//just some location assign


function goToClan(clanName) {
    window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clanName}`);
}

function goClanRequest(){
    window.location.assign(`${API_URL}/clanRequest.html`);
}

