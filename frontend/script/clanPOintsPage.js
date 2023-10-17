const API_URL = 'https://monster-cat-world.onrender.com'
const textForClanName = document.getElementById("clanNameInPage");
const textForClanPOints = document.getElementById("clanPointsInPage");
const buttonToPlayGame = document.getElementById("togoMiniGamee");
const textForTopPlayer = document.getElementById("topPlayer");
const buttonToGoCardPage = document.getElementById("togoGiftCardpage");
const textToshowNumberOfCard = document.getElementById("noOfCArds");
const buttontoExit = document.getElementById('exit');
const tableBodyForClanMembers = document.getElementById('tableBodyForMembers');
const secMiniGameButton  =document.getElementById("togoSecMiniGamee");

//get clan the player chose from local storage
const clanID = localStorage.getItem("clanIDForClanPage");
const body = {
  clanID: clanID,
};
//if clanID is null, go back to the Clanlist page
if(clanID ==null){
  window.location.assign(API_URL + "/listOfClan.html");
}
else{
//get clan name and it point
axios
  .get(`${API_URL}/api/clanDetails/clanInformation/${clanID}`)
  .then((response) => {
    console.log(response.data);
    // let data = response.data;
    DisplayClanInformation(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
//display clan name and it point
function DisplayClanInformation(clanInformation) {
  console.log(clanInformation);
  textForClanName.innerHTML = "";
  textForClanPOints.innerHTML = "";
  textForClanName.append(clanInformation.clanName);
  console.log(clanInformation.clanName);
  textForClanPOints.append("Points:", clanInformation.clanPoint);
}

//get menbers and their role
axios
  .get(`${API_URL}/api/clanDetails/ClanMemberDetails/${clanID}`)
  .then((response) => {
    //console.log(response.data);
    // let data = response.data;
    DisplayClanMemberDetails(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
//display menbers and their role
function DisplayClanMemberDetails(clanData) {
  console.log(clanData);
  let eachMemberDetails = ` `;
  for (let i = 0; i < clanData.length; i++) {
    eachMemberDetails += ` 
    <tr>
    <td>${clanData[i].player_username}</td>
    <td>${clanData[i].Role}</td>
</tr>
        `;
  }

  tableBodyForClanMembers.innerHTML = eachMemberDetails;
}

//get top player from mini-game
axios
  .get(`${API_URL}/api/clanDetails/topPlayer/${clanID}`)
  .then((response) => {
    console.log(response);

    DisplayTopPlayer(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
//display top player from mini-game
function DisplayTopPlayer(clanData) {
    console.log(clanData);
    if (clanData.length != 0) {
      let eachClanName = `
      <div>Best Player from this mini game :${clanData[0].player_username}</div> `;
  
      textForTopPlayer.innerHTML = eachClanName;
    }
}

//get number of cards each clan got 
//*if they didn't have any card, set zero
axios
  .get(`${API_URL}/api/freeGiftCard/numberOfCards/${clanID}`)
  .then((response) => {
    let data = response.data;
    DisplayNumberOfCards(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

  function DisplayNumberOfCards(cardInformation) {
    console.log(cardInformation);
    if (cardInformation.length == 0) {
      let text = ``;
      text += `<div>First Prize :0 </div><div>Second Prize:0 </div><div>Third Prize  :0 </div>`;
      textToshowNumberOfCard.innerHTML = text;
    } else {
      let createLineForPrize = ` `;
      for (let i = 0; i < cardInformation.length; i++) {
        createLineForPrize += ` 
    <div>
    ${cardInformation[i].freeCard_Name} : ${cardInformation[i].no_of_cards}
    </div>
          `;
      }
  
      textToshowNumberOfCard.innerHTML = createLineForPrize;
    }
  }

//to go back to previous page(clan page)
buttonToPlayGame.onclick = switchToGamePage;

function switchToGamePage() {
  window.location.assign(API_URL + "/miniGame.html");
}

secMiniGameButton.onclick= switchtosecMiniGame;

function switchtosecMiniGame(){
  window.location.assign(API_URL + "/secMiniGame.html");
}

//to go to prize page
buttonToGoCardPage.onclick = switchToFreeCardPage;

function switchToFreeCardPage() {
  window.location.assign(API_URL + "/freeGiftCard.html");
}

//get number of matches of members and draw bar chart
axios
  .get(`${API_URL}/api/clanDetails/playersAndtheirMatches/${clanID}`)
  .then((response) => {
    const data = response.data;
    const usernames = [];
    const points = [];

    data.forEach((item) => {
      usernames.push(item.player_username);
      points.push(item.points);
    });

    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: usernames,
        datasets: [
          {
            label: "Number of Matches(current year)",
            data: points,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  })
  .catch(function (error) {
    console.log(error);
  });

  buttontoExit.onclick = ExitFromclanpage;

  function ExitFromclanpage(){
    window.location.assign(API_URL + "/listOfClan.html");
    localStorage.removeItem("clanIDForClanPage");
  }

}
