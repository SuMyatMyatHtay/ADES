const API_URL = 'https://monster-cat-world.onrender.com'
const queryParams = new URLSearchParams(window.location.search);
const clan_Name = queryParams.get('Clan_Name');
const player_id = localStorage.getItem('player_id');
var ClanID;
//get all document id
const dataBtn = document.getElementById('RPSData')
const startBtn = document.getElementById('start')
const instructionScreen = document.getElementById('firstScreen')
const gameScreen = document.getElementById('secondScreen');
const rockImg = document.getElementById("rockImg")
const paperImg = document.getElementById("paperImg")
const scissorsImg = document.getElementById("scissorsImg")
const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');
const playerDiv = document.getElementById('playerDiv');
const masterDiv = document.getElementById('masterDiv');
const countdown = document.getElementById('countdown');
const endCard = document.getElementById('endCard');
const quitBtn = document.getElementById('quit');
const restartBtn = document.getElementById('restart');
const playersChoice = document.getElementById('playersChoice');
const backToVillage = document.getElementById('backToVillage')

let countTimer;
//master arr
const masterArr = [
    ['./images/master1.png', 'Apprentice Bolin'],

    ['./images/master2.PNG', 'Shifu Aang'],
    ['./images/master3.png', 'Zen Zuko'],
    ['./images/master4.png', 'Socerer Cedric']
]
const RPSarr = [
    "rock", "paper", "scissors"
]
//onclick event
startBtn.onclick = startGame
quitBtn.onclick = quit
restartBtn.onclick = restart;
backToVillage.onclick = () => { window.location.assign(`${API_URL}/clanVillage.html?Clan_Name=${clan_Name}`) }
dataBtn.onclick = () => { window.location.assign(`${API_URL}/RPSData.html?Clan_Name=${clan_Name}`) }

//when document loads
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
                    //if player not from clan, bye go to clan.html
                    if (result.data.length == 0) {
                        window.location.assign(`${API_URL}/Clan.html`)
                    }

                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
    //start game
    startScreen();
});


//yes, i will redo for ca2
//it's a mess
//but basically just display none for thos that are not needed for the first screen
function startScreen() {
    backToVillage.style.display = "block"
    restartBtn.style.display = 'none'
    playersChoice.style.display = 'none'
    endCard.style.display = 'none';
    gameScreen.style.display = 'none';
    rockImg.style.display = 'none';
    paperImg.style.display = 'none';
    scissorsImg.style.display = 'none';
    rock.style.display = 'none';
    paper.style.display = 'none';
    scissors.style.display = 'none';
    instructionScreen.style.display = 'block';
    dataBtn.style.display = 'block'
}

//when startBtn is clicked
function startGame() {
    //for restarting of game
    clearInterval(countTimer);
    //yes again a mess
    //display: block for those in 2nd screen
    //display: none for thos in 1st screen
    dataBtn.style.display = 'none'
    backToVillage.style.display = 'none'
    instructionScreen.style.display = 'none';
    endCard.style.display = 'none';
    rockImg.style.display = 'none';
    paperImg.style.display = 'none';
    scissorsImg.style.display = 'none';
    gameScreen.style.display = 'block';
    quitBtn.style.display = 'block';
    restartBtn.style.display = 'none'
    playersChoice.style.display = 'none'

    //get the master avatar(non-player character)
    getPlayerMaster();
    //when game starts timer starts
    count(`Game begins in `, 3, () => {
        rock.style.display = 'block';
        paper.style.display = 'block';
        scissors.style.display = 'block';
        //3 secs heads up then choose obtions
        count(` s left to pick`, 5, () => {
            rock.style.display = 'none';
            paper.style.display = 'none';
            scissors.style.display = 'none'
            if (endCard.style.display == 'none' && instructionScreen.style.display == 'none') {
                restartBtn.style.display = "none";
                ifNoClick();
                //clearInterval once timer is done
                clearInterval(countTimer);
            }
        })
    }
    )
}

