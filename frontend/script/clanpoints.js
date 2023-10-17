
const leadership = document.getElementById("leadership_board");
const card = document.getElementById("cards");
const firstClanRows = document.getElementById("firstClan");
const secondClanRows = document.getElementById("secondClan");
const thirdClanRows = document.getElementById("thirdClan");
const buttonFor_MiniGame = document.getElementById("ToGominiGamePage");

axios
  .get(API_URL + "/api/clanPoint/topClans")
  .then((response) => {
    console.log(response.data); //View in Browser's Developer Tools

    DisplayResponse(response.data);
  })
  .catch(function (error) {
    DisplayResponse(error);
  });

function DisplayResponse(Data) {
  firstClanRows.innerHTML = "";
  secondClanRows.innerHTML = "";
  thirdClanRows.innerHTML = "";
   
  //create rows for leaderboard table
  let rowForFirstClan = ` `;
  for (let i = 0; i < Data.firstClans.length; i++) {
    //for first clan(s)
    rowForFirstClan += ` 
        <tr>
            <td>First</td>
            <td>${Data.firstClans[i].clanName}</td>
            <td>${Data.firstClans[i].clanPoint}</td>
        </tr>
            `;
  }

  let rowForSecondClan = ` `;
  for (let i = 0; i < Data.secondClans.length; i++) {
    //for second clan(s)
    rowForSecondClan += ` 
         <tr>
             <td>Second</td>
             <td>${Data.secondClans[i].clanName}</td>
             <td>${Data.secondClans[i].clanPoint}</td>
         </tr>
             `;
  }

  let rowForThirdClan = ` `;
  for (let i = 0; i < Data.thirdClans.length; i++) {
    //for third clan(s)
    rowForThirdClan += ` 
          <tr>
              <td>Third</td>
              <td>${Data.thirdClans[i].clanName}</td>
              <td>${Data.thirdClans[i].clanPoint}</td>
          </tr>
              `;
  }

  firstClanRows.innerHTML = rowForFirstClan;
  secondClanRows.innerHTML = rowForSecondClan;
  thirdClanRows.innerHTML = rowForThirdClan;
}
