import React, { useEffect } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios
import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css';

let everyTradeReq = []
const playerID = localStorage.getItem('player_id');
const PLAYERIDTEMP = localStorage.getItem('player_id');
const API_URL = 'https://monster-cat-world.onrender.com';

const FRComponent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [TRLoaded, setTRLoaded] = useState(false);
    const [TRList, setTRList] = useState([]);

    const [acceptResult, setAcceptResult] = useState("")

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.reload();
        }

    };

    useEffect(() => {
        ListLoaded();
        console.log('useEffect is loaded')
    }, [])

    const ListLoaded = () => {
        console.log("List Loaded")
        axios.post(`${API_URL}/api/tradingRoute/getAllTradingReq/${(playerID)}`)
            .then((response) => {
                if (response.data.length > 0) {
                    everyTradeReq = [];
                    for (var i = 0; i < response.data.length; i++) {
                        var ImageOne = [response.data[i].cardToGiveImage]
                        var ImageTwo = [response.data[i].cardToReceiveImage]

                        const CG = response.data[i].cardToGiveID;
                        const CR = response.data[i].cardToReceiveID;
                        const TOID = response.data[i].tradeOffererID;

                        console.log(response.data[i])

                        everyTradeReq.push(
                            <div key={response.data[i].player_id} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px 45px", border: "3px solid rgb(145, 0, 207)", width: "650px" }}>
                                <div className="row align-items-center p-4">
                                    <div className="col-12" style={{ padding: "10px " }}>
                                        <h5 style={textStyle}> Trading Request ID : {response.data[i].TradingRequestID}</h5>
                                        <h5 style={textStyle}> Trading Requested By : {response.data[i].tradingWith} </h5>
                                    </div>
                                    <div className="col-5" style={{ border: "3px solid red", margin: "20px 0px", height: "430px" }}>
                                        <div style={{ padding: "30px", display: "flex", justifyContent: "center" }}>
                                            <img src={require('../images/cards/' + ImageOne[0])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                        </div>
                                        <div className="profileDetail" style={{ paddingLeft: "10px" }}>
                                            <p> Card ID : {response.data[i].cardToGiveID}</p>
                                            <p> Card Name : {response.data[i].cardToGiveName} </p>
                                            <p> Hit Points : {response.data[i].cardToGiveHP}</p>
                                            <p> Attack Type : {response.data[i].cardToGiveAN} </p>
                                        </div>
                                    </div>
                                    <div className="col-2 d-flex align-items-center" style={{ margin: "20px 0px" }}>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                            <img src={require('../images/tradingArrow.png')} alt="PlayerProfile" style={{ width: "100%", height: "auto" }} />
                                        </div>
                                    </div>
                                    <div className="col-5" style={{ border: "3px solid red", margin: "20px 0px", height: "430px" }}>
                                        <div style={{ padding: "30px", display: "flex", justifyContent: "center" }}>
                                            <img src={require('../images/cards/' + ImageTwo[0])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                        </div>
                                        <div className="profileDetail" style={{ paddingLeft: "10px" }}>
                                            <p> Card ID : {response.data[i].cardToReceiveID}</p>
                                            <p> Card Name : {response.data[i].cardToReceiveName}</p>
                                            <p> Hit Points : {response.data[i].cardToReceiveHP}</p>
                                            <p> Attack Type : {response.data[i].cardToReceiveAN} </p>
                                        </div>
                                    </div>
                                    <div className='col-12 d-flex justify-content-center my-2'>
                                        <button style={buttonStyleAccept} className='mx-2' onClick={() => acceptTrading(CG, TOID, CR)}> Trading Accept </button>
                                        <button style={buttonStyleReject} className='mx-2' onClick={() => rejectTrading(CG, CR)}> Trading Reject </button>
                                    </div>
                                </div>
                            </div>



                        )
                    }
                    setTRList(everyTradeReq);
                    setTRLoaded(true);
                }
                else {
                    setTRList(<h3> There is no trade request </h3>);
                    setTRLoaded(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const acceptTrading = (cardToGiveID, tradeOffererID, cardToReceiveID) => {
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


                        })
                        .catch(function (error) {
                            console.log(error);
                            //acceptResult.innerHTML = error
                        })

                    // acceptResult.innerHTML = `<h4> The trading SUCCESS! </h4>`

                }
                else {
                    setAcceptResult("Trading unexpectedly fail! as there is no affected rows");
                    togglePopup();
                    //acceptResult.innerHTML = `<h4> Trading unexpectedly fail! as there is no affected rows </h4>`
                }

            })
            .then(() => {
                //showRequest.innerHTML = ``;
            })
            .catch(function (error) {
                console.log(error);
                //acceptResult.innerHTML = error;
            })
    }

    const rejectTrading = (cardToGiveID, cardToReceiveID) => {
        //change the trading status into rejected. 
        axios.put(API_URL + '/api/tradingRoute/changeTradingStatus', {
            "cardToGiveID": cardToGiveID,
            "cardToReceiveID": cardToReceiveID,
            "result": "rejected"
        })
            .then((response) => {
                console.log("Reject Trading function!")
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
                setAcceptResult("You successfully REJECTED the trading request")
                togglePopup();
                //acceptResult.innerHTML = `<h3  style="background-color: rgba(0, 0, 0, 0.593); padding: 10px 30px; color: white; font-weight: bolder;"> Trading Rejected Successfully. LOADING ....  </h3> `
                //showRequest.innerHTML = ``;
            })
            // .then(() => {
            //     setTimeout(function () {
            //         location.reload();
            //     }, 3000);
            // })
            .catch(function (error) {
                console.log(error);
                //acceptResult.innerHTML = error
            })
    }

    const sideTradingReqDelete = (cardToGiveID, cardToReceiveID) => {
        axios.delete(API_URL + '/api/tradingRoute/sideTradingReqDelete', {
            data: {
                "cardToGiveID": cardToGiveID,
                "cardToReceiveID": cardToReceiveID
            }
        })
            .then(() => {
                setAcceptResult("You successfully ACCEPTED the trading request. Related requests got deleted.")
                togglePopup();
                //acceptResult.innerHTML = `<h3  style="background-color: rgba(0, 0, 0, 0.593); padding: 10px 30px; color: white; font-weight: bolder;"> Trading Accepted Successfully. Hold on for a second... </h3> `

            })
            .then((response) => {
                console.log(response);
                console.log("Side Trading Req are successfully deleted!");
            })

            // .then(() => {
            //     setTimeout(function () {
            //         location.reload();
            //     }, 3000);
            // })
            .catch(function (error) {
                console.log(error);
                console.log("Deleting Side Trading Req failed!");
            })
        //acceptResult.innerHTML = `<h4> The trading SUCCESS! Line successfully deleted!</h4>`
    }

    const textStyle = {
        color: "gold",
        fontWeight: "bold",
        fontSize: "22px",
    }

    const buttonStyleAccept = {
        margin: "5px",
        padding: "8px 20px",
        backgroundColor: 'rgb(46, 255, 0)', // Set the background color of the button
        color: 'black', // Set the text color of the button
        border: '2px solid black', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };

    const buttonStyleReject = {
        margin: "5px",
        padding: "8px 20px",
        backgroundColor: 'rgb(240, 0, 0) ', // Set the background color of the button
        color: 'black', // Set the text color of the button
        border: '2px solid black', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };


    return (
        <div>
            <div className="FriReqListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                {TRLoaded ? TRList : <p >Loading...</p>}</div>

            {isPopupOpen && (
                <div className="popup-overlay">
                    <style>
                        {`
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  
                  .popup {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                  
                  .popup-content {
                    text-align: center;
                  }
                  
                  .popup h2 {
                    margin-top: 0;
                  }
                  
                  .popup button {
                    margin-top: 10px;
                  }
                  
                
                `}
                    </style>
                    <div className="popup">
                        <div className="popup-content" style={{ width: "300px" }}>
                            <h2 style={{ color: 'black', marginBottom: '20px' }}>Friend Request</h2>
                            <p>{acceptResult}</p>
                            <button onClick={togglePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default FRComponent; 