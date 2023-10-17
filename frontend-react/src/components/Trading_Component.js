import React, { useEffect } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios
import { ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';

import '../css/trading.css';
import 'bootstrap/dist/css/bootstrap.css';


let myCard = []
let myFriCard = []
let mySelectedCard = []
let myFriSelectedCard = []
const playerID = localStorage.getItem('player_id');
const friendID = localStorage.getItem('FriendID');
const PLAYERIDTEMP = localStorage.getItem('player_id');

var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';

const TradingComponent = () => {
    const navigate = useNavigate();
    const [divElements, setDivElements] = useState([]);
    const [divFriElements, setDivFriElements] = useState([]);
    const [divSelected, setDivSelected] = useState([]);
    const [divFriSelected, setDivFriSelected] = useState([]);
    const [TradingStatus, setTradingStatus] = useState([]);
    const [TCLoaded, setTCLoaded] = useState(false);
    const [TCFriLoaded, setTCFriLoaded] = useState(false);

    const [popupText, setPopupText] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [buttonClicked, setButtonClicked] = useState(false);

    useEffect(() => {
        printOutPlayerCards();
        console.log("printing out all the cards");
    }, [])

    const togglePopup = () => {
        console.log('popup screen yay');
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.reload();
        }

    };

    const handleCardSelection = (cardId, state) => {
        console.log(cardId);
        // Add your logic for handling the card selection here
        axios.get(`${API_URL}/api/cardRoute/${(cardId)}`)
            .then((response) => {
                mySelectedCard = [];


                var myArray = [response.data[0].card_image];
                var attack = "";
                console.log(response.data[0].attack_name)
                for (var j = 0; j < response.data[0].attack_name.length; j++) {
                    attack += response.data[0].attack_name[j];
                    if (j < response.data[0].attack_name.length - 1) {
                        attack += ", "
                    }
                }

                mySelectedCard.push(
                    <div className="container" style={{ backgroundColor: "rgb(255, 249, 161)", border: "4px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", width: "220px", height: "450px", color: "black", margin: "100px 0px" }}  >
                        <div className="row align-items-center p-1">

                            <p>Card Name: {response.data[0].creature_name} </p>
                            <div className="" style={{}}>
                                <img src={require('../images/cards/' + myArray[0])} alt="PlayerProfile" style={{ width: "180px", height: "180px", margin: "5px 0px" }} />
                            </div>
                            <div>
                                <p>Card ID : {response.data[0].card_id} </p>
                                <p> Hit Points : {response.data[0].hit_points} </p>
                                <p> Attack Type : {attack} </p>
                            </div>

                        </div>
                    </div>
                )
                console.log(response.data[0])

                if (state == "player") {
                    localStorage.setItem('toBeTheirs', response.data[0].card_id);
                    localStorage.setItem('toBeTheirsHP', response.data[0].hit_points)
                    setDivSelected(mySelectedCard);
                }
                else {
                    localStorage.setItem('toBeMine', response.data[0].card_id);
                    localStorage.setItem('toBeMineHP', response.data[0].hit_points);
                    setDivFriSelected(mySelectedCard);
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    };


    const printOutPlayerCards = () => {
        axios.get(`${API_URL}/api/tradingRoute/cardtrading/${(playerID)}`)
            .then((response) => {
                myCard = [];
                for (var i = 0; i < response.data.length; i++) {

                    var myArray = [response.data[i].card_image];
                    const cardId = response.data[i].card_id;

                    myCard.push(
                        <div className="container" style={{ backgroundColor: "rgb(255, 249, 161)", margin: "25px", border: "4px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", width: "220px", height: "450px", color: "black", display: "grid", gridTemplateRows: "1fr auto" }}>
                            <div>
                                <p>Card Name: {response.data[i].creature_name}</p>
                                <div className="" style={{}}>
                                    <img src={require('../images/cards/' + myArray[0])} alt="PlayerProfile" style={{ width: "180px", height: "180px", margin: "5px 0px" }} />
                                </div>
                                <div>
                                    <p>Card ID: {response.data[i].card_id}</p>
                                    <p>Hit Points: {response.data[i].hit_points}</p>
                                    <p>Attack Type: {response.data[i].attack_names}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <button style={{ width: "100%", margin: "10px 0px" }} onClick={() => handleCardSelection(cardId, "player")}>Choose</button>
                            </div>
                        </div>
                    )
                    //console.log(response.data[i])

                }
                setDivElements(myCard);
                setTCLoaded(true);
            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get(`${API_URL}/api/tradingRoute/cardtrading/${(playerID)}/${(friendID)}`)
            .then((response) => {
                myFriCard = [];
                for (var i = 0; i < response.data.length; i++) {

                    var myArray = [response.data[i].card_image];
                    const friCardId = response.data[i].card_id;

                    myFriCard.push(
                        <div className="container" style={{ backgroundColor: "rgb(255, 249, 161)", margin: "25px", border: "4px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", width: "220px", height: "450px", color: "black", display: "grid", gridTemplateRows: "1fr auto" }}>
                            <div>
                                <p>Card Name: {response.data[i].creature_name}</p>
                                <div className="" style={{}}>
                                    <img src={require('../images/cards/' + myArray[0])} alt="PlayerProfile" style={{ width: "180px", height: "180px", margin: "5px 0px" }} />
                                </div>
                                <div>
                                    <p>Card ID: {response.data[i].card_id}</p>
                                    <p>Hit Points: {response.data[i].hit_points}</p>
                                    <p>Attack Type: {response.data[i].attack_names}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <button style={{ width: "100%", margin: "10px 0px" }} onClick={() => handleCardSelection(friCardId, "friend")}>Choose</button>
                            </div>
                        </div>
                    )
                    //console.log(response.data[i])

                }
                setDivFriElements(myFriCard);
                setTCFriLoaded(true);
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    const tradeSave = () => {
        if (!buttonClicked) {
            setButtonClicked(true);
            let PlayerID = localStorage.getItem('player_id');
            let FriendID = localStorage.getItem('FriendID');
            let toBeMine = localStorage.getItem('toBeMine');
            let toBeTheirs = localStorage.getItem('toBeTheirs');

            if (divSelected.length === 0 || divFriSelected.length == 0) {
                //if (toBeMine === null || toBeTheirs === null) {
                setPopupText("Please Select Card First");
                setTradingStatus(
                    [<div className='tradingStatus' style={{ color: "red", textAlign: "center", fontSize: "50px", border: "3px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", backgroundColor: "rgba(0, 0, 0, 0.8) ", margin: "10px", padding: "10px" }}>
                        <h4> Please Select Card First</h4>
                    </div>]
                )
                //TradingStatus.innerHTML = `<h4> Please Select Card First</h4>`
                togglePopup();
            }

            else {

                if (FriendID == 38) {
                    tradeAccept(PlayerID, 38, toBeTheirs, toBeMine);
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
                                setPopupText("You have already sent the trade request. Choose another card.")
                                setTradingStatus([
                                    <div className='tradingStatus' style={{ color: "red", textAlign: "center", fontSize: "50px", border: "3px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", backgroundColor: "rgba(0, 0, 0, 0.8) ", margin: "10px", padding: "10px" }}>
                                        <h4>You have already sent the trade request. Choose another card.</h4>
                                    </div>])
                                TradingStatus.innerHTML = `<h4>You have already sent the trade request. Choose another card.</h4>`
                                togglePopup();
                            }
                            else {

                                axios.post(API_URL + '/api/tradingRoute/tradeButton', {
                                    "playerID": PlayerID,
                                    "friendID": FriendID,
                                    "toBeMine": toBeMine,
                                    "toBeTheirs": toBeTheirs
                                })
                                    .then(() => {
                                        localStorage.removeItem("toBeMine");
                                        localStorage.removeItem("toBeTheirs");
                                    })
                                    .then(() => {
                                        navigate('/RTradingSuccessTransition')
                                    })

                            }
                        })

                        .catch(function (error) {
                            console.log(error);
                        })
                }



            }
        }

    }

    const tradeAccept = (playerIDTemp, friendIDTemp, myCard, theirCard) => {
        let toBeMineHP = localStorage.getItem('toBeMineHP');
        let toBeTheirsHP = localStorage.getItem('toBeTheirsHP');

        console.log(playerIDTemp, friendIDTemp, myCard, theirCard, "fuck I am abt to cry");

        if (toBeTheirsHP >= toBeMineHP) {
            axios.put(REACT_URL + '/api/tradingRoute/tradingAccept/' + friendIDTemp, {
                "tradeOffererID": playerIDTemp,
                // "playerid": friendIDTemp,
                "cardToGiveID": theirCard,
                "cardToReceiveID": myCard
            })
                .then((response) => {
                    // setPopupText("Thank you so much for sending friend request to our bot. Your request is accepted automatically.")
                    // togglePopup();
                    console.log(response.data, "bot successfully accept the trade request")


                })
                .then(() => {
                    sideTradingReqDelete(theirCard, myCard);
                })

                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            setPopupText("Thankyou so much for trading with bot. But your attempt is unsuccessful as your card hitpoint is lower than the bot hitpoint.")
            togglePopup();
        }


    }

    const sideTradingReqDelete = (cardToGiveID, cardToReceiveID) => {
        axios.delete(API_URL + '/api/tradingRoute/sideTradingReqDelete', {
            data: {
                "cardToGiveID": cardToGiveID,
                "cardToReceiveID": cardToReceiveID
            }
        })
            // .then(() => {
            //     //setAcceptResult("You successfully ACCEPTED the trading request. Related requests got deleted.")
            //     //togglePopup();
            // })
            .then((response) => {
                console.log(response);
                console.log("Side Trading Req are successfully deleted!");
                setPopupText("Thankyou so much for trading with bot. Your request has been accepted automatically!")
                togglePopup();
            })
            .then(() => {
                localStorage.removeItem("toBeMine");
                localStorage.removeItem("toBeTheirs");
            })
            .catch(function (error) {
                console.log(error);
                console.log("Deleting Side Trading Req failed!");
            })
    }

    return (

        <div >

            <div>
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
                                <h2>Friend Request</h2>
                                <p>{popupText}</p>
                                <button onClick={togglePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {TradingStatus}
                <div className="row">
                    <div className="col-md-9">
                        <div style={{ width: '100%', height: "200vh", display: "flex", flexDirection: "column" }}>
                            <div style={{ flex: "1", display: "flex", backgroundColor: "rgba(0, 0, 0, 0.7) ", padding: "5px 0px 50px 0px", flexDirection: "column", overflow: "hidden" }}>
                                <h2 style={{ padding: "15px 20px", textAlign: "center", color: "white" }}>Choose Your Card for Trading </h2>
                                <div style={{ flex: "1", overflowY: "auto", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                    <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                        {TCLoaded ? divElements : <p >Loading...</p>}</div>
                                </div>

                            </div>
                            <div style={{ height: "50px" }}> </div>
                            <div style={{ flex: "1", display: "flex", backgroundColor: "rgba(0, 0, 0, 0.7) ", padding: "5px 0px 50px 0px", flexDirection: "column", overflow: "hidden" }}>
                                <h2 style={{ padding: "15px 20px", textAlign: "center", color: "white" }}>Choose Your Friend's Card for Trading </h2>
                                <div style={{ flex: "1", overflowY: "auto", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                    <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                        {TCFriLoaded ? divFriElements : <p >Loading...</p>}</div>

                                </div>

                            </div>


                        </div>
                    </div>
                    <div className="col-md-3">
                        <div style={{ width: '100%', height: "200vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                            <div style={{ flex: "1", backgroundColor: "rgba(0, 0, 0, 0.7)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <h2 style={{ textAlign: "center", color: "white", paddingTop: "20px" }}> Your Card </h2>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                    {divSelected}
                                </div>
                            </div>

                            <div style={{ height: "50px" }}> </div>
                            <div style={{ flex: "1", backgroundColor: "rgba(0, 0, 0, 0.7)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <h2 style={{ textAlign: "center", color: "white", paddingTop: "20px" }}> Friend's Card </h2>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                    {divFriSelected}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div>

                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <button onClick={() => { tradeSave() }} style={{ height: "50px", marginBottom: "30px", width: "90%", }}>Trade</button>
                    </div>

                </div>
                {TradingStatus}
            </div>
        </div>
    )
}

export default TradingComponent; 