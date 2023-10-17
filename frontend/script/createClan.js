
const player_id = localStorage.getItem('player_id');
const clanName = document.getElementById("clanName")
const radioError = document.getElementById("radioError");
const exceedText = document.getElementById('exceedText');
const submit = document.getElementById("submit");

clanName.onchange = checkClanExists;

document.addEventListener("DOMContentLoaded", function (event) {
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
        .then((result) => {
            console.log(result);
            //add player_username to url
            const player_username = result.data.player_username
            const redirectUrl = `${API_URL}/createClan.html?${player_username}`
            window.history.pushState("", "new page with player_id", redirectUrl);
            //check how many clans player has joined first
            if (checkNoOfClans()) {
                //then check how many clans they have created
                checkClan();
            }

        })
        .catch((error) => {
            console.log(error);
        })

});

//each player can only create up to 2 clans
function checkClan() {
    axios.get(`${API_URL}/api/clanDetails/clanCreatedBy/${player_id}`)
        .then((result) => {
            if (result.data.length == 2) {
                //append alert text
                exceedText.style.backgroundColor = ` rgb(255, 72, 0)`;
                exceedText.innerHTML = `Sorry you have exceeded the number of clans created.
                <span style="display:block; margin-top:10px">
                You will not be allowed to create anymore clans.
            </span>`
                //disable everything that can be inputted
                document.getElementById("clanName").disabled = true;
                document.getElementById("privateOpt").disabled = true;
                document.getElementById("publicOpt").disabled = true;
                document.getElementById("submit").disabled = true;
                //setTimeout to make alert text disappear
                setTimeout(() => {
                    exceedText.innerHTML = "";
                    exceedText.style.backgroundColor = ''
                }, 5000)
                return;
            }
            else {
                //else submit on click will create clan
                submit.onclick = createClan;
            }

        })
        .catch((error) => {
            console.log(error);
            return;
        })
}

//check if clan name exists 
//this is onchange
function checkClanExists() {
    document.getElementById('nameError').innerHTML = '';
    clanName.style.border = "1px solid black";

    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/clanDetails/getClanID/${clanName.value}`)
            .then((result) => {
                console.log(result.data.ClanID);
                if (result.data.ClanID != null) {
                    // If exists, show error with red border
                    document.getElementById('nameError').innerHTML = 'Clan name exists';
                    clanName.style.border = "2px solid red";
                    resolve(true); // Clan name exists
                } else {
                    resolve(false); // Clan name does not exist
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}


//createClan 
function createClan() {
    const clanName = document.getElementById("clanNameInput")
    const exceedText = document.getElementById('createExceedText');
    var typeValue;
    //check which radio button is checked
    var radioButtons = document.querySelectorAll("input[type='radio'][name='type']")
    for (let x = 0; x < radioButtons.length; x++) {
        if (radioButtons[x].checked) {
            typeValue = radioButtons[x].value;
        }
    }
    //if null value, show radioError 
    if (typeValue == null) {
        document.getElementById('radioError').innerHTML='please select one option';
    }
    //if ok, dont 'show' radioError
    else {
        document.getElementById('radioError').innerHTML=''
    }
    //if value is empty string, border it and alert player
    if (clanName.value == '') {
        clanName.style.border = "2px solid red";
    }
    //no error
    else {
        clanName.style.border = "1px solid black";
    }
    //Tell player that they need to fill iup inputs
    if (clanName.value == '' || typeValue == null) {
        window.alert("Please fill up all inputs.")
        return;
    }
    checkClanExists().then((clanExists) => {
        if (clanExists) {
            exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
            document.getElementById('exceedText').innerHTML=`Clan name exists`;
            setTimeout(() => {
                document.getElementById('exceedText').innerHTML=``;
                exceedText.style.backgroundColor = "";
            }, 5000);
            return;
        } else {

            const bodyData = {
                "ClanName": clanName.value,
                "ClanType": typeValue
            }


            axios.post(`${API_URL}/api/clanDetails/createClan/${player_id}`, bodyData)
                .then((result) => {
                    console.log(result);
                    clanName.style.border = "1px solid black";
                    document.getElementById('radioError').innerHTML='';
                    window.alert(`'${clanName.value}' has been created! You get free 15 clan points!`);
                    //once create check if players have exceeded no of clans created/joined
                    //in case they want too creat eanother one
                    if (checkNoOfClans()) {
                        checkClan();
                    }
                    //remove all values
                    clanName.value = ''
                    var radioButtons = document.querySelectorAll("input[type='radio'][name='type']")
                    for (let x = 0; x < radioButtons.length; x++) {
                        radioButtons[x].checked = false;
                    }
                    //give clans created by players 15 clan points as welcome gift
                    const bodydata2 = {
                        "clan_point": 15
                    }
                    axios.put(`${API_URL}/api/clanDetails/updateClanPoints/${result.data.insertId}`, bodydata2)
                        .then((result) => {
                            console.log(result)
                        })
                        .catch((error) => {
                            console.log(error);
                            return;
                        })
                })

                .catch((error) => {
                    if (error.response.status == 400) {
                        exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
                        exceedText.innerHTML=`Please fill up all inputs`;
                        setTimeout(() => {
                            exceedText.innerHTML=''
                            exceedText.style.backgroundColor = "";
                        }, 5000);
                    }
                    console.log(error);
                    return;

                })

        }
    })
        .catch((error) => {
            console.log(error);
            return;

        })



}

//check number of clans player has joined
function checkNoOfClans() {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/api/ClanDetails/getAllClans/${player_id}`)
            .then((result) => {
                if (result.data.length >= 4) {
                    //if length exceeds or equals four, no more joining clans
                    //show exceedText again
                    exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
                    exceedText.innerHTML = `Sorry, you have exceeded the number of clans joined.
                    <span style="display:block; margin-top:10px">
                    Unjoin a clan to create a new clan.
                </span>`;
                    //disable all buttons
                    document.getElementById("clanName").disabled = true;
                    document.getElementById("privateOpt").disabled = true;
                    document.getElementById("publicOpt").disabled = true;
                    //make exceedText not seen after 5s
                    setTimeout(() => {
                        exceedText.innerHTML = "";
                        exceedText.style.backgroundColor = "";
                    }, 5000);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
}
