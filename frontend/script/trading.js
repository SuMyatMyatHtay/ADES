
const API_URL = 'https://monster-cat-world.onrender.com'

//Temporary Testing Data before connecting with other tables 
const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');


const tradeButton = document.getElementById("tradeButton");
tradeButton.onclick = function () {
    tradeSave()

}

const myCards = document.getElementById("MyCards");
const theirCards = document.getElementById("TheirCards");
const mySelectedCard = document.getElementById("mySelectedCard");
const friSelectedCard = document.getElementById("friSelectedCard");
const TradingStatus = document.getElementById("TradingStatus");
const AftTrade = document.getElementById("AftTrade")
const selectCardArea = document.getElementById("selectCardArea")


function printOutPlayerCards(playerID) {
    axios.get(API_URL + '/api/tradingRoute/cardtrading/' + playerID)
        .then((response) => {
            console.log(response)
            console.log(response.data);
            AllMyCardsDisplay(response.data);

        })
        .catch(function (error) {
            console.log(error);
            AllMyCardsDisplay(error);
        })
}

function printOutFriendCards(playerID, friendID) {
    axios.get(API_URL + '/api/tradingRoute/cardtrading/' + playerID + '/' + friendID)
        .then((response) => {
            console.log(response)
            console.log(response.data);
            AllFriendsCardsDisplay(response.data);

        })
        .catch(function (error) {
            console.log(error);
            AllFriendsCardsDisplay(error);
        })
}

function AllMyCardsDisplay(objData) {
    console.log(objData);
    console.log(objData.length);
    let EachFriend = ``;

    if (objData.length == 0) {
        EachFriend += `<div> <h3> There is no card for you to select</h3> </div>`
    }

    var NumOfRows = Math.floor(objData.length / 4);
    if (objData.length % 4 != 0) {
        NumOfRows++;
    }

    var currentCard = 1;

    for (tempRow = 1; tempRow <= NumOfRows; tempRow++) {
        EachFriend += `
            <div class="row">
        `
        for (tempFour = 1; tempFour <= 4; tempFour++) {
            if (currentCard <= objData.length) {
                EachFriend += `
                        <div class="col-3">
                                <div class="card">
                                    <h4 class="card-title">Card Name: ${objData[currentCard - 1].creature_name}</h4>
                                    <div class="card-image">
                                        <img src="images/cards/${objData[currentCard - 1].card_image}" alt="balbasaur" class="img-fluid">
                                    </div>
                                    <div class="card-details">
                                        <h4>Card Details</h4>
                                        <div class="card-info">
                                            <p><strong>Card ID: ${objData[currentCard - 1].card_id}</strong></p>
                                            <p><strong>Hit Points: ${objData[currentCard - 1].hit_points}</strong></p>
                                            <p><strong>Level:</strong></p>
                                            <p style="height:60px"><strong>Attack Type: ${objData[currentCard - 1].attack_names}</strong></p>
                                        </div>
                                        <button onclick="showMyCard(${objData[currentCard - 1].card_id})" class="btn btn-primary btn-block custom-button" type="button">Select</button>
                                    </div>
                                </div>
                        </div>
                `
                currentCard++;
            }
        }
        EachFriend += `</div>`
    }

    //This is the current version without styling 
    // let EachFriend = ` `
    // for (var i = 0; i < objData.length; i++) {
    //     EachFriend += ` 
    //     <h1> ${objData[i].card_id} </h1> 
    //     <h1> ${objData[i].creature_name} </h1>
    //     <h1> ${objData[i].attack_name} </h1>
    //     <h1> ${objData[i].attack_damage} </h1>
    //     <h1> ${objData[i].hit_points} </h1>
    //     <button onclick="showMyCard(${objData[i].card_id})">Select ${objData[i].card_id}</button>   
    //     `
    // }
    myCards.innerHTML = EachFriend;
}

function AllFriendsCardsDisplay(objData) {
    console.log(objData);
    console.log(objData.length);
    let EachFriendI = ``;

    if (objData.length == 0) {
        EachFriendI += `<div> <h3> There is no card for you to select</h3> </div>`
    }

    var NumOfRows = Math.floor(objData.length / 4);
    if (objData.length % 4 != 0) {
        NumOfRows++;
    }

    var currentCard = 1;
    for (tempRow = 1; tempRow <= NumOfRows; tempRow++) {
        EachFriendI += `
            <div class="row">
        `
        for (tempFour = 1; tempFour <= 4; tempFour++) {
            if (currentCard <= objData.length) {
                EachFriendI += `
                        <div class="col-3">
                                <div  class="card">
                                    <h3 class="card-title">Card Name: ${objData[currentCard - 1].creature_name}</h3>
                                    <div class="card-image">
                                        <img src="images/cards/${objData[currentCard - 1].card_image}" alt="balbasaur" class="img-fluid">
                                    </div>
                                    <div class="card-details">
                                        <h4>Card Details</h4>
                                        <div class="card-info">
                                            <p><strong>Card ID: ${objData[currentCard - 1].card_id}</strong></p>
                                            <p><strong>Hit Points: ${objData[currentCard - 1].hit_points}</strong></p>
                                            <p><strong>Level:</strong></p>
                                            <p style="height:60px"><strong>Attack Type: ${objData[currentCard - 1].attack_names}</strong></p>
                                        </div>
                                        <button onclick="showFriendsCard(${objData[currentCard - 1].card_id})" class="btn btn-primary btn-block custom-button" type="button">Select</button>
                                    </div>
                                </div>
                        </div>
                `
                currentCard++;
            }
        }
        EachFriendI += `</div>`
    }
    theirCards.innerHTML = EachFriendI;
}

