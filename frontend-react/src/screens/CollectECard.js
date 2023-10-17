import React, { useEffect, useState } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios
import BoxAnimation from '../images/gif/boxOpen.gif';
import BoxAnimationStay from '../images/gif/boxOpenStay.jpg';
import BlueBG from '../images/gif/blueBG.gif';

import 'bootstrap/dist/css/bootstrap.css';

const playerID = localStorage.getItem('player_id');
var REACT_URL = 'https://monster-cat-world.onrender.com'
const API_URL = 'https://monster-cat-world.onrender.com';

const CollectECard = () => {
    const [popupText, setPopupText] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [gifSrc, setGifSrc] = useState(BoxAnimation);
    const [win, setWin] = useState(false);

    const currentDateGMT = new Date();
    //if u want legit current, need to +1 
    const currentMonthGMT = currentDateGMT.getUTCMonth();
    const currentYearGMT = currentDateGMT.getUTCFullYear();

    var tempCID = 0;

    useEffect(() => {
        startPoint(playerID);

        const timer = setTimeout(() => {
            setGifSrc(BoxAnimationStay); // Replace with the path to a blank image
            //togglePopup();
        }, 3500); // 5000 milliseconds (5 seconds)

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const startPoint = (playerID) => {
        axios.post(`${REACT_URL}/api/blackRoomRoute/check/${(playerID)}`, {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })
            .then((response) => {
                if (response.data[0].collectCheck == 0) {
                    winOrNotCheck(playerID);
                }
                else {
                    window.location.href = '/RBiddingResult'
                }
            })
    }

    const winOrNotCheck = (playerID) => {

        const luckyNumberCheck = axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkingEC", {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })

        const betNumberCheck = axios.post(`${REACT_URL}/api/blackRoomRoute/check/${(playerID)}`, {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })

        Promise.all([luckyNumberCheck, betNumberCheck])
            .then(([responseLuckyNumberCheck, responseBetNumberCheck]) => {
                console.log(responseLuckyNumberCheck, "responseluckyNumberCheck");
                console.log(responseBetNumberCheck, "responseBetNumberCheck");
                if (responseLuckyNumberCheck.data[0].luckyNumber == responseBetNumberCheck.data[0].betToken) {
                    //setWin(true);
                    setPopupText("Congratulations, You have bid on the correct number. We have already sent the epic card into your card collection >< ")
                    var ecID = responseLuckyNumberCheck.data[0].card_id;
                    var cardDetail = [responseLuckyNumberCheck.data[0].creature_name, responseLuckyNumberCheck.data[0].hit_points, responseLuckyNumberCheck.data[0].price, responseLuckyNumberCheck.data[0].creature_level]
                    winForSure(playerID, ecID, cardDetail);
                }
                else {
                    setPopupText("I am so sorry. You didn't win the prize.");
                    axios.put(`${REACT_URL}/api/blackRoomRoute/updateCollectCheck/${(playerID)}`, {
                        "month": currentMonthGMT,
                        "year": currentYearGMT
                    })
                        .then((response) => {
                            console.log(response, "updated the collectCheck into 1")
                        })
                        .then(() => {
                            togglePopup();
                        })
                        .catch((error) => {
                            console.log(error, "shit guess wrong and still error")
                        })
                }
            })



            .catch((error) => {
                console.log(error);
            })
    }

    const winForSure = (playerID, ecID, cardDetail) => {
        const updateCollectCheck = axios.put(`${REACT_URL}/api/blackRoomRoute/updateCollectCheck/${(playerID)}`, {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })

        const insertToLink = axios.post(`${REACT_URL}/api/blackRoomRandomRoute/insertToLink/${(playerID)}`, {
            "epicCardID": ecID,
        })

        const insertToCard = axios.post(`${REACT_URL}/api/blackRoomRandomRoute/insertIntoCardTable`, {
            "creature_name": cardDetail[0],
            "hit_points": cardDetail[1],
            "price": cardDetail[2],
            "creature_level": cardDetail[3]
        })


        Promise.all([updateCollectCheck, insertToLink, insertToCard])
            .then(([responseUpdateCollectCheck, responseInsertToLink, responseInsertToCard]) => {
                console.log(responseUpdateCollectCheck, "RUCC");
                console.log(responseInsertToLink, "RITL");
                console.log(responseInsertToCard, "responseInsertToCard");
                console.log(responseInsertToCard.data, "responseInsertToCard.data");
                console.log(responseInsertToCard.data.insertId, "responseInsertToCard.data.insertId");

                tempCID = responseInsertToCard.data.insertId;

                axios.post(`${REACT_URL}/api/blackRoomRandomRoute/insertIntoCardCollectionTable/${(playerID)}`, {

                    "cardID": tempCID


                })
                    .then((response) => {
                        console.log(response);
                        togglePopup();
                    })

                    .catch((error) => {
                        console.log(error, 'error in then of promise.all');
                    })

            })
            // .then(() => {
            //     deleteDuplicates(playerID, tempCID);
            // })
            .catch((error) => {
                console.log(error, "error promise.all")
            })

    }

    const deleteDuplicates = (playerID, tempCID) => {
        const DDLink = axios.delete(REACT_URL + "/api/blackRoomRandomRoute/deleteDuplicateInLink/" + playerID);
        const DDCard = axios.delete(REACT_URL + "/api/blackRoomRandomRoute/deleteDuplicateInCardTable/" + tempCID);
        const DDCC = axios.delete(REACT_URL + "/api/blackRoomRandomRoute/deleteDuplicateInCardCollectionTable/" + tempCID);

        Promise.all([DDLink, DDCard, DDCC])
            .then(([responseDDLink, responseDDCard, responseDDCC]) => {
                console.log(responseDDLink, "responseDDLink");
                console.log(responseDDCard, "responseDDCard");
                console.log(responseDDCC, "responseDDCC");
            })
            .then(() => {
                togglePopup();
            })
            .catch((error) => {
                console.log(error, "error delete duplicates")
            })
    }

    const togglePopup = () => {
        console.log('popup screen yay');
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.href = '/RBiddingResult'
        }

    };


    const blueBGStyle = {
        backgroundImage: `url(${BlueBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    }

    return (
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
                            <h2>Bidding Result</h2>
                            <p>{popupText}</p>
                            <button onClick={togglePopup}>Next</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-center align-items-center vh-100" style={blueBGStyle} >
                <div className="text-center">
                    <img src={gifSrc} alt="Animated GIF" />

                    {/* <img
                    src={BoxAnimation}
                    alt="Your Image"
                    className="img-fluid"
                /> */}
                </div>
            </div>
        </div>
    )
}

export default CollectECard; 