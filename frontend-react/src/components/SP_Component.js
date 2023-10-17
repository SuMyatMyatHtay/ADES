import React, { useEffect } from 'react'; // Import React from 'react' instead of importing Component
import axios, { all } from 'axios'; // Import axios
import { ChangeEvent, useState } from "react";


import 'bootstrap/dist/css/bootstrap.css';

import '../css/allFriends.css';

let tempEveryPlayer = [];
let everyPlayer = [];
let allFriID = [];
let friCount = [];
const playerID = localStorage.getItem('player_id')
const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');

var REACT_URL = 'https://monster-cat-world.onrender.com';

const API_URL = 'https://monster-cat-world.onrender.com';
/////////////////////////////////////////////////////////////////////
// For local development 
// with React in Port 3001 and Express in Port 3000
/////////////////////////////////////////////////////////////////////
if (window.location.hostname === "localhost" && window.location.port === "3001") {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}


const SPComponent = () => {
    const [popupText, setPopupText] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isButtonClicked, setButtonClicked] = useState(false);
    const [inputText, setInputText] = useState("");
    const [inputNumber, setInputNumber] = useState("");
    const [friCheckButton, setFriCheckButton] = useState([]);
    const [SPList, setSPList] = useState([]);
    const [SPListDiv, setSPListDiv] = useState([]);
    const [SPLoaded, setSPLoaded] = useState(false);

    useEffect(() => {
        clickOnSearch();
        console.log("running clickOnSearch")

    }, [])

    const togglePopup = () => {
        console.log('popup screen yay');
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.reload();
        }

    };


    const handleChange = (e) => {
        // 👇 Store the input value to local state
        setInputText(e.target.value);
        console.log(e.target.value)
    };

    const handleChangeNum = (e) => {
        // 👇 Store the input value to local state
        setInputNumber(e.target.value);
        console.log(e.target.value)
    };

    const handleClick = () => {
        if (!isButtonClicked) {
            // Run the function only if the button has not been clicked before
            clickOnSearch();
            //setButtonClicked(true);
        }
    };

    const GoToFriendProfile = (tempID) => {
        localStorage.setItem('FriendID', tempID);
        console.log(`This is checking the profile of the user. The id you click is ${tempID}`);
        localStorage.setItem('tempID', PLAYERIDTEMP);
        localStorage.setItem('player_id', tempID);
        window.location.href = 'RProfileFri';
    }

    const clickOnSearch = () => {
        let tempKey = document.getElementById('keyword');
        let tempnameKey = document.getElementById('namekeyword');
        let searchKeyword = tempKey.value;
        let nameKeyword = tempnameKey.value;

        if ((searchKeyword == null || searchKeyword == "") && (nameKeyword == null || nameKeyword == "")) {
            var linkTemp = 'searchWithID/' + playerID
        }
        else if (nameKeyword == null || nameKeyword == "") {
            var linkTemp = 'searchWithID/' + playerID + '?keywordSearch=' + searchKeyword
        }
        else if (searchKeyword == null || searchKeyword == "") {
            var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword
        }
        else {
            var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword + '&keywordID=' + searchKeyword
        }

        /*
        axios.post(`${REACT_URL}/api/friendsRoute/getAllFriends/${(playerID)}`)
            .then((response) => {
                //rowNum = response.data;
                for (var i = 0; i < response.data.length; i++) {
                    allFriID.push(response.data[i].friendID)
                }
                //console.log(allFriID, "allFriID");
            })

            .then(() => {
                for (var j = 0; j < allFriID.length; j++) {
                    axios.post(`${REACT_URL}/api/friendsRoute/getFriCount/${allFriID[j]}`)
                        .then((response) => {
                            friCount.push(response.data[0].rowCount)
                            //console.log(response, "getFriCount/")
                        })
                }

            })

            .then(() => {
                */
        // onClick={() => acceptRequest(pID)}
        axios.post(`${REACT_URL}/api/searchRoute/${(linkTemp)}`)
            .then((response) => {
                console.log("search player")
                if (response.data.length > 0) {
                    //everyPlayer = [];
                    allFriID = [];
                    tempEveryPlayer = [];
                    for (var i = 0; i < response.data.length; i++) {
                        allFriID.push(response.data[i].player_id)
                        tempEveryPlayer.push(response.data[i])
                    }

                    /*
                    for (var i = 0; i < response.data.length; i++) {

                        const pID = response.data[i].player_id;

                        var myArray = response.data[i].image_path.split("/images/");
                        if (response.data[i].player_id == playerID) {
                            var buttonT = [<button className="custom-button" >Check your own profile</button>]
                        }
                        else if (response.data[i].ReqCheck == '1') {
                            var buttonT = [<button className="custom-button" onClick={() => acceptRequest(pID)} >Accept Friend Request</button>]
                        }
                        else if (response.data[i].CancelCheck == '1') {
                            console.log("Cancel Req ")
                            var buttonT = [<button className='custom-button' onClick={() => deleteRequest(pID, 0)}> Cancel Request </button>]
                        }
                        else if (response.data[i].friCheck == '0') {
                            console.log("Send Req ")
                            var buttonT = [<button className="custom-button" onClick={() => checkDuplicateFriReq(pID, playerID)}>Send Request</button>]
                        }

                        else {
                            var buttonT = [<button className="custom-button" >Friends Already</button>]
                        }

                        everyPlayer.push(
                            <div key={response.data[i].player_id} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px", height: "350px" }}  >
                                <div className="row align-items-center p-1">

                                    <div className="" style={{ padding: "30px" }}>
                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                    </div>
                                    <div className=" profileDetail">
                                        <p> ID : {response.data[i].player_id}</p>
                                        <p>Name : {response.data[i].player_username}</p>
                                        <p> Row Num : ${friCount[i]} </p>
                                        <div >
                                            <button>Check {response.data[i].FriendID} </button>
                                            {buttonT[0]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )

                    }
                    setSPList(everyPlayer);
                    setSPLoaded(true);
                    */
                }
                else {
                    setSPList(<h3> No such player found </h3>);
                    setSPLoaded(true);
                }
                //console.log(response.data)
            })
            .then(() => {
                if (tempEveryPlayer.length == 0) {

                }

                else {
                    friCount = [];
                    for (var j = 0; j < allFriID.length; j++) {
                        axios.post(`${REACT_URL}/api/friendsRoute/getFriCount/${allFriID[j]}`)
                            .then((response) => {
                                friCount.push(response.data[0].rowCount)
                                //console.log(response, "getFriCount/")
                            })

                            .then(() => {
                                if (tempEveryPlayer.length == 0) {

                                }
                                else {
                                    console.log(friCount, "friCount")
                                    console.log(friCount[1], "friCount1")
                                    console.log(friCount[0], "friCount11")
                                    everyPlayer = [];

                                    for (var i = 0; i < tempEveryPlayer.length; i++) {
                                        //const FID = tempEveryPlayer[i].FriendID;
                                        const pID = tempEveryPlayer[i].player_id;
                                        //var myArray = ["eee", "femaleCharacter4.PNG"]
                                        var myArray = tempEveryPlayer[i].image_path.split("/images/");
                                        if (tempEveryPlayer[i].player_id == playerID) {
                                            var buttonT = []
                                        }
                                        else if (tempEveryPlayer[i].ReqCheck == '1') {
                                            var buttonT = [<button style={buttonStyle} className="custom-button" onClick={() => { acceptRequest(pID); setSPLoaded(false) }} >Accept Req</button>]
                                        }
                                        else if (tempEveryPlayer[i].CancelCheck == '1') {
                                            console.log("Cancel Req button")
                                            var buttonT = [<button style={buttonStyle} className='custom-button' onClick={() => { deleteRequest(pID, 0); setSPLoaded(false) }}> Cancel Req </button>]
                                        }
                                        else if (tempEveryPlayer[i].friCheck == '0') {
                                            console.log("Send Req button ")
                                            var buttonT = [<button style={buttonStyle} className="custom-button" onClick={() => { checkDuplicateFriReq(pID, playerID); setSPLoaded(false) }}>Send Req</button>]
                                        }

                                        else {
                                            var buttonT = [<button style={buttonStyle} className="custom-button" >Friends</button>]
                                        }

                                        everyPlayer.push(
                                            <div key={tempEveryPlayer[i].player_id} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px", height: "410px" }}  >
                                                <div className="row align-items-center p-1">

                                                    <div className="" style={{ padding: "30px" }}>
                                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                                    </div>
                                                    <div className=" profileDetail">
                                                        <p style={textStyle}> ID : {tempEveryPlayer[i].player_id}</p>
                                                        <p style={textStyle}>Name : {tempEveryPlayer[i].player_username}</p>
                                                        <p style={textStyle}> Friends : {friCount[i]}/20 </p>
                                                        <div >
                                                            <button onClick={() => { GoToFriendProfile(pID) }} style={buttonStyle}>Check </button>
                                                            {buttonT[0]}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )

                                    }

                                    setSPList(everyPlayer);
                                    setSPLoaded(true);
                                }
                            })
                    }
                }
            })



            .catch((error) => {
                console.log(error);
            })

        // })

    }

    const checkDuplicateFriReq = (tempID, mainplayer_id) => {
        axios.post(API_URL + '/api/searchRoute/checkDuplicateFriReq', {
            "friendID": tempID,
            "mainplayer_id": mainplayer_id
        })
            .then((response) => {
                //console.log("checkDuplicateFriReq function")
                //console.log(response.data, "");
                if (response.data.length == 0) {
                    console.log("call checkDuplicateFriReqToAccept")
                    checkDuplicateFriReqToAccept(tempID, mainplayer_id)

                }
                else {

                    setPopupText("You have already sent request to this player. You cannot send the request more than once.")
                    //console.log(response.data, "req exists ");
                    //SearchImpact.innerHTML = `<h2 style="text-align: center;">  You Already sent the friend request </h2>`
                    togglePopup();
                }

            })

            .catch(function (error) {
                console.log(error);
            })
    }

    const checkDuplicateFriReqToAccept = (tempID, mainplayer_id) => {
        axios.post(API_URL + '/api/searchRoute/checkDuplicateFriReqToAccept', {
            "friendID": tempID,
            "mainplayer_id": mainplayer_id
        })
            .then((response) => {
                console.log("checkDuplicateFriReqToAccept function")
                //console.log(response.data);
                if (response.data.length == 0) {
                    FriLimitCheck(tempID, mainplayer_id);
                }
                else if (response.data.length == 1) {
                    console.log("matchy matchy req so gonna accept. Cuz that player send req already")
                    setPopupText("You successfully accept the request. Enjoy the friendship. YAYYY")
                    togglePopup();
                    //console.log("The player already sent you the request. You are now friends")
                    //SearchImpact.innerHTML = `<h2 style="text-align: center;">  The player already sent you the request. So, you are now friends </h2>`
                    acceptRequest(tempID);
                }
                else {
                    // SearchImpact.innerHTML = `<h2 style="text-align: center;">  unexpected error occurs in checkDuplicateFriReqToAccept function </h2>`

                }

            })

            .catch(function (error) {
                console.log(error);
            })
    }


    const SendFriReq = (tempID, mainplayer_id) => {
        axios.post(API_URL + '/api/searchRoute/sentFriReq', {
            "friendID": tempID,
            "mainplayer_id": mainplayer_id
        })
            .then((response) => {
                //console.log(response.data);
                //console.log("FriendRequest Sent!");
                setPopupText("FriendRequest is sent successfully");
                togglePopup();
                //SearchImpact.innerHTML = `<h2 style="text-align: center;">FriendRequest Sent!</h2>`

            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const FriLimitCheck = (tempID, mainplayer_id) => {
        axios.post(REACT_URL + '/api/friendsRoute/getFriCount/' + PLAYERIDTEMP)

            .then((response) => {
                console.log("Checking the number of friends that player have")
                console.log(response.data);
                console.log(response.data, 'fri limit of fri check');

                if (response.data[0].rowCount < 20) {
                    console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")

                    //Because the bot ID number is 38
                    if (tempID == 38) {
                        console.log("This is bot. Bot will accept all the requests. ")
                        botAcceptFriReq(mainplayer_id, 38);
                    }
                    else {
                        axios.post(REACT_URL + '/api/friendsRoute/getFriCount/' + tempID)
                            .then((response) => {
                                console.log(response.data, 'fri limit of fri check');
                                console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")
                                if (response.data[0].rowCount < 20) {
                                    SendFriReq(tempID, mainplayer_id);
                                }
                                else {
                                    setPopupText("This player already hit the maximum friend number. You cannot send the friend request")
                                    togglePopup();
                                }
                            })
                            .catch((error) => {
                                console.log(error)

                            });
                    }



                }

                else {
                    setPopupText("You already reach the maximum number of friends. Please unfriend some players to send this player a friend request")
                    togglePopup();
                }


            })


            .catch(function (error) {
                console.log(error);
                //AllFriReqDisplay(error);
            })


    }

    const acceptRequest = (tempID) => {

        axios.post(REACT_URL + '/api/friendsRoute/getFriCount/' + PLAYERIDTEMP)

            .then((response) => {
                console.log("Checking the number of friends that player have")
                console.log(response.data);
                console.log(response.data, 'fri limit of fri check');
                //console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")

                //AorR += 'Friend Request is accepted successfully.'
                //AllFriReqDisplay(response.data);
                if (response.data[0].rowCount < 20) {
                    console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")


                    axios.post(REACT_URL + '/api/friendsRoute/getFriCount/' + tempID)
                        .then((response) => {
                            console.log(response.data, 'fri limit of fri check');
                            console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")
                            if (response.data[0].rowCount < 20) {
                                axios.post(API_URL + '/api/friendReqRoute/addToFriendship/' + PLAYERIDTEMP + '/' + tempID)

                                    .then((response) => {
                                        console.log(response)
                                        console.log(response.data);
                                        console.log("Accepted the friend request.")
                                        setPopupText("Friend Request is accepted successfully.")
                                        //AorR += 'Friend Request is accepted successfully.'
                                        //AllFriReqDisplay(response.data);
                                    })
                                    .then(() => {
                                        deleteRequest(tempID, 1);
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                        //AllFriReqDisplay(error);
                                    })
                            }
                            else {
                                setPopupText("Your Friend already reach the maximum number of friends. You cannot accept this request")
                                togglePopup();
                            }
                        })

                    // .then(() => {
                    //     console.log(friLimitCheck, "frilimitcheck final")
                    //     if (friLimitCheck == true) {
                    //         axios.post(API_URL + '/api/friendReqRoute/addToFriendship/' + PLAYERIDTEMP + '/' + tempID)

                    //             .then((response) => {
                    //                 console.log(response)
                    //                 console.log(response.data);
                    //                 console.log("Accepted the friend request.")
                    //                 setPopupText("Friend Request is accepted successfully.")
                    //                 //AorR += 'Friend Request is accepted successfully.'
                    //                 //AllFriReqDisplay(response.data);
                    //             })
                    //             .then(() => {
                    //                 deleteRequest(tempID, 1);
                    //             })
                    //             .catch(function (error) {
                    //                 console.log(error);
                    //                 //AllFriReqDisplay(error);
                    //             })
                    //     }
                    //     else {
                    //         setPopupText("You already reach the maximum number of friends. Please unfriend some player to accept more friend requests")
                    //         togglePopup();
                    //     }
                    // })
                }

                else {
                    setPopupText("You already reach the maximum number of friends. Please unfriend some players to accept this request ")
                    togglePopup();
                }


            })

            // .then(() => {
            //     console.log("I am second then")
            //     console.log(friLimitCheck == true, "friLimitCheck == true")
            //     if (friLimitCheck == true) {
            //         console.log(friLimitCheck, "frilimitcheck")
            //         console.log("Checking the number of friends that friend of player have")

            //     }
            // })

            .catch(function (error) {
                console.log(error);
                //AllFriReqDisplay(error);
            })



    }

    const deleteRequest = (tempID, check) => {
        axios.delete(REACT_URL + '/api/friendReqRoute/friReqDelete/' + PLAYERIDTEMP + '/' + tempID)
            .then((response) => {
                console.log(popupText, "popupText")
                if (check == 1) {

                }
                else if (response.data.affectedRows == 1) {
                    setPopupText("Friend Request deleted successfully");

                    //console.log(response);
                    //console.log(response.data, "req deleted");
                }
                else if (response.data.affectedRows != 1) {
                    setPopupText("No friend request to be deleted ")
                }
                togglePopup();

                // setTimeout(function () {
                //     location.reload();
                // }, 1000);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //Bot will always be on the accept side. 
    const botAcceptFriReq = (playerID, botID) => {
        axios.post(API_URL + '/api/friendReqRoute/addToFriendship/' + botID + '/' + playerID, {
            "playerID": botID,
            "friendshipID": playerID
        })
            .then((response) => {
                setPopupText("Thank you so much for sending friend request to our bot. Your request is accepted automatically.")
                togglePopup();
                console.log(response.data, "bot successfully accept the request")


            })

            .catch((error) => {
                console.log(error);
            })
    }

    const textStyle = {
        color: "rgb(145, 0, 207)",
        fontWeight: "bold",
        fontSize: "18px",
        margin: "15px 10px"
    }

    const buttonStyle = {
        margin: "4px",
        padding: "3px 12px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '2px solid rgb(145, 0, 207)', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '15px',
        fontWeight: 'bold',
    };

    const searchButtonStyle = {
        margin: "4px",
        padding: "3px 30px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '2px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
        height: '60px',
    };

    const nameInput = {
        border: '2px solid rgb(145, 0, 207)',
        height: '70px',
        backgroundColor: "black",
        color: "white",
        fontSize: "20px",
        padding: "5px",
        paddingLeft: "35px",
        marginRight: "35px",
        borderRadius: '50px',
        flexGrow: 1
    }

    const IDInput = {
        border: '2px solid rgb(145, 0, 207)',
        height: '70px',
        backgroundColor: "black",
        color: "white",
        fontSize: "20px",
        padding: "5px",
        paddingLeft: "35px",
        marginRight: "35px",
        borderRadius: '50px'
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
                            <h2>Friend Request</h2>
                            <p>{popupText}</p>
                            <button onClick={togglePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="col Main" style={{ padding: "40px 80px 10px 80px" }}>
                <div style={{ display: 'flex', alignItems: "center" }}>
                    <input style={nameInput} id="namekeyword" type="text" onChange={handleChange} value={inputText} placeholder="Enter Player Name ..." className="name-input" />
                    <input style={IDInput} id="keyword" type="number" onChange={handleChangeNum} value={inputNumber} placeholder="Enter Player ID ..." className="id-input" />
                    <button style={searchButtonStyle} id="Search" onClick={handleClick} >Search</button>

                </div>
                <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                    {SPLoaded ? SPList : <p >Loading...</p>}</div>

            </div>
        </div>
    )
}

export default SPComponent;
/*
export default class SPComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            SPList: [],
            SPLoaded: false
        }
    }

    componentDidMount() {
        this.checkingOnLoad();
    }

    checkingOnLoad() {
        let tempKey = document.getElementById('keyword');
        let tempnameKey = document.getElementById('namekeyword');
        let searchKeyword = tempKey.value;
        let nameKeyword = tempnameKey.value;

        if ((searchKeyword == null || searchKeyword == "") && (nameKeyword == null || nameKeyword == "")) {
            var linkTemp = 'searchWithID/' + playerID
        }
        else if (nameKeyword == null || nameKeyword == "") {
            var linkTemp = 'searchWithID/' + playerID + '?keywordSearch=' + searchKeyword
        }
        else if (searchKeyword == null || searchKeyword == "") {
            var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword
        }
        else {
            var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword + '&keywordID=' + searchKeyword
        }

        axios.post(`${API_URL}/api/searchRoute/${(linkTemp)}`)
            .then((response) => {
                if (response.data.length > 0) {
                    everyPlayer = [];
                    for (var i = 0; i < response.data.length; i++) {
                        console.log(response.data)
                    }
                }
            })
    }

    render() {
        return (
            <div>

                <div class="col" style={{ padding: "40px 80px 10px 80px" }}>
                    <input id="namekeyword" type="text" placeholder="Enter Player Name ..." class="name-input" />
                    <input id="keyword" type="number" placeholder="Enter Player ID ..." class="id-input" />
                    <button id="Search">Search</button>
                </div>
            </div>
        )
    }
}
*/