//timer
function count(message, seconds, callback) {
    let countdownNo = seconds
    let count = seconds
    countTimer = setInterval(() => {
        count -= 1;
        console.log(count);
        if (countdownNo == 3) {
            countdown.innerHTML = message + (count + 1);
        }
        else {
            countdown.innerHTML = (count + 1) + message;
        }
    }, 1000)
    setTimeout(() => {
        clearInterval(countTimer);
        callback()
    }, seconds * 1000)

}

//get avatar for the non-player character
function getPlayerMaster() {
    const player_id = localStorage.getItem('player_id');
    //this is for getting player avatar
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
        .then((result) => {
            console.log(result);
            const player_username = result.data.player_username
            axios.get(`${API_URL}/api/players/getPlayerAvatar/${result.data.image_id}`)
                .then((response) => {
                    console.log(response.data);
                    //random master avatar
                    const masterIndex = Math.floor(Math.random() * 4);
                    playerDiv.innerHTML = `<img src="${response.data}" id="player" />
            <p id="playerName">${player_username}</p>`;
                    masterDiv.innerHTML = `<img src="${masterArr[masterIndex][0]}" id="master" />
            <p id="masterName">${masterArr[masterIndex][1]}</p>`
                    return
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
}

document.addEventListener('click', function (e) {
    console.log(e.target.id)
    //options
    if (e.target.id == 'rock' || e.target.id == 'paper' || e.target.id == 'scissors') {
        //clearInterval once clicked one of these options
        clearInterval(countTimer);
        //restart button to appear 5s later
        setTimeout(() => {
            if(instructionScreen.style.display == 'none'){
            restartBtn.style.display = 'block';
            }
        }, 5000)
        //just some styling to make sure stuff that are not supposed to appear dont appear
        rockImg.style.transform = 'none';
        paperImg.style.transform = 'none';
        scissorsImg.style.transform = 'none';
        playersChoice.style.display = 'block'
        countdown.innerText = '';
        endCard.style.display = 'block';
        rock.style.display = 'none';
        paper.style.display = 'none';
        scissors.style.display = 'none';
        //randomise com action
        const RPSindex = Math.floor(Math.random() * 3);
        //if player choose rock
        if (e.target.id == 'rock') {
            //get the rock image
            document.getElementById('playersChoice').innerHTML = `
            <img src='./images/rock.png' id='rockOpt' style='position:absolute;width:150px;left:300px;top:20px;' class='resultImg'/>
            `
            //translate towards the com opt image
            var translateValue = `translate3d(250px,0,0)`
            setTimeout(() => {
                document.getElementById('rockOpt').style.transform = translateValue;
            }, 500)
            //just the if else statement based on players' choice
            //update clan points and gold based on lose or win or tie
            //also update the statistic for this game
            if (RPSarr[RPSindex] == 'scissors') {
                scissorsImg.style.display = 'block';
                scissorsImg.style.right = '300px';
                endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
                updateGold(5.00);
                updateClanPoints(10);
                updateRPSstat('rock', 'scissors', 10, 5.00);
                //translate towards player's rock image
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('scissorsImg').style.transform = translateValue2;
                    //make the scissors "fly" haha since it lost
                    setTimeout(() => {
                        document.getElementById('scissorsImg').style.transform = `rotate(180deg)`;
                        document.getElementById('scissorsImg').style.transform += `translate3d(-500px,0,0)`;
                    }, 500)
                }, 500)
            }
            else if (RPSarr[RPSindex] == 'paper') {
                paperImg.style.display = 'block';
                paperImg.style.right = '300px';
                endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
                updateGold(-3.00);
                updateClanPoints(-5);
                updateRPSstat('rock', 'paper', -5, -3.00);
                  //translate towards player's rock image
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('paperImg').style.transform = translateValue2;
                     //make the rock "fly" haha since it lost
                    setTimeout(() => {
                        document.getElementById('rockOpt').style.transform = `rotate(250deg)`;
                        document.getElementById('rockOpt').style.transform += `translate3d(400px,0,0)`;
                    }, 500)
                }, 500)
            }
            else if (RPSarr[RPSindex] == 'rock') {
                rockImg.style.display = 'block';
                rockImg.style.right = '300px';
                endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
                updateRPSstat('rock', 'rock', 0, 0.00);
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('rockImg').style.transform = translateValue2;
                }, 500)
            }
        }
        //it's simlar to the prev
        else if (e.target.id == 'paper') {
            document.getElementById('playersChoice').innerHTML = `
            <img src='./images/paper.png' id='paperOpt'style='position:absolute;width:150px;left:300px;top:20px' class='resultImg'/>
            `
            var translateValue = `translate3d(250px,0,0)`;
            setTimeout(() => {
                document.getElementById('paperOpt').style.transform = translateValue;
            }, 500)
            if (RPSarr[RPSindex] == 'rock') {
                rockImg.style.display = 'block';
                endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
                var translateValue2 = `translate3d(-250px,0,0)`;
                updateGold(5.00);
                updateClanPoints(10)
                updateRPSstat('paper', 'rock', 10, 5.00);
                setTimeout(() => {
                    document.getElementById('rockImg').style.transform = translateValue2;
                    setTimeout(() => {
                        document.getElementById('rockImg').style.transform = `rotate(180deg)`;
                        document.getElementById('rockImg').style.transform += `translate3d(-500px,0,0)`;
                    }, 500)
                }, 500)
            }
            else if (RPSarr[RPSindex] == 'scissors') {
                scissorsImg.style.display = 'block';
                endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
                updateGold(-3.00);
                updateClanPoints(-5)
                updateRPSstat('paper', 'scissors', -5, -3.00);
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('scissorsImg').style.transform = translateValue2;
                    setTimeout(() => {
                        document.getElementById('paperOpt').style.transform = `rotate(180deg)`;
                        document.getElementById('paperOpt').style.transform += `translate3d(500px,0,0)`;
                    }, 500)
                }, 500)
            }
            else if (RPSarr[RPSindex] == 'paper') {
                paperImg.style.display = 'block';
                clearInterval(countTimer);
                endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
                var translateValue2 = `translate3d(-250px,0,0)`;
                updateRPSstat('paper', 'paper', 0, 0.00);
                setTimeout(() => {
                    document.getElementById('paperImg').style.transform = translateValue2;
                }, 500)
            }
        }
        else if (e.target.id == 'scissors') {
            document.getElementById('playersChoice').innerHTML = `
            <img src='./images/scissors.png' id='scissorsOpt'style='position:absolute;width:150px;left:300px;top:20px' class='resultImg' />
            `
            var translateValue = `translate3d(250px,0,0)`;
            setTimeout(() => {
                document.getElementById('scissorsOpt').style.transform = translateValue;
            }, 500)

            if (RPSarr[RPSindex] == 'paper') {
                paperImg.style.display = 'block';
                endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
                updateGold(5.00);
                updateClanPoints(10)
                updateRPSstat('scissors', 'paper', 10, 5.00);
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('paperImg').style.transform = translateValue2;
                    setTimeout(() => {
                        document.getElementById('paperImg').style.transform = `rotate(180deg)`;
                        document.getElementById('paperImg').style.transform += `translate3d(-500px,0,0)`;
                    }, 500)
                }, 500)


            }
            else if (RPSarr[RPSindex] == 'rock') {
                rockImg.style.display = 'block';
                endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
                updateGold(-3.00);
                updateClanPoints(-5);
                updateRPSstat('scissors', 'rock', -5, -3.00);
                var translateValue2 = `translate3d(-250px,0,0)`;
                setTimeout(() => {
                    document.getElementById('rockImg').style.transform = translateValue2;
                    setTimeout(() => {
                        document.getElementById('scissorsOpt').style.transform = `rotate(250deg)`;
                        document.getElementById('scissorsOpt').style.transform += `translate3d(400px,0,0)`;
                    }, 500)
                }, 500)
            }
            else if (RPSarr[RPSindex] == 'scissors') {
                scissorsImg.style.display = 'block';
                endCard.innerHTML = `no gold & <span style='display:block'> no clan points</span>`
                endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
                var translateValue2 = `translate3d(-250px,0,0)`;
                updateRPSstat('scissors', 'scissors', 0, 0.00);
                setTimeout(() => {
                    document.getElementById('scissorsImg').style.transform = translateValue2;
                }, 500)
            }
        }
    }
})
//this is for if player doesnt click anything after time is out
function ifNoClick() {
    clearInterval(countTimer);
    setTimeout(() => {
        if(instructionScreen.style.display == 'none'){
            restartBtn.style.display = 'block';
            }
    }, 5000)
    rockImg.style.transform = 'none';
    paperImg.style.transform = 'none';
    scissorsImg.style.transform = 'none';
    playersChoice.style.display = 'block'
    countdown.innerText = '';
    endCard.style.display = 'block';
    rock.style.display = 'none';
    paper.style.display = 'none';
    scissors.style.display = 'none';
    const RPSindex = Math.floor(Math.random() * 3);
    //randomise player input
    const randomInput = Math.floor(Math.random() * 3);
    //same as the top function
    //yes yes they could be in the same function.
    //my bad. i will fix it in ca2
    if (RPSarr[randomInput] == 'rock') {
        document.getElementById('playersChoice').innerHTML = `
        <img src='./images/rock.png' id='rockOpt' style='position:absolute;width:150px;left:300px;top:20px;' class='resultImg'/>
        `
        var translateValue = `translate3d(250px,0,0)`;
        setTimeout(() => {
            document.getElementById('rockOpt').style.transform = translateValue;
        }, 500)

        if (RPSarr[RPSindex] == 'scissors') {
            scissorsImg.style.display = 'block';
            scissorsImg.style.right = '300px';
            endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
            updateGold(5.00);
            updateClanPoints(10);
            updateRPSstat('rock', 'scissors', 10, 5.00);
            var translateValue2 = `translate3d(-250px,0,0)`;
            setTimeout(() => {
                document.getElementById('scissorsImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('scissorsImg').style.transform = `rotate(180deg)`;
                    document.getElementById('scissorsImg').style.transform += `translate3d(-500px,0,0)`;
                }, 500)
            }, 500)
        }
        else if (RPSarr[RPSindex] == 'paper') {
            paperImg.style.display = 'block';
            paperImg.style.right = '300px';
            endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
            updateGold(-3.00);
            updateClanPoints(-5);
            updateRPSstat('rock', 'scissors', -5, -3.00);
            var translateValue2 = `translate3d(-250px,0,0)`;
            setTimeout(() => {
                document.getElementById('paperImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('rockOpt').style.transform = `rotate(250deg)`;
                    document.getElementById('rockOpt').style.transform += `translate3d(400px,0,0)`;
                }, 500)
            }, 500)
        }
        else if (RPSarr[RPSindex] == 'rock') {
            rockImg.style.display = 'block';
            rockImg.style.right = '300px';
            endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
            var translateValue2 = `translate3d(-250px,0,0)`;
            updateRPSstat('rock', 'rock', 0, 0.00);
            setTimeout(() => {
                document.getElementById('rockImg').style.transform = translateValue2;
            }, 500)
        }
    }
    else if (RPSarr[randomInput] == 'paper') {
        document.getElementById('playersChoice').innerHTML = `
        <img src='./images/paper.png' id='paperOpt'style='position:absolute;width:150px;left:300px;top:20px' class='resultImg'/>
        `
        var translateValue = `translate3d(250px,0,0)`;
        setTimeout(() => {
            document.getElementById('paperOpt').style.transform = translateValue;
        }, 500)
        if (RPSarr[RPSindex] == 'rock') {
            rockImg.style.display = 'block';
            endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
            var translateValue2 = `translate3d(-250px,0,0)`;
            updateGold(5.00);
            updateClanPoints(10)
            updateRPSstat('paper', 'rock', 10, 5.00);
            setTimeout(() => {
                document.getElementById('rockImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('rockImg').style.transform = `rotate(180deg)`;
                    document.getElementById('rockImg').style.transform += `translate3d(-500px,0,0)`;
                }, 500)
            }, 500)
        }
        else if (RPSarr[RPSindex] == 'scissors') {
            scissorsImg.style.display = 'block';
            endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
            updateGold(-3.00);
            updateClanPoints(-5)
            updateRPSstat('paper', 'scissors', -5, -3.00);
            var translateValue2 = `translate3d(-250px,0,0)`;
            setTimeout(() => {
                document.getElementById('scissorsImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('paperOpt').style.transform = `rotate(180deg)`;
                    document.getElementById('paperOpt').style.transform += `translate3d(500px,0,0)`;
                }, 500)
            }, 500)
        }
        else if (RPSarr[RPSindex] == 'paper') {
            paperImg.style.display = 'block';
            clearInterval(countTimer);
            endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
            var translateValue2 = `translate3d(-250px,0,0)`;
            updateRPSstat('paper', 'paper', 0, 0.00);
            setTimeout(() => {
                document.getElementById('paperImg').style.transform = translateValue2;
            }, 500)
        }
    }
    else if (RPSarr[randomInput] == 'scissors') {
        document.getElementById('playersChoice').innerHTML = `
        <img src='./images/scissors.png' id='scissorsOpt'style='position:absolute;width:150px;left:300px;top:20px' class='resultImg' />
        `
        var translateValue = `translate3d(250px,0,0)`;
        setTimeout(() => {
            document.getElementById('scissorsOpt').style.transform = translateValue;
        }, 500)

        if (RPSarr[RPSindex] == 'paper') {
            paperImg.style.display = 'block';
            endCard.innerHTML = `You Won!!!<span style='display:block'> +$5.00 gold &  10 clan points</span>`;
            updateGold(5.00);
            updateClanPoints(10)
            updateRPSstat('scissors', 'paper', 10, 5.00);
            var translateValue2 = `translate3d(-250px,0,0)`;
            setTimeout(() => {
                document.getElementById('paperImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('paperImg').style.transform = `rotate(180deg)`;
                    document.getElementById('paperImg').style.transform += `translate3d(-500px,0,0)`;
                }, 500)
            }, 500)


        }
        else if (RPSarr[RPSindex] == 'rock') {
            rockImg.style.display = 'block';
            endCard.innerHTML = `You lose!!! <span style='display:block'>-$3.00 gold &  -5 clan points</span>`
            updateGold(-3.00);
            updateClanPoints(-5)
            updateRPSstat('scissors', 'rock', -5, -3.00);
            var translateValue2 = `translate3d(-250px,0,0)`;
            setTimeout(() => {
                document.getElementById('rockImg').style.transform = translateValue2;
                setTimeout(() => {
                    document.getElementById('scissorsOpt').style.transform = `rotate(250deg)`;
                    document.getElementById('scissorsOpt').style.transform += `translate3d(400px,0,0)`;
                }, 500)
            }, 500)
        }
        else if (RPSarr[RPSindex] == 'scissors') {
            scissorsImg.style.display = 'block';
            endCard.innerHTML = `no gold & <span style='display:block'> no clan points</span>`
            endCard.innerHTML = `It's a tie!!!<span style='display:block'>  No gold & no clan points</span>`
            var translateValue2 = `translate3d(-250px,0,0)`;
            updateRPSstat('scissors', 'scissors', 0, 0.00);
            setTimeout(() => {
                document.getElementById('scissorsImg').style.transform = translateValue2;
            }, 500)
        }
    }

}

//update gold
function updateGold(gold) {
    let bodyData = {
        "gold": gold
    }
    axios.put(`${API_URL}/api/players/updateGold/${player_id}`, bodyData)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });

}

//update clan points
function updateClanPoints(clanPoints) {
    let bodyData2 = {
        "clan_point": clanPoints
    }
    axios.put(`${API_URL}/api/clanDetails/updateClanPoints/${ClanID}`, bodyData2)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });

}

//update the stats
function updateRPSstat(player_move, com_move, clan_point_earned, gold_earned) {
    const bodyData = {
        "player_move": player_move,
        "com_move": com_move,
        "clan_point_earned": clan_point_earned,
        "gold_earned": gold_earned,
        "timestamp": new Date()
    }

    axios.post(`${API_URL}/api/rps/updateRPSstat/${ClanID}/${player_id}`, bodyData)
        .then((result) => {
            console.log(result);
            return
        })
        .catch((error) => {
            console.log(error);
            return
        })


}

//quit function to quit playing the game
function quit() {
    clearInterval(countTimer)
    startScreen()


}
//restart to restart the game
function restart() {
    clearInterval(countTimer)
    startGame();

}