function showMyCard(objData) {
    axios.get(API_URL + '/api/cardRoute/' + objData)
        .then((response) => {
            console.log(response.data);
            let EachCard = `
                <div class="col-6" style="padding: 0px 30px;">
                    <img style="width: 100%; height: 100%;" src="./images/cards/${response.data[0].card_image}" alt="cardPic">
                </div>
                <div class="col-6">
                    <h4>${response.data[0].card_id}</h4>
                    <h4>${response.data[0].creature_name}</h4>
                    <h4> ${response.data[0].attack_name} </h4> 
                    <h4>${response.data[0].card_image}</h4>

                </div>
            `
            // let EachCard = ` 
            // <h2> ${response.data[0].card_id} </h2> 
            // <h2> ${response.data[0].creature_name} </h2> 
            // <h2> ${response.data[0].attack_name} </h2> 
            // `
            mySelectedCard.innerHTML = EachCard;
            localStorage.setItem('toBeTheirs', response.data[0].card_id);
        })
        .catch(function (error) {
            console.log(error);
        })
}
function showFriendsCard(objData) {
    axios.get(API_URL + '/api/cardRoute/' + objData)
        .then((response) => {
            console.log(response.data);
            let EachCard = `
                <div class="col-6" style="padding: 0px 30px;">
                    <img style="width: 100%; height: 100%;" src="./images/cards/${response.data[0].card_image}" alt="cardPic">
                </div>
                <div class="col-6">
                    <h4>${response.data[0].card_id}</h4>
                    <h4>${response.data[0].creature_name}</h4>
                    <h4> ${response.data[0].attack_name} </h4> 
                    <h4>${response.data[0].card_image}</h4>

                </div>
            `
            friSelectedCard.innerHTML = EachCard;
            localStorage.setItem('toBeMine', response.data[0].card_id);
        })
        .catch(function (error) {
            console.log(error);
        })
}

function tradeSave() {


    let PlayerID = localStorage.getItem('player_id');
    let FriendID = localStorage.getItem('FriendID');
    let toBeMine = localStorage.getItem('toBeMine');
    let toBeTheirs = localStorage.getItem('toBeTheirs');

    if (toBeMine === null || toBeTheirs === null) {
        TradingStatus.innerHTML = `<h4> Please Select Card First</h4>`
    }
    else {

        axios.post(API_URL + '/api/tradingRoute/tradeRequestCheck', {
            "playerID": PlayerID,
            "friendID": FriendID,
            "toBeMine": toBeMine,
            "toBeTheirs": toBeTheirs
        })
            .then((response) => {
                //console.log(PlayerID, FriendID, toBeMine, toBeTheirs)
                console.log(response.data);
                console.log("this is the response data");
                if (response.data.length >= 1) {
                    TradingStatus.innerHTML = `<h4>You have already sent the trade request. Choose another card.</h4>`
                }
                else {
                    axios.post(API_URL + '/api/tradingRoute/tradeButton', {
                        "playerID": PlayerID,
                        "friendID": FriendID,
                        "toBeMine": toBeMine,
                        "toBeTheirs": toBeTheirs
                    })
                        .then(() => {
                            AftTrade.innerHTML = `
                                <div style="display: flex; justify-content: center; align-items: center; height: 580px; margin: 0 auto; ">
                                    <img src="./images/gif/LoadingPinkBar.gif" alt="Loading"
                                        style="width: 700px; background-color: rgba(0, 0, 0, 0.449);">
                                </div>
                            `
                        })
                        .then(() => {
                            const tradesaveR = `
                            Trading Success
            `
                            TradingStatus.innerHTML = tradesaveR;
                            selectCardArea.innerHTML = ``;
                        })
                        .then(() => {
                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        })
                        .catch(function (error) {
                            console.log(error);
                            TradingStatus.innerHTML = error;
                        })


                    localStorage.removeItem("toBeMine");
                    localStorage.removeItem("toBeTheirs");
                }
            })

            .catch(function (error) {
                console.log(error);
            })

    }
}


printOutPlayerCards(PLAYERIDTEMP)
printOutFriendCards(PLAYERIDTEMP, FRIENDIDTEMP)