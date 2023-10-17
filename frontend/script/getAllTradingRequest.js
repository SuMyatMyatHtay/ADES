
//Temporary Testing Data before connecting with other tables 
const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');

const showRequest = document.getElementById("showRequest");
const acceptResult = document.getElementById("acceptResult");

function getAllRequests() {

    axios.post(API_URL + '/api/tradingRoute/getAllTradingReq/' + PLAYERIDTEMP)

        .then((response) => {
            console.log(response)
            console.log(response.data);
            AllTradingRequestDisplay(response.data);

        })
        .catch(function (error) {
            console.log(error);
            AllTradingRequestDisplay(error);
        })
}

function AllTradingRequestDisplay(objData) {
    console.log(objData);
    console.log(objData.length);
    let EachFriend = ``

    if (objData.length == 0) {
        EachFriend += `<h3 style = "color : white"> No Trading Request are pending </h3> `
    }
    else {

        for (var i = 0; i < objData.length; i++) {
            EachFriend += `
        <div class="row"
            style="background-color: rgba(0, 0, 0, 0.511); padding: 20px 150px 60px 150px; margin: 50px 0px; border: 4px solid red;">

            <div class="col-md-12 mt-3" style="padding-bottom: 40px; color: white;">
                <h3>Trading Request ID : ${objData[i].TradingRequestID}</h3>
                <h3>Trading Requested By : ${objData[i].tradingWith}</h3>
            </div>

            <div class="col-md-5">
                <div class="card" style="border: 4px solid red;">
                    <img src="./images/cards/${objData[i].cardToGiveImage}" class="card-img-top" alt="Card Image 1">
                    <div class="card-body">
                        <h4 class="card-title">From This Card</h4>
                        <p class="card-text">Card Name :  ${objData[i].cardToGiveName}</p>
                        <p class="card-text">Level : </p>
                        <p class="card-text">Hit Point : ${objData[i].cardToGiveHP}</p>
                        <p class="card-text">Attack Name : ${objData[i].cardToGiveAN}</p>
                    </div>
                </div>
            </div>

            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <img src="./images/tradingArrow.png" alt="Exchange Arrow" class="arrow-image" style="width: 100%;">
            </div>

            <div class="col-md-5">
                <div class="card" style="border: 4px solid red;">
                    <img src="./images/cards/${objData[i].cardToReceiveImage}" class="card-img-top" alt="Card Image 2">
                    <div class="card-body">
                        <h4 class="card-title">To This Card</h4>
                        <p class="card-text">Card Name : ${objData[i].cardToReceiveName}</p>
                        <p class="card-text">Level : </p>
                        <p class="card-text">Hit Point : ${objData[i].cardToReceiveHP}</p>
                        <p class="card-text">Attack Name : ${objData[i].cardToReceiveAN}</p>
                    </div>
                </div>
            </div>



            <div class="col-md-12 d-flex justify-content-center mt-3">
            <button class="custom-button" onclick="acceptTrading(${objData[i].cardToGiveID}, ${objData[i].tradeOffererID}, ${objData[i].cardToReceiveID} )">Trading Accept</button>
            <button class="custom-button" onclick="rejectTrading(${objData[i].cardToGiveID},${objData[i].cardToReceiveID})">Trading Reject</button>
            </div>
        </div>
        
        `
        }

        /*
         let EachFriend = ``
     
         if (objData.length == 0) {
             EachFriend += `
             <h4> There is no trading request pending </h4> 
             `
         }
     
         var NumOfRows = Math.floor(objData.length / 2);
         if (objData.length % 2 != 0) {
             NumOfRows++;
         }
         var currentCard = 1;
     
         for (tempRow = 1; tempRow <= NumOfRows; tempRow++) {
             EachFriend += `
                 <div class="row container-fluid">
             `
             for (tempFour = 1; tempFour <= 2; tempFour++) {
                 if (currentCard <= objData.length) {
                     EachFriend += `
                         <div class="col-6" style="background-color: white; padding: 50px">
                             <div style="background-color: pink; border: 3px solid black" > 
                             <div class="p-5">
                                 <h4> Trading Request : ${objData[currentCard - 1].TradingRequestID} </h4> 
                                 <h4> Trading Requested By : ${objData[currentCard - 1].tradingWith} </h4> 
                                 <div class="row py-4">
                                     <div class="col-5">
                                         <h4 style="text-align: center;"> From : ${objData[currentCard - 1].cardToGiveName} </h4> 
                                         <img src="./images/cards/${objData[currentCard - 1].cardToGiveImage}" alt="pic1" class="mx-3" style="width: 100%">
                                     </div>
                                     <div class="col-2 d-flex justify-content-center align-items-center">
                                         
                                         <img src="./images/tradingArrow.png" alt="tradingArrow" style="width: 100%;">
                                     </div>
                                     <div class="col-5">
                                         <h4 style="text-align: center;"> To : ${objData[currentCard - 1].cardToReceiveName} </h4> 
                                         <img src="./images/cards/${objData[currentCard - 1].cardToReceiveImage}" alt="pic1" class="mx-3" style="width: 100%">
                                     </div>
                                 </div>
                                 <div class="row">
                                     <div class="col-5" style="border: 2px solid black">
                                         <p style="text-align: left;">Card Name : ${objData[currentCard - 1].cardToGiveName}</p>
                                         <p style="text-align: left;">Level : </p>
                                         <p style="text-align: left;">Hit Point : ${objData[currentCard - 1].cardToGiveHP}</p>
                                         <p style="text-align: left; height:60px">Attack Name : ${objData[currentCard - 1].cardToGiveAN}</p>
     
                                     </div>
                                     <div class="col-2"></div>
                                     <div class="col-5" style="border: 2px solid black">
                                         <p style="text-align: left;">Card Name : ${objData[currentCard - 1].cardToReceiveName}</p>
                                         <p style="text-align: left;">Level : </p>
                                         <p style="text-align: left;">Hit Point : ${objData[currentCard - 1].cardToReceiveHP}</p>
                                         <p style="text-align: left; height:60px">Attack Name : ${objData[currentCard - 1].cardToReceiveAN}</p>
     
                                     </div>
     
                                 </div>
     
                                 <div style="padding-top:30px"> 
                                 <button class="custom-button" onclick="acceptTrading(${objData[currentCard - 1].cardToGiveID}, ${objData[currentCard - 1].tradeOffererID}, ${objData[currentCard - 1].cardToReceiveID} )">Trading Accept</button>
                                 <button class="custom-button" onclick="rejectTrading(${objData[currentCard - 1].cardToGiveID},${objData[currentCard - 1].cardToReceiveID})">Trading Reject</button>
                                 </div> 
                             </div>
                             </div> 
                         </div>
                     `
                     currentCard++;
                 }
             }
             EachFriend += `</div>`
         }
         showRequest.innerHTML = EachFriend;
     */
    }
    showRequest.innerHTML = EachFriend;
}

