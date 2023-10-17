import React, { useEffect, useState } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios

import 'bootstrap/dist/css/bootstrap.css';

import '../css/allFriends.css';


const playerID = localStorage.getItem('player_id');
var REACT_URL = 'https://monster-cat-world.onrender.com'
const API_URL = 'https://monster-cat-world.onrender.com';


const FirstTimeEntry = () => {

    var TestTicket = 0;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [aList, setAList] = useState([]);
    const [bLoaded, setBLoaded] = useState(false);


    const currentDateGMT = new Date();
    //if u want legit current, need to +1 
    const currentMonthGMT = currentDateGMT.getUTCMonth();
    const currentYearGMT = currentDateGMT.getUTCFullYear();
    //const luckyNumber = Math.floor(Math.random() * 5) + 1;

    const tempLuckyNumber = Math.random();
    if (tempLuckyNumber < 0.05) { // 5% probability
        var luckyNumber = 1;
    } else if (tempLuckyNumber < 0.15) { // 10% probability
        var luckyNumber = 2;
    } else if (tempLuckyNumber < 0.30) { // 15% probability
        var luckyNumber = 3;
    } else if (tempLuckyNumber < 0.60) { // 30% probability
        var luckyNumber = 4;
    } else { // Remaining probability, approximately 40%
        var luckyNumber = 5;
    }

    useEffect(() => {


        // Get the current month in GMT (0 to 11, where 0 represents January and 11 represents December)


        // Get the current year in GMT (e.g., 2023)


        console.log("Current Month (GMT):", currentMonthGMT); // Output: Current Month (GMT): 6 (July)
        console.log("Current Year (GMT):", currentYearGMT);
        startPoint();

    }, [])


    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.reload();
        }

    };

    const startPoint = () => {
        axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkingEC", {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })
            .then((response) => {
                console.log(response.data, "checkingEC");
                if (response.data.length == 0) {
                    checkAndInsertEC();
                }
                whenLoaded();
            })

    }

    const checkAndInsertEC = () => {

        axios.get(REACT_URL + "/api/blackRoomRandomRoute/gettingToRandomise")
            .then((response) => {
                console.log(response.data);
                //currentGold = response.data[0].gold;
                axios.post(REACT_URL + "/api/blackRoomRandomRoute/insertRandomCard", {
                    "creature_name": response.data[0].creature_name,
                    "hit_points": response.data[1].hit_points,
                    "price": response.data[2].price,
                    "creature_level": response.data[3].creature_level,
                    "month": currentMonthGMT,
                    "year": currentYearGMT,
                    "luckyNumber": luckyNumber
                })
                    .then((response) => {
                        console.log(response.data);
                    })
                    .then(() => {
                        axios.delete(REACT_URL + "/api/blackRoomRandomRoute/deleteDuplicateRECard", {
                            data: {
                                "month": currentMonthGMT,
                                "year": currentYearGMT
                            }
                        })
                            .then((response) => {
                                console.log(response.data, "delete sucessfully");
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
            })


        // axios.post(REACT_URL + '/api/blackRoomRandomRoute/setBet/' + playerID, {
        //     "month": currentMonthGMT,
        //     "year": currentYearGMT,
        //     "betToken": number
        // })
    }

    const whenLoaded = () => {
        var receiveTicket = 0;
        axios.post(API_URL + '/api/tradingRoute/tradingReqCount/' + playerID)
            .then((response) => {
                const data = response.data;
                const targetMonth = currentMonthGMT;

                const targetIndex = data.findIndex(item => item.month === targetMonth);
                console.log(`Array number for month ${targetMonth}: `, targetIndex);


                if (targetIndex == -1) {
                    var TicketValueToInsert = 0
                }
                else {
                    var TicketValueToInsert = parseInt(response.data[targetIndex].accepted_count);
                }

                console.log(TicketValueToInsert, "TicketValueToInsert")
                TestTicket = TicketValueToInsert;
            })
            .then(() => {
                console.log(TestTicket, "TestTicket")
                //10++ 
                if (TestTicket > 10) {
                    receiveTicket = 5;
                }
                //8 to 10
                else if (TestTicket >= 8) {
                    receiveTicket = 4;
                }
                //5 to 8 
                else if (TestTicket >= 5) {
                    receiveTicket = 3;
                }
                //3 to 5 
                else if (TestTicket >= 3) {
                    receiveTicket = 2;
                }
                //1 to 3 
                else if (TestTicket >= 1) {
                    receiveTicket = 1;
                }
                //Literally 0 
                else {
                    receiveTicket = 0;
                }
                //console.log("second then")
            })
            .then(() => {
                console.log(receiveTicket, "receiveTicket")
            })
            .then(() => {
                axios.post(`${REACT_URL}/api/blackRoomRoute/check/${(playerID)}`, {
                    "month": currentMonthGMT,
                    "year": currentYearGMT
                })
                    .then((response) => {
                        console.log(response.data.length, "third then");
                        if (response.data.length == 0) {
                            console.log(receiveTicket, "receiveTicket Update")
                            axios.post(REACT_URL + '/api/blackRoomRoute/FirstTimeEntryInsert/' + playerID, {
                                "receivedToken": receiveTicket,
                                "month": currentMonthGMT,
                                "year": currentYearGMT
                            })
                                .then((response) => {
                                    console.log(response.data, "Inserting Data");
                                })
                                .then(() => {
                                    window.location.href = '/RBiddingRoom'
                                })

                        }
                        else {
                            window.location.href = '/RBiddingRoom'
                        }
                    })

                    .then(() => {
                        axios.delete(`${REACT_URL}/api/blackRoomRoute/autoDeleteDuplicate/${(playerID)}`)
                            .then((response) => {
                                console.log(response.data, "delete duplicate");
                            })
                            .catch((error) => {
                                console.log(error, "delete duplicate error")
                            })

                    })
                    .then(() => {
                        // window.location.href = '/RBiddingRoom'
                    })

            })

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
                        <div className="popup-content" style={{ width: "350px", padding: "20px" }}>


                            <button onClick={togglePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }
            <div className="FirstEntry" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                {bLoaded ? aList : <p >Loading...</p>}</div>

        </div >
    )
}

export default FirstTimeEntry; 