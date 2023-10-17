import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

import redBlackBG from '../images/redBlackBG.jpg'
import EpicCardCoverFront from '../images/epicCardCoverFront1.png';
import EpicCardCoverBack from '../images/epicCardCoverBack1.png';
import winnersBG from '../images/winnersBG.jpg';

const playerID = localStorage.getItem('player_id');
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
let allWinners = [];


const BiddingResult = () => {

    const [cardInfo, setCardInfo] = useState(["Loading", 0, 0]);
    const [cardID, setCardID] = useState(0);
    const [attackName, setAttackName] = useState("Loading...");
    const [cardImage, setCardImage] = useState("loading");
    const [gotResult, setGotResult] = useState(false);
    const [lastDivText, setLastDivText] = useState("Loading ... ");

    const [SPList, setSPList] = useState([]);
    const [SPLoaded, setSPLoaded] = useState(false);

    const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentDateGMT = new Date();
    //if u want legit current, need to +1 
    const currentMonthGMT = currentDateGMT.getUTCMonth();
    const currentYearGMT = currentDateGMT.getUTCFullYear();

    const ResultDate = new Date(`${Months[currentMonthGMT]} 20, ${currentYearGMT} 15:00:00 GMT`);

    useEffect(() => {

        getTheCardInfo();
    }, [])

    useEffect(() => {
        if (currentDateGMT > ResultDate) {
            //current Date is after ResultDate 
            //window.location.href = '/RBlindTrade'
            setGotResult(true);
            getPlayersInfo();
            forLastResultDiv();
        }
        getExtraInfo();
    }, [cardInfo])

    const ToNavigateBruh = () => {

        if (currentDateGMT > ResultDate) {
            //current Date is after ResultDate 
            window.location.href = '/RBlindTrade'
            setGotResult(true);
        }
        else {
            window.history.back();
        }


    }

    const getTheCardInfo = () => {

        axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkingEC", {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })

            .then((response) => {
                console.log(response.data, "checkingEC");
                if (response.data.length == 0) {
                    window.location.href = '/RBlindTrade'
                }
                else {
                    setCardInfo([response.data[0].creature_name, response.data[0].hit_points, response.data[0].creature_level])
                    setCardID(response.data[0].card_id);
                    /*
                    axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkAttack", {
                        "creature_name": response.data[0].creature_name
                    })
                        .then((response) => {

                            console.log(response.data, "response");
                            setAttackName(`${response.data[0].attack_name}`);

                        })

                    axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkImage", {
                        "creature_name": response.data[0].creature_name
                    })
                        .then((response) => {

                            console.log(response.data, "response image");
                            var myArray = response.data[0].card_image.split(".");
                            console.log(myArray);
                            setCardImage(myArray[0]);

                        })
                    */
                }
            })
            /*
            .then(() => {
                const attackP = axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkAttack", {
                    "creature_name": creature_name
                });

                const imageP = axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkImage", {
                    "creature_name": creature_name
                });

                Promise.all([attackP, imageP])
                    .then(([attackResponse, imageResponse]) => {
                        console.log(attackResponse, "attackResponseP");
                        console.log(imageResponse, "imageResponseP")
                    })
                    .catch((error) => {
                        console.log(error, "PA error");
                    })

            })
            */
            .catch((error) => {
                console.log(error);
            })
    }

    const getExtraInfo = () => {
        console.log(cardInfo, "cardInfo")
        const attackP = axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkAttack", {
            "creature_name": cardInfo[0]
        });

        const imageP = axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkImage", {
            "creature_name": cardInfo[0]
        });

        Promise.all([attackP, imageP])
            .then(([attackResponse, imageResponse]) => {
                console.log(attackResponse, "attackResponseP");
                console.log(imageResponse, "imageResponseP")

                setAttackName(`${attackResponse.data[0].attack_name}`);

                var myArray = imageResponse.data[0].card_image.split(".");
                setCardImage(myArray[0]);

            })
            .catch((error) => {
                console.log(error, "PA error");
            })
    }

    const getPlayersInfo = () => {
        axios.post(REACT_URL + "/api/blackRoomRandomRoute/getPlayerWhoWinInfo", {
            "epicCardID": cardID
        })
            .then((response) => {
                console.log(response, "players who win");
                allWinners = [];
                if (response.data.length > 0) {

                    for (var i = 0; i < response.data.length; i++) {
                        var myArray = response.data[i].image_path.split("/images/");
                        allWinners.push(
                            <div key={response.data[i].player_id} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "30px", border: "3px solid rgb(145, 0, 207) ", width: "220px", height: "310px" }}  >
                                <div className="row align-items-center p-1">

                                    <div className="" style={{ padding: "30px" }}>
                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                    </div>
                                    <div className=" profileDetail">
                                        <p> ID : {response.data[i].player_id}</p>
                                        <p>Name : {response.data[i].player_username}</p>

                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
                else {
                    allWinners.push(<div>No player won the prize</div>)
                }

                setSPList(allWinners);
                setSPLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const forLastResultDiv = () => {
        axios.post(REACT_URL + "/api/blackRoomRandomRoute/checkWinOrNotInLink/" + playerID, {
            "epicCardID": cardID
        })
            .then((response) => {
                if (response.data.length == 0) {
                    setLastDivText("Sorry you didn't manage to guess the correct number this time. Good luck for the next time.")
                }
                else {
                    setLastDivText("Congratulations! You got an epic card. The card is in your card collection now. ")
                }
            })
    }

    const backButtonStyle = {
        padding: "3px 25px",
        margin: "12px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '3px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };

    const makeCenterH = {
        display: "flex",
        justifyContent: "center",
        height: "650px"
    }
    const makeCenterH2 = {
        display: "flex",
        justifyContent: "center"
    }

    const cardShowingDiv = {
        width: "95%",
        height: "600px",
        backgroundImage: `url(${redBlackBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: '5px solid gold',
        borderRadius: '50px',
        padding: "50px 150px"
    }


    const resultDiv = {
        width: "95%",
        height: "600px",
        backgroundImage: `url(${winnersBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: '5px solid gold',
        borderRadius: '50px',
    }

    const personalResultDiv = {
        width: "95%",
        backgroundColor: "black",
        border: '5px solid gold',
        borderRadius: '50px',
        padding: "15px 30px",
        margin: "25px 0px 80px 0px",
        color: "red"
    }

    const scrollableContentStyle = {
        // Add padding to create fixed space at the top and bottom
        overflow: 'auto',   // This will add vertical scrollbar when needed
        width: "100%",
        height: "520px",
        position: 'absolute',
        top: '40px',
        bottom: '40px',
        left: 0,
        right: "20px",

    };

    const imageContainerStyle = {
        display: 'flex',
        justifyContent: 'center', // Horizontally center the content
        alignItems: 'center',
        position: 'relative',
    }

    const resultContainerStyle = {
        display: 'flex',
        justifyContent: 'center', // Horizontally center the content
        alignItems: 'center',
        position: 'relative',
        color: "white"
    }



    const EpicCardCoverFrontStyle = {
        width: "252px",
        height: "337px",
        backgroundImage: `url(${EpicCardCoverFront})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    }

    const CardBoxStyle = {
        color: "black",
        position: "absolute",
        bottom: '30px',
        paddingBottom: "7px",
        fontWeight: "bold",
        right: "90px",
        width: "300px",
        height: "175px",
        padding: "10px 15px",
    }

    const CardImageStyle = {
        position: "absolute",
        width: "230px",
        top: 85,
        right: "115px",
    }

    const CardNameStyle = {
        textAlign: "center",
        fontSize: "25px"
    }

    const CardDetailStyle = {
        textAlign: "left",
        padding: "20px 10px 0px 10px"
    }



    return (
        <div className="Main" style={{ overflow: 'scroll', height: '100vh', backgroundColor: "black" }}>
            <style>
                {`
        .Main::-webkit-scrollbar {
            width: 0;
            height: 0; 
        }
        
        `}
            </style>

            <button style={backButtonStyle} onClick={() => { ToNavigateBruh() }}> Back </button>
            <h1 style={{ color: 'gold', textAlign: "center", fontWeight: "bold", letterSpacing: "5px", padding: "0px 0px 20px 0px" }}>Epic Card for this month</h1>
            <div style={makeCenterH}>
                <div style={cardShowingDiv}>
                    <div className='row'>
                        <div className='col-5' style={imageContainerStyle}>
                            <img src={EpicCardCoverFront} style={{ width: "80%" }} />

                            <img src={require(`../images/cardsTransparent/${cardImage}.png`)} alt="CreatureImage" style={CardImageStyle} />

                            <div style={CardBoxStyle} >
                                <h2 style={CardNameStyle} > {cardInfo[0]} </h2>
                                <p style={CardDetailStyle}> Hit Points : {cardInfo[1]} <br /> Creature Level : {cardInfo[2]} <br /> Attack Name : {attackName} </p>

                            </div>

                        </div>
                        <div className='col-2' style={{ color: "white" }}> </div>
                        <div className='col-4' style={{ marginTop: "12px" }}>
                            <img src={EpicCardCoverBack} style={{ width: "100%" }} />
                        </div>
                        <div className='col-1'> </div>

                    </div>
                </div>
            </div>

            <div style={{ color: 'gold', textAlign: "center", padding: "0px 0px 20px 0px", marginTop: "100px" }}> <h1 className={gotResult ? "" : "d-none"} style={{ fontWeight: "bold", letterSpacing: "5px", }}> Players who won the card </h1> </div>


            <div style={makeCenterH} className={gotResult ? "" : "d-none"} >
                <div style={resultDiv} >
                    <div style={resultContainerStyle}>
                        <div className='Scroll' style={scrollableContentStyle}>
                            <style>
                                {`
                                .Scroll::-webkit-scrollbar {
                                    width: 0;
                                    height: 0; 
                                }
                                
                                `}
                            </style>

                            <div className="WinnersProfile" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                {SPLoaded ? SPList : <p >Loading...</p>}</div>

                        </div>
                    </div>

                </div>

            </div>

            <div style={makeCenterH2} className={gotResult ? "" : "d-none"} >
                <div style={personalResultDiv} >
                    <h1 style={{ textAlign: "center", fontWeight: "bold", letterSpacing: "5px", padding: "0px 40px", fontSize: "30px" }}> {lastDivText} </h1>
                </div>

            </div>

        </div >
    )
}

export default BiddingResult; 