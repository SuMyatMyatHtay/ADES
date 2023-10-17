
const API_URL = 'https://monster-cat-world.onrender.com'
const buttonToexit = document.getElementById('goToClanPage');
const cardElement = document.getElementById("cardForPrize");
const sorryMsg =document.getElementById('sorryMsg');
const expireDate=document.getElementById("expireDate");
sorryMsg.style.display='none';
expireDate.style.display='none';

const clanID = localStorage.getItem("clanIDForClanPage");
if(clanID ==null){
  window.location.assign(API_URL + "/listOfClan.html");
}
//get cards' information
axios
  .get(API_URL + "/api/freeGiftCard/urlForFreeCard")
  .then((response) => {
    console.log(response.data); //View in Browser's Developer Tools

    DisplayResponse(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

  //display cards' information
function DisplayResponse(Data) {
  console.log(Data);
  let cardForprize = ` `;
  for (let i = 0; i < Data.length; i++) {
    console.log(Data[i].cardPhotoUrl);
    cardForprize += ` 
        <div class="column">
          <div class="card">
              <img id="${Data[i].freeCard_Name}" src=${Data[i].cardPhotoUrl} alt=""${Data[i].freeCard_Name}" style="width:100%">    
              <button class="buttonToClaim" onclick="updateHistoryOfGiftCard('${Data[i].freeCard_ID}')" style="background-color: grey;" id="${Data[i].freeCard_ID}" disabled >Claim</button>           
          </div>
        </div>
        `;
  }

  cardElement.innerHTML = cardForprize;
}

axios
  .get(API_URL + "/api/freeGiftCard/getAllDataFromCurrentMonthRank")
  .then((response) => {
   // console.log(response.data);
    if (response.data.length != 0) {  
      
      const parse_clanID = parseInt(clanID);

      const data = response.data;
      let clanRank = null;

      for (const item of data) {
        if (item.clan_ID === parse_clanID) {
          clanRank = item.clan_rank;
          expireDate.style.display='block';
          break;
        }
      }
      //if the clan got prize, the button background color would be #B84433 and can be clickable
      if (clanRank !== null) {
        console.log(`clan is ${parse_clanID} and rank is ${clanRank}`);
        if (clanRank == 1) {
          const buttonForFirst = document.getElementById("1");
          buttonForFirst.disabled = false;
          buttonForFirst.style.backgroundColor = "#B84433";

        } else if (clanRank == 2) {
          const buttonForSecond = document.getElementById("2");
          buttonForSecond.disabled = false;
          buttonForSecond.style.backgroundColor = "#B84433";
        } else {
          const buttonForThird = document.getElementById("3");
          buttonForThird.disabled = false;
          buttonForThird.style.backgroundColor = "#B84433";
        }
      } else {
        sorryMsg.style.display='block'
        console.log(`not found in the array.`);
      }
    }
  })
  .catch(function (error) {
    console.log(error);
  });


//function to update about the new prize clan got in history
function updateHistoryOfGiftCard(x) {
  const freeCard_ID = parseInt(x);
  const clanID = localStorage.getItem("clanIDForClanPage");
  const buttonToclaim = document.getElementById(x);
  buttonToclaim.disabled = true;
  buttonToclaim.style.backgroundColor = "grey";
  const body = {
    clanID: clanID,
    freeCard_ID: freeCard_ID,
  };
  console.log(body);
  axios
    .post(API_URL + "/api/freeGiftCard/updatePrizesHistory", body)
    .then((response) => {
      console.log(body);
      console.log("successful");
      
      axios
        .delete(`${API_URL}/api/freeGiftCard/setUpClanPointsZero/${clanID}`)
        .then((response) => {
          console.log("successful");
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}


//to go back to clan page
buttonToexit.onclick=gotoClanPage;


function gotoClanPage(){
  window.location.assign(API_URL +"/clanPointsPage.html");
}