function acceptTrading(cardToGiveID, tradeOffererID, cardToReceiveID) {
    axios.put(API_URL + '/api/tradingRoute/tradingAccept/' + PLAYERIDTEMP, {
        "cardToGiveID": cardToGiveID,
        "tradeOffererID": tradeOffererID,
        "cardToReceiveID": cardToReceiveID
    })

        .then((response) => {
            console.log(response)
            console.log(response.data);
            if (response.data.affectedRows > 0) {
                console.log(`In AXIOS cardToGiveID is ${cardToGiveID}`)

                //changing the trading status into accepted. 
                axios.put(API_URL + '/api/tradingRoute/changeTradingStatus', {

                    "cardToGiveID": cardToGiveID,
                    "cardToReceiveID": cardToReceiveID,
                    "result": "accepted"

                })
                    .then((response) => {
                        console.log(cardToGiveID, cardToReceiveID)
                        sideTradingReqDelete(cardToGiveID, cardToReceiveID)
                        console.log("Trading Success trading status updated!")
                        console.log(response);

                        /*
                        axios.delete(API_URL + '/api/tradingRoute/tradingAcceptThenDelete', {
                            data: {
                                "cardToGiveID": cardToGiveID,
                                "cardToReceiveID": cardToReceiveID
                            }
                        })
                            .then((response) => {
                                console.log(response);
                                acceptResult.innerHTML = `<h4> The trading SUCCESS! Line successfully deleted!</h4>`
                            })
                            .catch(function (error) {
                                console.log(error);
                                acceptResult.innerHTML = error
                            })
                        //acceptResult.innerHTML = `<h4> The trading SUCCESS! Line successfully deleted!</h4>`
                            */
                    })
                    .catch(function (error) {
                        console.log(error);
                        //acceptResult.innerHTML = error
                    })

                // acceptResult.innerHTML = `<h4> The trading SUCCESS! </h4>`

            }
            else {
                acceptResult.innerHTML = `<h4> Trading unexpectedly fail! as there is no affected rows </h4>`
            }

        })
        .then(() => {
            showRequest.innerHTML = ``;
        })
        .catch(function (error) {
            console.log(error);
            acceptResult.innerHTML = error;
        })
}

function rejectTrading(cardToGiveID, cardToReceiveID) {
    //change the trading status into rejected. 
    axios.put(API_URL + '/api/tradingRoute/changeTradingStatus', {
        "cardToGiveID": cardToGiveID,
        "cardToReceiveID": cardToReceiveID,
        "result": "rejected"
    })
        .then((response) => {
            console.log("Trading Success trading status updated!")
            console.log(response);
            /*
            axios.delete(API_URL + '/api/tradingRoute/tradingAcceptThenDelete', {
                data: {
                    "cardToGiveID": cardToGiveID,
                    "cardToReceiveID": cardToReceiveID
                }
            })
                .then((response) => {
                    console.log(response);
                    acceptResult.innerHTML = `<h4> The trading SUCCESS! Line successfully deleted!</h4>`
                })
                .catch(function (error) {
                    console.log(error);
                    acceptResult.innerHTML = error
                })
            */
        })
        .then(() => {
            acceptResult.innerHTML = `<h3  style="background-color: rgba(0, 0, 0, 0.593); padding: 10px 30px; color: white; font-weight: bolder;"> Trading Rejected Successfully. LOADING ....  </h3> `
            showRequest.innerHTML = ``;
        })
        .then(() => {
            setTimeout(function () {
                location.reload();
            }, 3000);
        })
        .catch(function (error) {
            console.log(error);
            acceptResult.innerHTML = error
        })
}

function sideTradingReqDelete(cardToGiveID, cardToReceiveID) {
    axios.delete(API_URL + '/api/tradingRoute/sideTradingReqDelete', {
        data: {
            "cardToGiveID": cardToGiveID,
            "cardToReceiveID": cardToReceiveID
        }
    })
        .then(() => {
            acceptResult.innerHTML = `<h3  style="background-color: rgba(0, 0, 0, 0.593); padding: 10px 30px; color: white; font-weight: bolder;"> Trading Accepted Successfully. Hold on for a second... </h3> `

        })
        .then((response) => {
            console.log(response);
            console.log("Side Trading Req are successfully deleted!");
        })

        .then(() => {
            setTimeout(function () {
                location.reload();
            }, 3000);
        })
        .catch(function (error) {
            console.log(error);
            console.log("Deleting Side Trading Req failed!");
        })
    //acceptResult.innerHTML = `<h4> The trading SUCCESS! Line successfully deleted!</h4>`
}


getAllRequests(); 