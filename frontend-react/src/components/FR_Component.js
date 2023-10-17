import React, { useEffect } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios
import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.css';

let everyFriReq = []
const playerID = localStorage.getItem('player_id');
const PLAYERIDTEMP = localStorage.getItem('player_id');

var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';

const FRComponent = () => {
    //const [friLimitCheck, setFriLimitCheck] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupText, setPopupText] = useState("")

    const [isCoverOpen, setIsCoverOpen] = useState(false);

    const [FRLoaded, setFRLoaded] = useState(false);
    const [FRList, setFRList] = useState([]);

    const [isButtonClicked, setButtonClicked] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.reload();
        }

    };

    /*
    const coverPopup = () => {
        setIsCoverOpen(!isCoverOpen);
        if (isCoverOpen == true) {
            window.location.reload();
        }
    }
*/

    useEffect(() => {
        ListLoaded();
        console.log('useEffect is loaded')
    }, [])

    const ListLoaded = () => {
        axios.post(`${API_URL}/api/friendReqRoute/getAllFriReq/${(playerID)}`)
            .then((response) => {
                if (response.data.length > 0) {
                    everyFriReq = [];
                    for (var i = 0; i < response.data.length; i++) {
                        //console.log(response.data[i])
                        var myArray = response.data[i].avatar.split("/images/");
                        const pID = response.data[i].player_id;

                        console.log(response.data[i].player_id)

                        everyFriReq.push(
                            <div key={response.data[i].player_id} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px" }}  >
                                <div className="row align-items-center p-1">

                                    <div className="" style={{ padding: "30px" }}>
                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                    </div>
                                    <div className=" profileDetail">
                                        <p style={textStyle}> ID : {response.data[i].player_id}</p>
                                        <p style={textStyle}>Name : {response.data[i].player_username}</p>
                                        <p style={textStyle}> Gold : {response.data[i].gold} </p>
                                        <div style={{ paddingBottom: "16px" }}>

                                            <button style={buttonStyle} onClick={() => {
                                                if (!isButtonClicked) {
                                                    //coverPopup();
                                                    setFRLoaded(false);
                                                    acceptRequest(pID);
                                                }
                                            }} disabled={isButtonClicked} >Accept</button>

                                            <button style={buttonStyle} onClick={() => {
                                                if (!isButtonClicked) {
                                                    //coverPopup();
                                                    setFRLoaded(false);
                                                    deleteRequest(pID, 0);
                                                }
                                            }} disabled={isButtonClicked} >Reject</button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        )
                    }
                    setFRList(everyFriReq);
                    setFRLoaded(true);
                }
                else {
                    setFRList(<h3> There is no friend request </h3>);
                    setFRLoaded(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const acceptRequest = (tempID) => {

        setButtonClicked(true);

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
                    //setFriLimitCheck(true);

                    axios.post(REACT_URL + '/api/friendsRoute/getFriCount/' + tempID)
                        .then((response) => {
                            console.log(response.data, 'fri limit of fri check');
                            console.log(response.data[0].rowCount < 20, "response.data[0].rowCount < 20")
                            if (response.data[0].rowCount < 20) {
                                //setFriLimitCheck(true);
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
        setButtonClicked(true);
        axios.delete(API_URL + '/api/friendReqRoute/friReqDelete/' + PLAYERIDTEMP + '/' + tempID)
            .then((response) => {
                if (check == 1) {

                }
                else {
                    setPopupText("Friend Request is successfully rejected.")
                }
                togglePopup();
                // if (AorR == '') {
                //     AorR += 'Friend Request is successfully rejected.'
                // }
                console.log(response)
                console.log(response.data);
                // aftResponse.innerHTML = `
                //     <div style="margin-bottom: 50px;">
                //         <h3 style="text-align: center;">${AorR}</h3>
                //         <div
                //             style="display: flex; justify-content: center; align-items: center; height: 400px; margin: 0 auto;">
                //             <img src="./images/gif/LoadingPinkBar.gif" alt="Loading"
                //                 style="width: 700px; background-color: rgba(0, 0, 0, 0.649);">
                //         </div>
                //     </div>
                // `
                console.log("Friend request successfully deleted.")

                // setTimeout(function () {
                //     location.reload();
                // }, 3000);
            })
            .then(() => {
                if (check == 1) {
                    deleteDuplicateFriReq(tempID);
                }
                // showRequest.innerHTML = ``;
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const deleteDuplicateFriReq = (tempID) => {
        axios.delete(REACT_URL + '/api/friendsRoute/deleteDuplicateFriends/' + PLAYERIDTEMP + '/' + tempID)
            .then((response) => {
                console.log(response.data, "deleteDuplicateFriReq");
            })
            .catch(function (error) {
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
        margin: "5px",
        padding: "3px 12px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '2px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '15px',
        fontWeight: 'bold',
    };

    return (
        <div>
            <div className="FriReqListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                {FRLoaded ? FRList : <p >Loading...</p>}</div>

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

            {isCoverOpen && (
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

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default FRComponent; 