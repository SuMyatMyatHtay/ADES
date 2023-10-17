//some necessities
const API_URL = 'https://monster-cat-world.onrender.com'
const queryParams = new URLSearchParams(window.location.search);
const clan_Name = queryParams.get('Clan_Name');
const player_id = localStorage.getItem('player_id');
let isRunning = false;
var count = 0
//get today date
const todayDate = new Date();
const month = todayDate.getMonth() + 1;
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
const year = todayDate.getFullYear();
//some document.getElementById
const characterNames = document.getElementsByClassName("characterName");
const data = document.getElementById('data');
const back = document.getElementById('back');
const loadingDiv = document.getElementById('loadingDiv')
const personal_stats = document.getElementById('personal_stats');
const clan_stats = document.getElementById("clan_stats");
const public_clan_stats = document.getElementById("public_clan_stats");
//onclick event
personal_stats.onclick = showPersonalStats;
clan_stats.onclick = clan_statsClick;
public_clan_stats.onclick = showPublicStats;
back.onclick = () => { window.location.assign(`${API_URL}/RockPaperScissors.html?Clan_Name=${clan_Name}`) }

//validation/verification
document.addEventListener("DOMContentLoaded", function (event) {
    if (player_id == null) {
        window.location.assign(`${API_URL}/Clan.html`)
    }
    //get ClanID from url clan_Name
    axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
        .then((response) => {
            if (response.data.ClanID == null) {
                //if clan_Name not found --> invalid entry 
                window.location.assign(`${API_URL}/Clan.html?${player_id}`);
            }
            var ClanID = response.data.ClanID
            //check if player is in clan name in url
            axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                .then((result) => {
                    //if not, no entry allowed
                    if (result.data.length == 0) {
                        window.location.assign(`${API_URL}/Clan.html`)
                    }
                    showPersonalStats()
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })

    //just some styling adjustment
    public_clan_stats.addEventListener('mouseover', () => {
        public_clan_stats.style.color = 'rgb(212, 65, 65)';
        public_clan_stats.style.backgroundColor = 'rgb(255,255,255)';
    });
    clan_stats.addEventListener('mouseover', () => {
        clan_stats.style.color = 'rgb(65, 126, 212)';
        clan_stats.style.backgroundColor = 'rgb(255, 255, 255)';
    });

    public_clan_stats.addEventListener('mouseleave', () => {
        public_clan_stats.style.backgroundColor = 'rgb(212, 65, 65)';
        public_clan_stats.style.color = 'rgb(255,255,255)';
    });
    clan_stats.addEventListener('mouseleave', () => {
        clan_stats.style.backgroundColor = 'rgb(65, 126, 212)';
        clan_stats.style.color = 'rgb(255, 255, 255)';
    });
    personal_stats.addEventListener('mouseover', () => {
        personal_stats.style.backgroundColor = 'rgb(255, 255, 255)';
        personal_stats.style.color = 'rgb(0, 0, 0)';
    });

    personal_stats.addEventListener('mouseleave', () => {
        personal_stats.style.backgroundColor = 'rgb(158, 158, 158)';
        personal_stats.style.color = 'rgb(255, 255, 255)';
    });





});



function showPersonalStats() {

    //just some style coding
    personal_stats.style.backgroundColor = 'rgb(255, 255, 255)';
    personal_stats.style.color = 'rgb(0, 0, 0)';

    clan_stats.style.backgroundColor = 'rgb(65, 126, 212)';
    clan_stats.style.color = 'rgb(255, 255, 255)';

    public_clan_stats.style.backgroundColor = 'rgb(212, 65, 65)';
    public_clan_stats.style.color = 'rgb(255,255,255)';

    loadingDiv.style.display = "block"




    //make sure player doesn't spam the button and activate the button multiple times
    console.log("running")
    if (isRunning) {
        return;
    }

    isRunning = true;
    //get player's average clan_point earned and average_gold_earned
    axios.get(`${API_URL}/api/rps/getAllSumAvg/${player_id}`)
        .then((result) => {
            var avg_clan_point = Math.round(result.data[0].avg_clan_point) + 'pts'
            var avg_gold_earned = '$' + parseFloat(result.data[0].avg_gold_earned).toFixed(2)
            if (result.data[0].avg_clan_point == null) {
                avg_clan_point = '0pt';
                avg_gold_earned = '$0.00'
            }


            //base html for personal statistic
            data.innerHTML = `
    <h1 style="margin-left: 7%;color:rgb(110, 110, 110)">Personal Statistic</h1>        
    <p class="Average">All time avg points earned: <span class="rankNumber">${avg_clan_point}</span>
    </p>
    <p class="Average">All time avg gold earned: <span class="rankNumber">${avg_gold_earned}</span> </p>
    <div id="player_row">
        <div class="personal_stats" id="pastGameData">
            <p class="tableNamePersonal">Statistics of past 5 plays by date</p>
            <div class="clanTable">
                <div class="leaderboard" id="personalDataBoard">
                <div class="selfDataDiv" id="tableLabel">
                <p class="allDate" id="dateLabel">Date</p>
                <p class="allPoints" id="pointsLabel">Points earned</p>
                <p class="allGold" id="goldLabel">Gold earned</p>
                <p class="allTimes" id="timeLabel">No. of Times played</p>
            </div>
                </div>
            </div>
        </div>
        <div class="personal_stats" id="pastMonthData">
            <p class="tableNamePersonal">Statistics of past 5 months</p>
            <div class="clanTable">
                <div class="leaderboard" id="personalMonthDataBoard">
                <div class="selfDataDiv" id="tableLabel">
                <p class="allDate" id="dateLabel">Month</p>
                <p class="allPoints" id="pointsLabel">Points earned</p>
                <p class="allGold"  id="goldLabel">Gold earned</p>
                <p class="allTimes" id="timeLabel">No. of Times played</p>
            </div>
                </div>
            </div>
        </div>
    </div>
    <div id="personal_row">
        <div class=" public_rank" id="winningCombi">
            <p class="tableNamePersonal">Combinations with most wins</p>
            <p class="notes">Player Move + Non-Player Move</p>
            <div class="clanTable">
                <div class="leaderboard" id="winningCombiLeaderboard">
                </div>
            </div>
        </div>
    
        <div class="public_rank" id="movesRank">
            <p class="tableNamePersonal">Winning statistic</p>
            <div id="pieChart">
            </div>
            <div class="clanTable">
                <div class="leaderboard" id="mostUsedMoves">
                </div>
            </div>
        </div>
    
    </div>
    
    `;
            //load the separate info

            //load info
            appendLast5Plays();
            appendLast5Months();
            appendPlayerCombi()
            appendPlayerWins()
            //all functions should be done after 2s
            setTimeout(() => {
                loadingDiv.style.display = "none"
                isRunning = false;
            }, 2000)
        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//show stats for last 5 plays group by dates
function appendLast5Plays() {
    axios.get(`${API_URL}/api/rps/getPlayerPrevGameData/${player_id}`)
        .then((result) => {
            for (let x = 0; x < 5; x++) {
                //if player hasn't played for 5 days
                if (result.data[x] == null) {
                    document.getElementById('personalDataBoard').innerHTML += `
                    <div id="dateDiv" class="selfDataDiv" style="border-top:none;padding-top:29px;padding-bottom:29px">
                    <p class="earned" style="color:rgb(237, 31, 31);font-weight:bold">Play more to get better data</p>
                </div>`
                }
                else {
                    var dataDate = result.data[x].datestamp;
                    dataDate = new Date(dataDate);
                    var dayOfToday = todayDate.getDate();
                    var dayOfDate = dataDate.getDate();
                    var monthOfDate = monthArr[dataDate.getMonth()];
                    var yearOfDate = dataDate.getFullYear()
                    dataDate = dayOfDate + ' ' + monthOfDate + ' ' + yearOfDate
                    todayFormattedDate = dayOfToday + ' ' + monthArr[month - 1] + ' ' + year
                    //append data  
                    document.getElementById('personalDataBoard').innerHTML += `
            <div id="dateDiv${x}" class="selfDataDiv" style="border-top:none">
            <p class="allDate">${dataDate}</p>
            <p class="allPoints">${result.data[x].total_points_earned} pts</p>
            <p class="allGold">$${result.data[x].total_gold_earned}</p>
            <p class="allTimes">${result.data[x].no_of_times_played} times</p>
        </div>
            
            `
                    //if the data date is the current date, it will be of a different background color
                    if (dataDate == todayFormattedDate) {
                        document.getElementById(`dateDiv${x}`).style.backgroundColor = '#ddccff'
                    }

                }
            }

        })
        .catch((error) => {
            console.log(error);
            return;
        })

}

//data for last 5 months
function appendLast5Months() {
    axios.get(`${API_URL}/api/rps/getMonthPlayerData/${player_id}`)
        .then((result) => {
            let monthsNeeded = [];
            // e.g if the current month is jan,
            //the past 5 months will be dec,nov
            //so need this array for the index of those months
            let last4Months = [12, 11, 10, 9];
            for (let y = month - 4; y < month + 1; y++) {
                if (y <= 0) {
                    monthsNeeded.push(last4Months[-y]);
                } else {
                    monthsNeeded.push(y);
                }
            }

            var count = 0;
            monthsNeeded.forEach((obj) => {
                var index = result.data.findIndex(item => item.month === obj);
                //if there isn't data for that month 
                if (index == -1) {
                    document.getElementById('personalMonthDataBoard').innerHTML += `
                    <div id="monthDiv${count}" class="selfDataDiv" style="border-top:none;">
                    <p class="allDate">${monthArr[obj - 1]}</p>
                    <p class="allPoints">0 pts</p>
                    <p class="allGold">$0</p>
                    <p class="allTimes">0 times</p>
                    </div>`;
                }
                //if there is data for that month
                else {
                    document.getElementById('personalMonthDataBoard').innerHTML += `
                    <div id="monthDiv${count}" class="selfDataDiv" style="border-top:none">
                        <p class="allDate">${monthArr[result.data[index].month - 1]}</p>
                        <p class="allPoints">${result.data[index].clan_point_earned} pts</p>
                        <p class="allGold">$${result.data[index].gold_earned}</p>
                        <p class="allTimes">${result.data[index].no_of_times} times</p>
                    </div>`;
                }
                //highlight div if it is for current month
                if (obj == month) {
                    document.getElementById(`monthDiv${count}`).style.backgroundColor = '#ddccff'
                }
                count += 1;
            });
        })
        .catch((error) => {
            console.log(error);
            return;
        });


}

//show players which combo with com they get the most points and gold from
function appendPlayerCombi() {
    axios.get(`${API_URL}/api/rps/getCombinationWithMostWins/${player_id}`)
        .then((result) => {
            for (let x = 0; x < 5; x++) {
                //if not enough data , ask player to play more
                if (result.data[x] == null) {
                    document.getElementById('winningCombiLeaderboard').innerHTML += `
                    <div id="personalWCombiDiv${x}" class="personalWCombiDiv"  style="border-top: none; padding-top: 5%;padding-bottom: 5%; ">
                    <p class="earned" style="color:rgb(237, 31, 31);font-weight:bold">Play more to get better data</p>
                </div>`
                }

                else {
                    //first div has top border
                    if (x == 0) {
                        document.getElementById('winningCombiLeaderboard').innerHTML += `
        <div id="personalWCombiDiv" class="personalWCombiDiv">
                            <p class="rankNo">${x + 1}.</p>
                            <div class="nameCrown2" style="margin-left: 10%;">
                                <img src="./images/gif/crown.gif" class="crown" />
                                <p class="characterName1">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                            </div>
                            <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
                            <p id="goldEarned" class="earned">$ ${result.data[x].total_gold_earned}</p>
    </div>  
        `
                    }
                    //rest no top border
                    //i know there's an easier way to do this...
                    else {
                        document.getElementById('winningCombiLeaderboard').innerHTML += `
            <div id="personalWCombiDiv" class="personalWCombiDiv" style="border-top: none;">
                            <p class="rankNo">${x + 1}.</p>
                            <p class="characterName${x + 1}" id="rankName${x}">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                            <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
                            <p id="goldEarned" class="earned">$ ${result.data[x].total_gold_earned}</p>
                        </div>
        `
                    }
                    //change font color if they are not top 3
                    if (x > 2) {
                        document.getElementById(`rankName${x}`).className = "honourary"
                    }
                }

            }

            document.getElementById('personalWCombiDiv0').style.borderTop = '2px solid black'
        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//stats for tie, win,lose
function appendPlayerWins() {
    axios.get(`${API_URL}/api/rps/countWins/${player_id}`)
        .then((result) => {
            console.log(result.data)
            //if no data at all remove piechart...
            if (result.data.length == 0) {
                document.getElementById("pieChart").remove();
            }
            else {
                var percentageArr = [];
                let prevPercentage = parseFloat(result.data[0].percentage).toFixed(1);
                percentageArr.push(prevPercentage + '%');

                for (let x = 1; x < result.data.length; x++) {
                    //this is because in the pie chart later, the second and last data will start from prev percentage
                    prevPercentage = (parseFloat(prevPercentage) + parseFloat(result.data[x].percentage)).toFixed(1);
                    percentageArr.push(prevPercentage + '%');
                }

                //make the graph
                document.getElementById("pieChart").style.background = `conic-gradient(#ffe6ff 0% ${percentageArr[0]},  #ffccff ${percentageArr[0]} ${percentageArr[1]},  #ffb3ff ${percentageArr[1]} ${percentageArr[2]})`;
            }

            for (let x = 0; x < 3; x++) {
                //if there is not enough data 
                if (result.data[x] == null) {
                    document.getElementById('mostUsedMoves').innerHTML += `
                        <div class="combiLeaderboardDiv" id="movesRank${x}" style="border-top:none;padding-top:29px;padding-bottom:29px">
                        <p class="earned" style="color:rgb(237, 31, 31);font-weight:bold">Play more to get better data</p>
                    </div>`
                }
                //append data
                else {
                    document.getElementById('mostUsedMoves').innerHTML += `
            <div class="combiLeaderboardDiv" id="movesRank${x}" style="border-top: none">
            <p class="rankNo">${x + 1}.</p>
                <p class="characterName${x + 1}">${result.data[x].result}</p>
            <p class="earned">${parseFloat(result.data[x].percentage).toFixed(1)}%</p>
        </div>`
                }
            }
            //just some styling changes
            document.getElementById(`movesRank0`).style.borderTop = `2px solid black`
            //to uniquely identtify each part of pie chart
            document.getElementById(`movesRank0`).style.backgroundColor = ' #ffe6ff';
            document.getElementById(`movesRank1`).style.backgroundColor = ' #ffccff';
            document.getElementById(`movesRank2`).style.backgroundColor = ' #ffb3ff';
            document.getElementById(`mostUsedMoves`).style.marginTop = '20%';

        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//clan statistic
function clan_statsClick() {
    loadingDiv.style.display = "block";
    console.log("running")
    //prevetn spamming of buttons
    if (isRunning) {
        return;
    }

    isRunning = true;
    //some styling
    personal_stats.style.backgroundColor = 'rgb(158, 158, 158)';
    personal_stats.style.color = 'rgb(255, 255, 255)';

    clan_stats.style.backgroundColor = 'rgb(255, 255, 255)';
    clan_stats.style.color = ' rgb(65, 126, 212)';

    public_clan_stats.style.backgroundColor = 'rgb(212, 65, 65)';
    public_clan_stats.style.color = 'rgb(255,255,255)';

    //base html
    data.innerHTML = ` 
    <h1 style="margin-left: 1%;  color:rgb(46, 81, 236)">Clan Statistic</h1>        
    <div id="clan_point_rank">
    </div>
    <div id="clan_gold_rank">
    </div>
   
    <div id="clanWinningCombi">
    </div>
    
    `;

    //get all clans jpined by player_id
    axios.post(`${API_URL}/api/ClanDetails/getAllClans/${player_id}`)
        .then((result) => {

            document.getElementById("clan_gold_rank").innerHTML += `        
               
                <p class="tableNameClan"><span class="monthNamesClan">${monthArr[month - 1]} </span> gold earned leaderboard among clanmates</p>
                <div class="clanTable" id="clanTable">
                
                </div>
                 `
            document.getElementById("clan_point_rank").innerHTML += `        
               
                 <p class="tableNameClan"><span class="monthNamesClan">${monthArr[month - 1]} </span> point earned leaderboard among clanmates</p>
                 <div class="clanTable" id="pointTable">
                 
                 </div>
                  `
            document.getElementById("clanWinningCombi").innerHTML += `        
               
                  <p class="tableNameClan"><span class="monthNamesClan">${monthArr[month - 1]} </span> winning combination leaderboard</p>
                  <div class="clanTable" id="combiTable">
                  
                  </div>
                   `

            result.data.forEach(obj => {
                showClanGoldStats(obj);
                showClanPointsStats(obj);
                showClanCombiStats(obj)
            });
            setTimeout(() => {
                loadingDiv.style.display = "none"
                isRunning = false;
            }, 2000)


        })
        .catch((error) => {
            console.log(error);
            return;
        })


}

//get the montly gold earned from each clan and show top players
function showClanGoldStats(result) {
    var ClanID = result.ClanID
    var ClanName = result.ClanName;
    console.log(result.ClanName);
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/getHighestGoldEarned/${ClanID}`, bodyData)
        .then((response) => {
            console.log(response);
            //find index of where player_id is at based on rank
            var index = response.data.findIndex(obj => obj.player_id == player_id);
            document.getElementById('clanTable').innerHTML += `
            <div class="leaderboard" id="Clan${ClanID}GoldStats">
            <p class="clanName">${ClanName}</p>
          
            </div>`
            //show rank number of player_id
            if (index != -1) {
                document.getElementById(`Clan${ClanID}GoldStats`).innerHTML += `
            <p class="playerGoldClan">Your Rank:<span class="rankNumber"> ${index + 1} </span></p>
            <p class="notes">Your gold earned:<span class="rankNumber"> $${response.data[index].total_gold_earned}</span></p>
            `
            }
            else {
                document.getElementById(`Clan${ClanID}GoldStats`).innerHTML += `
            <p class="playerGoldClan">Your Rank:<span style="font-size:15px"> Please play to get rank</span> </p>
            <p class="notes">Your gold earned:<span class="rankNumber">  $0.00 </span></p>
            `
            }

            appendToGoldLeaderBoard(ClanID, response.data)


        })
        .catch((error) => {
            console.log(error);
            return;
        })

}

//get the montly points earned from each clan and show top players
function showClanPointsStats(result) {
    var ClanID = result.ClanID
    var ClanName = result.ClanName;
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/getHighestPointsEarned/${ClanID}`, bodyData)
        .then((response) => {
            console.log(response);
            //find player_id in the data
            var index = response.data.findIndex(obj => obj.player_id == player_id);
            document.getElementById('pointTable').innerHTML += `
            <div class="leaderboard" id="Clan${ClanID}PointStats">
            <p class="clanName">${ClanName}</p>
            </div>`
            if (index != -1) {
                //get player_id rank
                document.getElementById(`Clan${ClanID}PointStats`).innerHTML += `
            <p class="playerGoldClan">Your Rank:<span class="rankNumber">  ${index + 1}</span></p>
            <p class="notes">Your points earned: <span class="rankNumber"> ${response.data[index].total_points_earned}pts</span></p>
            `
            }
            else {
                //or ask player to play mmore
                document.getElementById(`Clan${ClanID}PointStats`).innerHTML += `
            <p class="playerGoldClan">Your Rank:<span style="font-size:15px"> Please play to get rank</span> </p>
            <p class="notes">Your points earned: <span class="rankNumber"> 0</span></p>
            `
            }
            appendToPointLeaderBoard(ClanID, response.data)

        })
        .catch((error) => {
            console.log(error);
            return;
        })

}

//get the combination stats from each clan and show top combi
function showClanCombiStats(result) {
    var ClanID = result.ClanID
    var ClanName = result.ClanName;
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/getClanWinningCombiEarned/${ClanID}`, bodyData)
        .then((result) => {
            document.getElementById('combiTable').innerHTML += `
        <div class="leaderboard" id="Clan${ClanID}CombiStats">
        <p class="clanName">${ClanName}</p>
        <p class="notes">Player Move + Non-player Move</p>
        </div>`
            for (let x = 0; x < 3; x++) {
                if (result.data[x] == null) {
                    document.getElementById(`Clan${ClanID}CombiStats`).innerHTML += `
                <div class="leaderboardDiv" id="notEnoughCombi${x}${ClanID}" style="border:2px solid red;padding-top:6%; padding-bottom:6%">
                <p class="askClanMates">Ask your clanmates to play!</p>
            </div>
                `
                    if (x != 0) {
                        document.getElementById(`notEnoughCombi${x}${ClanID}`).style.borderTop = 'none'
                    }
                }
                else {
                    switch (x) {
                        //the difference is the styling
                        case 0: document.getElementById(`Clan${ClanID}CombiStats`).innerHTML +=
                            ` <div id="no1Combi" class="leaderboardDiv">
                        <p class="rankNo">${x + 1}.</p>
                        <div class="nameCrown2">
                            <img src="./images/gif/crown.gif" class="crown" />
                            <p class="characterName1">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                        </div>
                        <p  class="combiPoints">${result.data[x].total_points_earned}pts</p>
                        <p  class="combiGold">$${result.data[x].total_gold_earned}</p>
                    </div>`

                            break
                        case 1: document.getElementById(`Clan${ClanID}CombiStats`).innerHTML +=
                            ` <div id="no2Combi" class="midLeaderboardDiv">
                        <p class="rankNo">${x + 1}.</p>
                            <p class="characterName2">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                            <p  class="combiPoints">${result.data[x].total_points_earned}pts</p>
                            <p  class="combiGold">$${result.data[x].total_gold_earned}</p>
                    </div>`
                            break
                        case 2: document.getElementById(`Clan${ClanID}CombiStats`).innerHTML += `
                    <div id="no3" class="leaderboardDiv">
                    <p class="rankNo">${x + 1}.</p>
                        <p class="characterName3">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                    
                    <p id="combiPoints" class="combiPoints">${result.data[x].total_points_earned}pts</p>
                    <p id="combiGold" class="combiGold">${result.data[x].total_gold_earned}</p>
                </div>
            `


                    }
                }


            }


        })
        .catch((error) => {
            console.log(error);
            return
        })
}

//append gold earned by each clan player_id joined
function appendToGoldLeaderBoard(ClanID, data) {
    for (let x = 0; x < 3; x++) {
        if (data[x] == null) {
            document.getElementById(`Clan${ClanID}GoldStats`).innerHTML += `
            <div class="leaderboardDiv" id="notEnoughGold${x}${ClanID}" style="border:2px solid red;padding-top:6%; padding-bottom:6%">
            <p class="askClanMates">Ask your clanmates to play!</p>
        </div>
            `
            if (x != 0) {
                document.getElementById(`notEnoughGold${x}${ClanID}`).style.borderTop = 'none'
            }
        }
        else {
            switch (x) {

                //difference just in tsyling
                case 0: document.getElementById(`Clan${ClanID}GoldStats`).innerHTML +=
                    ` <div id="no${data[x].player_id}${ClanID}gold" class="leaderboardDiv">
    <p class="rankNo">${x + 1}.</p>
    <img src="${data[x].image_path}" class="playerImg" />
    <div class="nameCrown">
        <img src="./images/gif/crown.gif" class="crown" />
        <p class="characterName1">${data[x].player_username}</p>
    </div>
    <p id="goldEarned${data[x].player_id}" class="earned">$${data[x].total_gold_earned}</p>
</div>`

                    break
                case 1: document.getElementById(`Clan${ClanID}GoldStats`).innerHTML +=
                    `<div id="no${data[x].player_id}${ClanID}gold" class="midLeaderboardDiv">
            <p class="rankNo">${x + 1}.</p>
            <img src="${data[x].image_path}" class="playerImg" />
            <p class="characterName2">${data[x].player_username}</p>
            <p id="goldEarned${data[x].player_id}" class="earned">$${data[x].total_gold_earned}</p>
        </div>`
                    break
                case 2: document.getElementById(`Clan${ClanID}GoldStats`).innerHTML += `
        <div id="no${data[x].player_id}${ClanID}gold" class="leaderboardDiv">
        <p class="rankNo">${x + 1}</p>
        <img src="${data[x].image_path}" class="playerImg" />
        <p class="characterName3">${data[x].player_username}</p>
        <p id="goldEarned${data[x].player_id}" class="earned">$${data[x].total_gold_earned}</p>
    </div>
        `


            }

            //highlight player_id if player_id is the top earner
            if (data[x].player_id == player_id) {
                document.getElementById(`no${data[x].player_id}${ClanID}gold`).style.backgroundColor = '#ddccff'
            }
        }


    }

}

//append for point earned in each clan player_id join
function appendToPointLeaderBoard(ClanID, data) {

    for (let x = 0; x < 3; x++) {
        //if no data for that index
        if (data[x] == null) {
            document.getElementById(`Clan${ClanID}PointStats`).innerHTML += `
        <div class="leaderboardDiv" id="notEnoughPoint${x}${ClanID}" style="border:2px solid red;padding-top:6%; padding-bottom:6%">
        <p class="askClanMates">Ask your clanmates to play!</p>
    </div>
        `
        if (x != 0) {
            document.getElementById(`notEnoughPoint${x}${ClanID}`).style.borderTop = 'none'
        }
        }
        else {

            //difference in styling
            switch (x) {
                case 0: document.getElementById(`Clan${ClanID}PointStats`).innerHTML +=
                    ` <div id="no${data[x].player_id}${ClanID}point" class="leaderboardDiv">
    <p class="rankNo">${x + 1}.</p>
    <img src="${data[x].image_path}" class="playerImg" />
    <div class="nameCrown">
        <img src="./images/gif/crown.gif" class="crown" />
        <p class="characterName1">${data[x].player_username}</p>
    </div>
    <p id="pointEarned${data[x].player_id}" class="earned">${data[x].total_points_earned}pts</p>
</div>`

                    break
                case 1: document.getElementById(`Clan${ClanID}PointStats`).innerHTML +=
                    `<div id="no${data[x].player_id}${ClanID}point" class="midLeaderboardDiv">
            <p class="rankNo">${x + 1}.</p>
            <img src="${data[x].image_path}" class="playerImg" />
            <p class="characterName2">${data[x].player_username}</p>
            <p id="pointEarned${data[x].player_id}" class="earned">${data[x].total_points_earned}pts</p>
        </div>`
                    break
                case 2: document.getElementById(`Clan${ClanID}PointStats`).innerHTML += `
        <div id="no${data[x].player_id}${ClanID}point" class="leaderboardDiv">
        <p class="rankNo">${x + 1}</p>
        <img src="${data[x].image_path}" class="playerImg" />
        <p class="characterName3">${data[x].player_username}</p>
        <p id="pointEarned${data[x].player_id}" class="earned">${data[x].total_points_earned}pts</p>
    </div>
        `
                    break
            }

            //highlight player, if player is in a top 3
            if (data[x].player_id == player_id) {
                document.getElementById(`no${data[x].player_id}${ClanID}point`).style.backgroundColor = '#ddccff'
            }
        }
    }




}

//show public statistic 
function showPublicStats() {

    loadingDiv.style.display = "block"
    //prevent spamming of buttons
    console.log("running")
    if (isRunning) {
        return;
    }

    isRunning = true;
    //some styling
    personal_stats.style.backgroundColor = 'rgb(158, 158, 158)';
    personal_stats.style.color = 'rgb(255, 255, 255)';

    clan_stats.style.backgroundColor = 'rgb(65, 126, 212)';
    clan_stats.style.color = 'rgb(255, 255, 255)';

    public_clan_stats.style.backgroundColor = 'rgb(255, 255, 255)';
    public_clan_stats.style.color = 'rgb(212, 65, 65)';
    //basic html
    data.innerHTML = `
    <h1 style="margin-left: 2%;color:rgb(219, 0, 0)">Public Statistic</h1>    
    <div id="clan_row">
    <div class="public_rank" id="publicClanPoint">
    <p class="tableNamePublic"><span class="monthNames">${monthArr[month - 1]} </span> leaderboard for points earned by public clans</p>
    <div id="pointTable" class="clanTable">
        <div class="leaderboard" id="publicClanLeaderboard">
        <p class="notes">Public clans you joined:</p>
        </div>
    </div>    
    </div>
    <div class="public_rank" id="publicClanTime">
    <p class="tableNamePublic"><span class="monthNames">${monthArr[month - 1]} </span> leaderboard for number of times played by public clans</p>
    <div id="goldTable" class="clanTable">
        <div class="leaderboard" id="publicClanTimeLeaderboard">
        <p class="notes">Public clans you joined:</p>
        </div>
    </div>   
    </div>
    </div>
    <div id="player_row">
    <div class="public_rank" id="publicPersonalPointGold">
    <p class="tableNamePublic"><span class="monthNames">${monthArr[month - 1]} </span> leaderboard of all players</p>
      <div id="playerTable" class="clanTable">
        <div class="leaderboard" id="personalPointGold">
        </div>
      </div>
    </div>
    <div class="public_rank" id="publicCombi">
    <p class="tableNamePublic"><span class="monthNames">${monthArr[month - 1]} </span> leaderboard of winning combination</p>
    <p class="notes">Player Move + Non-Player Move</p>
    <div id="playerTable" class="clanTable">
        <div class="leaderboard" id="winningCombiLeaderboard">
        </div>
        </div>
    </div>
    <div class="public_rank" id="publicComOpt">
    <p class="tableNamePublic"><span class="monthNames">${monthArr[month - 1]} </span> leaderboard of combination chose by non-player</p>
    <div id="NPCTable" class="clanTable">
    <div class="leaderboard" id="nonPlayerCombiRank">
    </div>
    </div>
    </div>
    </div>
    `
    appendPublicClanPoints();
    appendPublicClanTime();
    appendPublicPlayer();
    appendWinningCombi();
    appendNonPlayerCombi();

    setTimeout(() => {
        loadingDiv.style.display = "none";
        isRunning = false;
    }, 2000)
}

//montly clan points earned by PUBLIC clans leaderboard
function appendPublicClanPoints() {
    var ClanIDArr = []
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/ClanDetails/getAllClans/${player_id}`)
        .then((response) => {
            response.data.forEach((obj) => {
                if (obj.ClanType == "public") {
                    ClanIDArr.push(obj.ClanID);
                    document.getElementById('publicClanLeaderboard').innerHTML += `
        <p class="playerPointsClan"><span class="ClanName">${obj.ClanName}'s</span> rank: <span id="rank${obj.ClanID}" class="rankNumber"></span> </p>
        `
                }
            })
            axios.post(`${API_URL}/api/rps/getHighestPointsByPublicClan`, bodyData)
                .then((result) => {
                    ClanIDArr.forEach((element) => {
                        //find clan joined by playr rank 
                        var index = result.data.findIndex(obj => obj.ClanID == element);
                        //find rank of clan,player joined
                        if (index == -1) {
                            document.getElementById(`rank${element}`).innerHTML = result.data.length + 1;
                        }
                        else {
                            document.getElementById(`rank${element}`).innerHTML = index + 1;
                        }
                    })
                    for (let x = 0; x < 5; x++) {
                        if (result.data[x] == null) {
                            document.getElementById('publicClanLeaderboard').innerHTML += `
                            <div id="noPointsData${x}" class="leaderboardDiv" style="padding-top:8%; padding-bottom:8%">
                            <p id="pointsEarned" class="earned" style="color:red">No Clan played yet</p>
                        </div>
                            `
                            if (x !== 0 && document.getElementById(`noPointsData${x}`) !== null) {
                                document.getElementById(`noPointsData${x}`).style.borderTop = 'none'
                            }
                        }
                        else {
                            //first div no border top
                            if (x == 0) {
                                document.getElementById('publicClanLeaderboard').innerHTML += `
            <div id="publicClanPoints${result.data[x].ClanID}" class="leaderboardDiv">
            <p class="rankNo">${x + 1}.</p>
            <div class="clanCrown">
                <img src="./images/gif/crown.gif" class="crown" />
                <p class="characterName1">${result.data[x].ClanName}</p>
            </div>
            <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
        </div>
            `
                            }
                            else {
                                document.getElementById('publicClanLeaderboard').innerHTML += `
                <div id="publicClanPoints${result.data[x].ClanID}" class="leaderboardDiv" style="border-top: none;">
                <p class="rankNo">${x + 1}.</p>
                <p class="characterName${x + 1}" id="rankName${x}">${result.data[x].ClanName}</p>
                <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
            </div>`
                            }
                            // if names are not top3, change color
                            if (x > 2) {
                                document.getElementById(`rankName${x}`).className = "honourary"
                            }
                            //highlght clan id belonging to player_id
                            if (ClanIDArr.indexOf(parseInt(result.data[x].ClanID)) != -1) {
                                document.getElementById(`publicClanPoints${result.data[x].ClanID}`).style.backgroundColor = '#ddccff';

                            }


                        }
                    }

                })
                .catch((error) => {
                    console.log(error);
                    return
                })

        })
        .catch((error) => {
            console.log(error);
            return
        })

}

//number of times played by each public clans
function appendPublicClanTime() {
    var ClanIDArr = []
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/ClanDetails/getAllClans/${player_id}`)
        .then((response) => {
            response.data.forEach((obj) => {
                if (obj.ClanType == "public") {
                    ClanIDArr.push(obj.ClanID);
                    document.getElementById('publicClanTimeLeaderboard').innerHTML += `
        <p class="playerPointsClan"><span class="ClanName">${obj.ClanName}'s</span> rank: <span id="rankTime${obj.ClanID}" class="rankNumber"></span> </p>
        `
                }
            })
            axios.post(`${API_URL}/api/rps/getTimesPlayedPublicClan`, bodyData)
                .then((result) => {
                    ClanIDArr.forEach((element) => {
                        console.log(element)
                        //get rank of clans joined by player
                        var index = result.data.findIndex(obj => obj.ClanID == element);
                        if (index == -1) {
                            document.getElementById(`rankTime${element}`).innerHTML = result.data.length + 1
                        }
                        else {
                            document.getElementById(`rankTime${element}`).innerHTML = index + 1
                        }
                    })
                    for (let x = 0; x < 5; x++) {
                        if (result.data[x] == null) {
                            document.getElementById('publicClanTimeLeaderboard').innerHTML += `
                            <div id="noTimesData${x}" class="leaderboardDiv" style="padding-top:8%; padding-bottom:8%">
                            <p id="pointsEarned" class="earned" style="color:red">No Clan played yet</p>
                        </div>
                            `
                            if (x !== 0 && document.getElementById(`noTimesData${x}`) !== null) {
                                document.getElementById(`noTimesData${x}`).style.borderTop = 'none'
                            }
                        }
                        else {
                            if (x == 0) {
                                //difference between 0 and x<5 is just borderTop and crown gif
                                document.getElementById('publicClanTimeLeaderboard').innerHTML += `
            <div id="publicClanTimes${result.data[x].ClanID}" class="leaderboardDiv">
            <p class="rankNo">${x + 1}.</p>
            <div class="clanCrown">
                <img src="./images/gif/crown.gif" class="crown" />
                <p class="characterName1">${result.data[x].ClanName}</p>
            </div>
            <p class="earned">${result.data[x].total_times_played} times</p>
        </div>
            `
                            }
                            else {
                                document.getElementById('publicClanTimeLeaderboard').innerHTML += `
                <div id="publicClanTimes${result.data[x].ClanID}" class="leaderboardDiv" style="border-top: none;">
                <p class="rankNo">${x + 1}.</p>
                <p class="characterName${x + 1}" id="rankName4${x}">${result.data[x].ClanName}</p>
                <p class="earned">${result.data[x].total_times_played} times</p>
            </div>`
                            }
                            //if clan is not in top3, change color of clanName
                            if (x > 2) {
                                document.getElementById(`rankName4${x}`).className = "honourary"
                            }
                            //highlight clan that are player_id joined
                            if (ClanIDArr.indexOf(parseInt(result.data[x].ClanID)) != -1) {
                                document.getElementById(`publicClanTimes${result.data[x].ClanID}`).style.backgroundColor = '#ddccff';

                            }
                        }
                    }

                })
                .catch((error) => {
                    console.log(error);
                    return
                })

        })
        .catch((error) => {
            console.log(error);
            return
        })

}

//monthly all player leaderboard
function appendPublicPlayer() {
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/monthlyLeaderboardOfAllPlayers`, bodyData)
        .then((result) => {
            console.log(result)
            var index = result.data.findIndex(obj => obj.player_id == player_id);
            if (index != -1) {
                //find player rank and get player point and gold earned for current month
                document.getElementById(`personalPointGold`).innerHTML += `
            <p class="playerGoldClan" id="rankPlayer">Your Rank:<span class="rankNumber"> ${index + 1}</span></p>
            <p class="notes">Your gold earned: <span class="rankNumber">$${result.data[index].total_gold_earned}</span></p>
            <p class="notes">Your points earned: <span class="rankNumber">${result.data[index].total_points_earned}pts</span></p>
            `
            }
            else {
                //if player hasnt played a singke game
                document.getElementById(`personalPointGold`).innerHTML += `
            <p class="playerGoldClan">Your Rank:<span style="font-size:15px"> Please play to get rank</span> </p>
            <p class="notes">Your gold earned: $0.00</p>
            <p class="notes">Your points earned: 0 pt</p>
            `
            }
            for (let x = 0; x < 5; x++) {
                if (result.data[x] == null) {
                    document.getElementById('personalPointGold').innerHTML += `
                    <div id="noplayerData${x}" class="personalLeaderboardDiv" style="padding-top:8%; padding-bottom:8%">
                    <p id="pointsEarned" class="earned" style="color:red">No player played yet</p>
                </div>
                    `
                    if (x !== 0 && document.getElementById(`noplayerData${x}`) !== null) {
                        document.getElementById(`noplayerData${x}`).style.borderTop = 'none'
                    }
                }
                else {
                    if (x == 0) {
                        //x==0 is with crown and border top
                        document.getElementById(`personalPointGold`).innerHTML += `
                    <div id="personalDiv${result.data[x].player_id}" class="personalLeaderboardDiv">
                            <p class="rankNo">${x + 1}.</p>
                            <img src="${result.data[x].image_path}" class="playerImg" />
                            <div class="nameCrown">
                                <img src="./images/gif/crown.gif" class="crown" />
                                <p class="characterName1">${result.data[x].player_username}</p>
                            </div> 
                            <p id="goldEarned" class="earned">$  ${result.data[x].total_gold_earned}</p>
                            <p id="pointsEarned" class="earned"> ${result.data[x].total_points_earned} pts</p>
                        </div>`
                    }
                    else {
                        document.getElementById(`personalPointGold`).innerHTML += `
                    <div id="personalDiv${result.data[x].player_id}" class="personalLeaderboardDiv" style="border-top: none;">
                    <p class="rankNo">${x + 1}.</p>
                    <img src="${result.data[x].image_path}" class="playerImg" />
                        <p class="characterName${x + 1}" id="rankName2${x}">${result.data[x].player_username}</p>
                        <p id="goldEarned" class="earned">$  ${result.data[x].total_gold_earned}</p>
                        <p id="pointsEarned" class="earned"> ${result.data[x].total_points_earned} pts</p>
                </div>
                `
                    }
                    //change color if rank not top3
                    if (x > 2) {
                        document.getElementById(`rankName2${x}`).className = "honourary"
                    }

                    //highlight player's div
                    if (result.data[x].player_id == player_id) {
                        document.getElementById(`personalDiv${result.data[x].player_id}`).style.backgroundColor = '#ddccff'
                    }
                }
            }


        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//append montly combi that earned the most points/gold
function appendWinningCombi() {
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/combinationWithMostWinsAll`, bodyData)
        .then((result) => {
            for (let x = 0; x < 5; x++) {
                if (result.data[x] == null) {
                    document.getElementById('winningCombiLeaderboard').innerHTML += `
                    <div id="noCombiData${x}" class="personalLeaderboardDiv" style="padding-top:8%; padding-bottom:8%">
                    <p id="pointsEarned" class="earned" style="color:red">No player played yet</p>
                </div>
                    `
                    if (x !== 0 && document.getElementById(`noCombiData${x}`) !== null) {
                        document.getElementById(`noCombiData${x}`).style.borderTop = 'none'
                    }
                }
                else {
                    //difference just the crown and border top
                    if (x == 0) {
                        document.getElementById("winningCombiLeaderboard").innerHTML += `
        <div id="no1" class="personalLeaderboardDiv">
        <p class="rankNo">${x + 1}.</p>
        <div class="nameCrown2">
            <img src="./images/gif/crown.gif" class="crown" />
            <p class="characterName1">${result.data[x].player_move} + ${result.data[x].com_move}</p>
        </div>
        <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
        <p id="goldEarned" class="earned">$ ${result.data[x].total_gold_earned}</p>
    </div>`
                    }
                    else {
                        document.getElementById("winningCombiLeaderboard").innerHTML += `
                <div id="no${x + 1}" class="personalLeaderboardDiv" style="border-top: none;">
                <p class="rankNo">${x + 1}.</p>
                <p class="characterName${x + 1}" id="rankName3${x}">${result.data[x].player_move} + ${result.data[x].com_move}</p>
                <p id="pointsEarned" class="earned">${result.data[x].total_points_earned} pts</p>
                <p id="goldEarned" class="earned">$ ${result.data[x].total_gold_earned}</p>
            </div>
                `
                    }
                    //if rank not top3, change color of text
                    if (x > 2) {
                        document.getElementById(`rankName3${x}`).className = "honourary"
                    }
                }
            }
        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//monthly non-player combi 
function appendNonPlayerCombi() {
    const bodyData = {
        "month": month,
        "year": year
    }
    axios.post(`${API_URL}/api/rps/combinationComChoose`, bodyData)
        .then((result) => {

            if (result.data[0] == null) {
                var noOfTimes = 0;
            }
            else {
                var noOfTimes = result.data[0].no_of_times;
            }

            var percentageArr = [];
            //percentage of first data
            let prevPercentage = parseFloat(noOfTimes).toFixed(1);
            percentageArr.push(prevPercentage + '%');
            //percentage of first and sec data added with prev data
            for (let x = 1; x < 3; x++) {
                prevPercentage = (parseFloat(prevPercentage) + parseFloat(result.data[x].no_of_times)).toFixed(1);
                percentageArr.push(prevPercentage + '%');
            }

            //make pie chart
            document.getElementById('nonPlayerCombiRank').innerHTML += `
              <div id="combiPieChart"></div>
            `;
            //the color part of the piechart
            document.getElementById("combiPieChart").style.background = `conic-gradient(#ffe6ff 0% ${percentageArr[0]},  #ffccff ${percentageArr[0]} ${percentageArr[1]},  #ffb3ff ${percentageArr[1]} ${percentageArr[2]})`;
            for (let x = 0; x < 3; x++) {
                if (result.data[x] == null) {
                    document.getElementById('nonPlayerCombiRank').innerHTML += `
                    <div id="combiNo${x + 1}" class="combiLeaderboardDiv" style="padding-top:8%; padding-bottom:8%">
                    <p id="pointsEarned" class="earned" style="color:red">No player played yet</p>
                </div>
                    `
                    if (x !== 0 && document.getElementById(`combiNo${x + 1}`) !== null) {
                        document.getElementById(`combiNo${x + 1}`).style.borderTop = 'none'
                    }
                }
                else {
                    //difference between x==0 and x!=0 is crown and border top
                    if (x == 0) {
                        document.getElementById('nonPlayerCombiRank').innerHTML += `
                    <div class="combiLeaderboardDiv" id="comboNo${x + 1}" style='background-color:#ffe6ff'>
                    <p class="rankNo">${x + 1}.</p>
                    <div class="nameCrown2">
                        <img src="./images/gif/crown.gif" class="crown" />
                        <p class="characterName1">${result.data[x].com_move}</p>
                    </div>
                    <p id="no_of_times" class="earned">${parseFloat(result.data[x].no_of_times).toFixed(1)}%</p>
                </div>`
                    }
                    else {
                        document.getElementById('nonPlayerCombiRank').innerHTML += `
                    <div class="combiLeaderboardDiv" id="comboNo${x + 1}" style="border-top: none; background-color:#ffccff">
                    <p class="rankNo">${x + 1}.</p>
                    <p class="characterName${x + 1}">${result.data[x].com_move}</p>
                    <p id="no_of_times" class="earned">${parseFloat(result.data[x].no_of_times).toFixed(1)}%</p>
                </div>
                    `
                    }
                }

            }
            document.getElementById(`comboNo1`).style.backgroundColor = ' #ffe6ff';
            document.getElementById(`comboNo2`).style.backgroundColor = ' #ffccff';
            document.getElementById(`comboNo3`).style.backgroundColor = ' #ffb3ff';
            document.getElementById(`comboNo2`).style.borderTop = 'none';
            document.getElementById(`comboNo3`).style.borderTop = 'none';
        })
        .catch((error) => {
            console.log(error);
            return;
        })

}
