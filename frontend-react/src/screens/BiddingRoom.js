import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import MysteryBox from '../images/MysteryBox.png';
import fullBG from '../images/BidBGBig.jpg';
import smallBG from '../images/Bidding.png';
import goldLogo from '../images/bootstrapGoldLogo.png'
import Countdown from '../images/TimerCover.jpg'
import CurrentBetNumber from '../images/CurrentBetNumber.jpg'

const playerID = localStorage.getItem('player_id');
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentDateGMT = new Date();
//if u want legit current, need to +1 
const currentMonthGMT = currentDateGMT.getUTCMonth();
const currentYearGMT = currentDateGMT.getUTCFullYear();

const bettingEndDate = new Date(`${Months[currentMonthGMT]} 18, ${currentYearGMT} 18:00:00 GMT`);

const YourComponent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [MaxTicket, setMaxTicket] = useState(0);
    const [currentBet, setCurrentBet] = useState(0);
    const [number, setNumber] = useState(0);

    const [currentGold, setCurrentGold] = useState(0);
    const [goldNotEnough, setgoldNotEnough] = useState(false);
    const [avatar, setAvatar] = useState([0, "MunknownAvatar.png"]);
    const [name, setName] = useState("Player Name");
    const [countdown, setCountdown] = useState(["99", "99", "99"]);

    const [finalPopup, setFinalPopup] = useState(false);


    const currentDateGMT = new Date();
    //if u want legit current, need to +1 
    const currentMonthGMT = currentDateGMT.getUTCMonth() - 1;
    const currentYearGMT = currentDateGMT.getUTCFullYear();

    if (currentMonthGMT == 11) {
        var tempCurrentMonthGMT = 0;
        var tempCurrentYearGMT = currentYearGMT + 1;
    }
    else {
        var tempCurrentMonthGMT = currentMonthGMT + 1;
        var tempCurrentYearGMT = currentYearGMT;
    }



    useEffect(() => {
        PALoaded(playerID);
        // tradingReqCount(playerID);
        // goldCheck(playerID);
        const calculateCountdown = () => {
            let targetDateTime = bettingEndDate;
            let currentTime = new Date();
            const timeDifference = targetDateTime - currentTime;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                const hours = (Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + (24 * days)).toString().padStart(2, '0');
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

                setCountdown([hours, minutes, seconds]);
            } else {
                setCountdown(["00", "00", "00"]);
            }
        }
        const timer = setInterval(calculateCountdown, 1000);

        return () => {
            clearInterval(timer);
        };

    }, []);

    const togglePopup = () => {
        console.log('popup screen yay');
        setIsPopupOpen(!isPopupOpen);
        if (finalPopup == true) {
            window.location.reload();
        }

    };

    const PALoaded = (playerID) => {
        const goldCheckPA = axios.post(REACT_URL + "/api/blackRoomRoute/playerInfoBasic/" + playerID);
        const tradingReqCountPA = axios.post(REACT_URL + '/api/blackRoomRoute/check/' + playerID, {
            "month": tempCurrentMonthGMT,
            "year": tempCurrentYearGMT
        });
        const playerAvatar = axios.post(REACT_URL + "/api/blackRoomRoute/playerAvatar/" + playerID);

        Promise.all([goldCheckPA, tradingReqCountPA, playerAvatar])
            .then(([response1, response2, response3]) => {
                console.log('Response from goldChangePA:', response1.data);
                console.log(response1.data[0].gold, "response1.data[0].gold")
                if (response1.data[0].gold < 10) {
                    setgoldNotEnough(true);
                }
                else {
                    setgoldNotEnough(false);

                }
                setCurrentGold(response1.data[0].gold);
                console.log('Response from tradingReqCountPA:', response2.data);

                setCurrentBet(response2.data[0].betToken);
                setMaxTicket(response2.data[0].receivedToken);

                var myArray = response3.data[0].image_path.split("/images/");
                setAvatar(myArray);
                setName(response3.data[0].player_username);
                console.log(avatar, "avatar")
            })
            .catch((error) => {
                console.log("PA error", error);
            })
    }

    const handleDecrease = () => {
        if (number > 0) {
            setNumber((prevNumber) => prevNumber - 1);
        }
    };

    const handleIncrease = () => {
        if (number < MaxTicket) {
            setNumber((prevNumber) => prevNumber + 1);
        }
    }


    const goldCheck = (playerID) => {
        axios.post(REACT_URL + "/api/blackRoomRoute/playerInfoBasic/" + playerID)
            .then((response) => {
                console.log(response.data);
                //currentGold = response.data[0].gold;
                if (response.data[0].gold < 10) {
                    setgoldNotEnough(true);
                }
                else {
                    setgoldNotEnough(false);
                }
            })

    }

    const confirmChange = () => {

        const useGold = axios.put(REACT_URL + '/api/blackRoomRoute/useGold/' + playerID, {
            "gold": currentGold - 10
        })

        const setBet = axios.put(REACT_URL + '/api/blackRoomRoute/setBet/' + playerID, {
            "month": tempCurrentMonthGMT,
            "year": tempCurrentYearGMT,
            "betToken": number
        })

        Promise.all([useGold, setBet])
            .then(([response1, response2]) => {
                setFinalPopup(true);
                console.log(response1.data, "response from useGold");
                console.log(response2.data, "response from setBet");
            })
            .catch((error) => {
                console.log(error, "PA confirmChange error")
            })

        // axios.put(REACT_URL + '/api/blackRoomRoute/useGold/' + playerID, {
        //     "gold": currentGold - 10
        // })
        //     .then((response) => {
        //         console.log(response.data);
        //         console.log("gold updated!")
        //     })
        //     .then(() => {
        //         setFinalPopup(true);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })


    }

    const mainContainerStyle = {
        height: '100vh',
        background: `url(${fullBG}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column', // Change flex direction to column
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    };

    const rowStyle = {
        width: '100%',
        height: '550px',
        display: 'flex',
        padding: "40px 80px",
        backgroundColor: 'rgb(53, 186, 255)'
    };



    const redBackgroundStyle = {
        flex: '4', // Takes 3/12 columns (25% of the row width)
        // background: 'red',
        display: 'flex', // Add flex display to arrange div1 and div2 in a row
        justifyContent: 'space-between', // To evenly space div1 and div2
        position: "relative",
        padding: "0px 30px"
    };

    const playerShowBox = {
        height: '32px',
        backgroundColor: 'black',
        color: "gold",
        display: "flex",
        alignItems: "center",
        border: "3px solid gold",
        borderRadius: "30px",
    };

    const goldShowBox = {
        height: '32px',
        backgroundColor: 'black',
        color: "gold",
        display: "flex",
        alignItems: "center",
        border: "3px solid gold",
        borderRadius: "30px",
    };

    const playerAvatarStyle = {
        width: '100px', // Set the width of the image to 50% of its container
        height: 'auto', // Maintain the aspect ratio of the image
        marginLeft: '-40px',
        paddingBottom: "15px"
    };

    const goldSymbolStyle = {
        margin: "0px 15px",
        width: '30px', // Set the width of the image to 50% of its container
        height: 'auto', // Maintain the aspect ratio of the image
    };

    const playerNameStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        paddingRight: "25px",
        paddingBottom: "2px"
    };

    const goldAmountStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        paddingRight: "25px",
        paddingBottom: "2px"
    };


    const imageContainerStyle = {
        flex: '8', // Takes 9/12 columns (75% of the row width)
        display: 'flex',
        justifyContent: 'center', // Horizontally center the content
        alignItems: 'center',
        position: 'relative'
    };

    const imageStyle = {
        height: '100%', // To make sure the image resizes within the container while maintaining aspect ratio
        border: '8px solid gold', // Add a 3px red border
        borderRadius: '30px', // Add rounded corners (adjust the value as needed)
    };

    const TimerStyle = {
        width: '100%',
        height: '150px',
        backgroundImage: `url(${Countdown})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: 'absolute',
        bottom: 267,
        left: 0,
        color: "white",
        border: '3px solid red', // Add a 3px red border
        borderRadius: '20px'
    };

    const currentBetStyle = {
        width: '100%',
        height: '55px',
        backgroundImage: `url(${CurrentBetNumber})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: 'absolute',
        bottom: 0,
        left: 0,
        color: "gold",
        border: '3px solid gold', // Add a 3px red border
        borderRadius: '20px'
    }

    const gameDescription = {
        width: '100%',
        height: '190px',
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 66,
        left: 0,
        color: "gold",
        border: '3px solid gold', // Add a 3px red border
        borderRadius: '20px',
        padding: "10px"
    };


    const submitButtonStyle = {
        position: 'absolute', // Position the button relative to the container
        bottom: '50px', // Distance from the bottom (adjust as needed)
        padding: '10px 20px', // Add padding to the button (adjust as needed)
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: "3px solid gold",
        borderRadius: "30px",
        fontSize: "20px",
        fontWeight: "bold"
    };

    const leftButton = {
        position: 'absolute', // Position the button relative to the container
        bottom: '120px', // Distance from the bottom (adjust as needed)
        color: 'gold', // Set the text color of the button
        borderRadius: '15px', // Add rounded corners to the button (adjust as needed)
        width: "50px",
        height: "50px",
        paddingBottom: "7px",
        border: "3px solid gold",
        borderRadius: "30px",
        fontSize: "25px",
        fontWeight: "bold",
        backgroundColor: "black",
        left: '300px'
    };
    const rightButton = {
        position: 'absolute', // Position the button relative to the container
        bottom: '120px', // Distance from the bottom (adjust as needed)
        color: 'gold', // Set the text color of the button
        borderRadius: '15px', // Add rounded corners to the button (adjust as needed)
        width: "50px",
        height: "50px",
        paddingBottom: "7px",
        border: "3px solid gold",
        borderRadius: "30px",
        fontSize: "25px",
        fontWeight: "bold",
        right: "300px",
        backgroundColor: "black"
    };

    const numberDisplay = {
        position: 'absolute', // Position the button relative to the container
        bottom: '120px', // Distance from the bottom (adjust as needed)
        color: 'gold', // Set the text color of the button
        width: "50px",
        height: "50px",
        fontSize: "25px",
        fontWeight: "bold",
        left: "430px",
    }

    const maxNumStyle = {
        position: 'absolute', // Position the button relative to the container
        top: '10px', // Distance from the bottom (adjust as needed)
        color: 'white', // Set the text color of the button
        width: "500px",
        height: "50px",
        fontSize: "25px",
        fontWeight: "bold",
        left: "200px",
    }


    const disabledButtonStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Set the background color for disabled buttons
        color: "rgba(0, 0, 0, 0.4)",
        border: "3px solid rgba(0, 0, 0, 0.4)"
    };

    const disabledSubmitButtonStyle = {
        position: 'absolute', // Position the button relative to the container
        bottom: '50px', // Distance from the bottom (adjust as needed)
        padding: '10px 20px', // Add padding to the button (adjust as needed)
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Set the background color for disabled buttons
        color: "rgba(0, 0, 0, 0.6)",
        borderRadius: '5px', // Add rounded corners to the button (adjust as needed)
        border: "3px solid rgba(0, 0, 0, 0.6)",
        borderRadius: "30px",
        fontSize: "20px",
        fontWeight: "bold"
    };

    const HeadingText = {
        color: "gold",
        fontWeight: "bold"
    }

    const backButtonStyle = {
        position: 'absolute', // Position the button relative to the container
        top: '20px', // Distance from the top (adjust as needed)
        left: '20px', // Distance from the left (adjust as needed)
        padding: "3px 25px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '3px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };

    const cardButtonStyle = {
        position: 'absolute',
        top: '20px',
        right: '50px',
        padding: "5px",
        backgroundColor: "black",
        border: '3px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px',
    }

    const cardButtonTextStyle = {
        position: 'absolute',
        top: '80px',
        right: '35px',
        color: "gold"
    }


    const popupStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: isPopupOpen ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Ensure the popup appears on top of everything else
    };

    const navigateTo = () => {
        window.location.href = '/RBlindTrade'
    }

    return (
        <div className="Main" style={mainContainerStyle}>
            <style>
                {`
                .Main::-webkit-scrollbar {
                    width: 0;
                    height: 0;
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
            {isPopupOpen && (
                <div style={popupStyle}>

                    <div className="popup">

                        <div className="popup-content" style={{ width: "300px", color: "black" }}>
                            <div className={finalPopup ? "d-none" : ""}>
                                <h2>Bidding Room</h2>
                                <p>Are you sure you want to use 10 gold to change your ticket number</p>
                                <button onClick={confirmChange} style={{ margin: "5px" }}>Yes</button>
                                <button onClick={togglePopup} style={{ margin: "5px" }}>No</button>
                                {/* <button onClick={togglePopup}>Close</button> */}
                            </div>
                            <div className={finalPopup ? "" : "d-none"}>
                                <h2>Bidding Room</h2>
                                <p>Your ticket number successfully changed!</p>
                                <button onClick={togglePopup}>Close</button>
                                {/* <button onClick={togglePopup}>Close</button> */}
                            </div>

                        </div>
                    </div>
                </div>
            )
            }
            <button style={backButtonStyle} onClick={() => { navigateTo() }}> Back </button>
            <button style={cardButtonStyle} onClick={() => { window.location.href = '/RbiddingResult' }}>
                <img src={require("../images/gif/cardGlowing.gif")} alt="Loading..." style={{ width: "45px", }} />
            </button>
            <div style={cardButtonTextStyle}>Card in Box</div>
            <div>
                <h1 style={HeadingText}>Bet The Number</h1>
            </div>
            <div style={rowStyle}>
                <div style={redBackgroundStyle}>
                    <div style={playerShowBox}>
                        <img src={require('../images/' + avatar[1])} alt="Your Avatar" style={playerAvatarStyle} />
                        <div style={playerNameStyle}>{name}</div>
                    </div>
                    <div style={goldShowBox}>
                        <img src={goldLogo} alt="Gold Logo" style={goldSymbolStyle} />
                        <div style={goldAmountStyle}>Gold : {currentGold}</div>
                    </div>

                    <div style={TimerStyle}>
                        <h1 className="text-center" style={{ fontSize: "45px", padding: "65px 0px 0px 18px ", letterSpacing: "35px" }}>
                            {countdown[0]} {countdown[1]}  {countdown[2]}
                        </h1>
                    </div>

                    <div style={gameDescription}>
                        <h1 style={{ fontSize: "21px", fontFamily: 'inherit', textAlign: "center", fontWeight: "bold", letterSpacing: "2px" }}> "Bet the Number" - Game Description </h1>
                        <p> The higher the number, the better percentage of winning the card. If you can bet on the correct number in the box, you will receive an epic card. The highest number you can bet for will be depending on your trading requests that got accepted. So be humble and offer good trades to your friends ;D</p>
                    </div>

                    <div style={currentBetStyle} >
                        <h1 style={{ fontSize: "20px", padding: "12px 20px", fontFamily: 'inherit', textAlign: "right" }}>
                            You are currently betting for the Number : {currentBet}
                        </h1>
                    </div>

                </div>
                <div style={imageContainerStyle}>
                    <img src={smallBG} alt='SmallScreen' style={imageStyle} />
                    <h2 style={maxNumStyle}> The Maximum number you can bet : {MaxTicket}</h2>
                    <button
                        style={{
                            ...leftButton,
                            ...(number === 0 ? disabledButtonStyle : {}), // Add disabled style when number is 0
                        }}
                        onClick={handleDecrease}
                        disabled={number === 0}
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="number-display" style={numberDisplay}>{number}</div>

                    <button
                        style={{
                            ...rightButton,
                            ...(number >= MaxTicket ? disabledButtonStyle : {}), // Add disabled style when number is >= MaxTicket
                        }}
                        onClick={handleIncrease}
                        disabled={number >= MaxTicket}
                    >
                        <FaArrowRight />
                    </button>

                    <button onClick={togglePopup}
                        style={{
                            ...submitButtonStyle,
                            ...(number === 0 || number == currentBet || goldNotEnough == true ? disabledSubmitButtonStyle : {})
                        }}
                        disabled={number === 0 || number == currentBet || goldNotEnough == true}>
                        <i class="bi-cash-coin" style={{ margin: "0px 5px", fontSize: "25px" }}></i> 10   /Submit
                    </button>

                </div>
            </div>

            {/* 
            <h2> Player Gold : {currentGold} </h2>
                <h2> number : {number}</h2>
                <h2> Received Tickets : {MaxTicket} </h2>
                <p>Current Month Index: {currentMonthGMT}</p>
                <p>Current Year Index: {currentYearGMT}</p>
                <div >
                    <img src={MysteryBox} alt="Friends Badge" style={{ width: "300px" }} />
                </div>

                <div>
                    <div className="number-display">{number}</div>

                    <button onClick={handleDecrease} disabled={number === 0}>
                        Left
                    </button>
                    <button onClick={handleIncrease} disabled={number >= MaxTicket}>Right</button>
                </div>
                <div>
                    <button onClick={togglePopup} disabled={number === 0 || number == currentBet || goldNotEnough == true}> Submit </button>
                </div> 
                */}



        </div >
    );
};

export default YourComponent;
