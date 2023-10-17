
//const bodyParser = require("body-parser");

const listForClans = document.getElementById("listOfClans");
const submitButtonForClan = document.getElementById("chooseClan");
const textAndDRopdown = document.getElementById("textandDropdown");
const textBox = document.getElementById("container");

const player_id = localStorage.getItem("player_id");

const body = {
  player_id: player_id,
};

axios
  .get(`${API_URL}/api/clanDetails/listOfClans/${player_id}`)
  .then((response) => {
    //console.log(response.data);
    // let data = response.data;
    if(response.data.length == 0){
      textAndDRopdown.style.display='none';
      let textTojoinClan =``;
      textTojoinClan+=`
      <div style="margin-top:10%">
        <div id="texts">You don't have any clan.Please join clan first.</div>
        <button id='joinClan'>Join Clan</button>
      </div>
      `
      textBox.innerHTML=textTojoinClan;
      const buttonToJoinClan = document.getElementById("joinClan");
      buttonToJoinClan.onclick=gotoJoinClanPage;
      function gotoJoinClanPage(){
        window.location.assign(API_URL + "/clanRequest.html");
      }

    }
    DisplayResponse(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function DisplayResponse(clanData) {
  console.log(clanData);
  let eachClanName = ` `;
  for (let i = 0; i < clanData.length; i++) {
    eachClanName += ` 
  <option value="${clanData[i].clanID}">${clanData[i].clan_name}</option>
        `;
  }

  listForClans.innerHTML = eachClanName;
}

//button 'Next' function
submitButtonForClan.onclick = goToGamePage;

function goToGamePage() {
  let selectedClan = document.getElementById("listOfClans").value;
  console.log(selectedClan);
  localStorage.setItem("clanIDForClanPage", selectedClan);
  window.location.assign(API_URL + "/clanPointsPage.html");
}
