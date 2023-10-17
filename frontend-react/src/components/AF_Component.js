import React, { useEffect, useState } from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios

import 'bootstrap/dist/css/bootstrap.css';

import '../css/allFriends.css';



let everyFriends = []
const playerID = localStorage.getItem('player_id')
const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');

var REACT_URL = 'https://monster-cat-world.onrender.com'
const API_URL = 'https://monster-cat-world.onrender.com';

const Instructions = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [finalPopUp, setFinalPopUp] = useState(false);

    const [tempID, setTempID] = useState(0);

    const [aList, setAList] = useState([]);
    const [bLoaded, setBLoaded] = useState(false);

    useEffect(() => {
        ListLoaded();
    }, [])

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true && finalPopUp == true) {
            window.location.reload();
        }

    };

    const tempSave = (tempID) => {
        setTempID(tempID);
        togglePopup();
    }

    const ListLoaded = () => {
        axios
            .get(`${API_URL}/api/friendsRoute/friendBase/${(playerID)}`)
            .then((response) => {
                if (response.data.length > 0) {
                    console.log(response.data)
                    everyFriends = [];
                    for (var i = 0; i < response.data.length; i++) {
                        //console.log(response.data);
                        //everyFriends.push([response.data[i].FriendID, response.data[i].FriendName, response.data[i].image_path])
                        const FID = response.data[i].FriendID;
                        var myArray = response.data[i].image_path.split("/images/");
                        console.log(response.data[i].FriendID)
                        everyFriends.push(
                            <div key={response.data[i].FriendID} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px" }}  >
                                <div className="row align-items-center p-1">

                                    <div className="" style={{ padding: "30px" }}>
                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                    </div>
                                    <div className=" profileDetail">
                                        <p style={textStyle}> ID : {response.data[i].FriendID}</p>
                                        <p style={textStyle}>Name : {response.data[i].FriendName}</p>
                                        <div style={{ paddingBottom: "16px" }}>
                                            <button style={buttonStyle} onClick={() => { GoToFriendProfile(FID) }}>Check</button>
                                            <button style={buttonStyle} onClick={() => { tempSave(FID) }} > Unfriend </button>
                                            <button style={tradeButtonStyle} key={i}><a style={{ color: "gold" }} href={'/RFriTradeTransition/' + FID}>Trade</a></button>
                                        </div>
                                    </div>


                                </div>
                            </div>)
                    }

                    setAList(everyFriends);
                    setBLoaded(true);
                    // this.setState({ aList: everyFriends, bLoaded: true });
                    // this.forceUpdate();
                }
                else {
                    setAList(<h3> You don't have any friend </h3>);
                    setBLoaded(true);
                    // this.setState({ aList: <h3> Nothing </h3>, bLoaded: true });
                    // this.forceUpdate();
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const GoTrade = (tempID) => {
        localStorage.setItem('FriendID', tempID);
        window.location.href = '/Rtrading'
    }

    const Unfriend = () => {
        var friendID = tempID;
        console.log(`${REACT_URL}/api/friendsRoute/unfriend/${(playerID)}/friends/${(friendID)}`, "API URL")
        axios.delete(`${REACT_URL}/api/friendsRoute/unfriend/${(playerID)}/friends/${(friendID)}`)
            .then((response) => {
                console.log(response);
                setFinalPopUp(true);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const GoToFriendProfile = (tempID) => {
        // localStorage.setItem('tempPlayerID', PLAYERIDTEMP);
        // localStorage.setItem('player_id', tempID);
        localStorage.setItem('FriendID', tempID);
        console.log(`This is checking the friend profile. The id you click is ${tempID}`);
        localStorage.setItem('tempID', PLAYERIDTEMP);
        localStorage.setItem('player_id', tempID);
        window.location.href = 'RProfileFri';
        //window.location.href = 'friendProfile.html'
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

    const tradeButtonStyle = {
        margin: "5px",
        padding: "3px 58px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '2px solid rgb(145, 0, 207)', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '16px',
        fontWeight: 'bold',
        marginLeft: '10px'
    };

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
                            <div className={finalPopUp ? "d-none" : ""}>
                                <h4>Are you sure you want to unfriend this player? </h4>
                                <button style={{ margin: "5px " }} onClick={() => Unfriend()}> Yes </button>
                                <button style={{ margin: "5px " }} onClick={togglePopup}>No</button>
                            </div>
                            <div className={finalPopUp ? "" : "d-none"}>
                                <h4>You successfully remove from your friend list</h4>

                                <button onClick={togglePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                {bLoaded ? aList : <p >Loading...</p>}</div>

        </div>
    )



}

export default Instructions;

/*
export default class Instructions extends React.Component {
    constructor() {
        super();
        this.state = {
            aList: [],
            bLoaded: false
        }
    }


    componentDidMount() {
        axios
            .get(`${API_URL}/api/friendsRoute/friendBase/${(playerID)}`)
            .then((response) => {
                if (response.data.length > 0) {
                    console.log(response.data)
                    everyFriends = [];
                    for (var i = 0; i < response.data.length; i++) {
                        //console.log(response.data);
                        //everyFriends.push([response.data[i].FriendID, response.data[i].FriendName, response.data[i].image_path])
                        var myArray = response.data[i].image_path.split("/images/");
                        console.log(response.data[i].FriendID)
                        everyFriends.push(
                            <div key={response.data[i].FriendID} className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px" }}  >
                                <div className="row align-items-center p-1">

                                    <div className="" style={{ padding: "30px" }}>
                                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                                    </div>
                                    <div className=" profileDetail">
                                        <p> ID : {response.data[i].FriendID}</p>
                                        <p>Name : {response.data[i].FriendName}</p>
                                        <div style={{ paddingBottom: "16px" }}>
                                            <button onClick={() => { this.GoToFriendProfile(response.data[i].FriendID) }}>Check {response.data[i].FriendID} </button>
                                            <button> Unfriend </button>
                                            <button key={i}><a href={'/RFriTradeTransition/' + response.data[i].FriendID}>Trade</a></button>
                                        </div>
                                    </div>


                                </div>
                            </div>)
                    }
                    this.setState({ aList: everyFriends, bLoaded: true });
                    this.forceUpdate();
                }
                else {
                    this.setState({ aList: <h3> Nothing </h3>, bLoaded: true });
                    this.forceUpdate();
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                {this.state.bLoaded ? this.state.aList : <p >Loading...</p>}</div>
        )

    }

    GoTrade(tempID) {
        localStorage.setItem('FriendID', tempID);
        window.location.href = '/Rtrading'
    }

    Unfriend(friendID) {
        axios.delete(`${API_URL}/api/friendsRoute/unfriend/${(playerID)}/friends/${(friendID)}`)
            .then((response) => {

            })
    }

    //this will have to get from MinRUi's Part so 
    //need modify 
    GoToFriendProfile(tempID) {
        // localStorage.setItem('tempPlayerID', PLAYERIDTEMP);
        // localStorage.setItem('player_id', tempID);
        console.log(`Onclick is still working. The id you click is ${tempID}`)
        //window.location.href = 'friendProfile.html'
    }
}
*/



/*
export default class Instructions extends React.Component {
    //{this.state.everyFriendsR[i][1]}
    render() {
        var myArray = this.props.imagePath.split("/images/");
        return (
            <div className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.884)", margin: "25px", border: "3px solid rgb(145, 0, 207) ", width: "220px", height: "300px" }}  >
                <div className="row align-items-center p-1">

                    <div className="" style={{ padding: "30px" }}>
                        <img src={require('../images/' + myArray[1])} alt="PlayerProfile" style={{ width: "150px", height: "150px" }} />
                    </div>
                    <div className=" profileDetail">
                        <p>Name : {this.props.name}</p>
                        <div >
                            <button onClick={() => { this.GoToFriendProfile(this.props.PID) }}>Check</button>
                            <button onClick={() => { this.GoTrade(this.props.PID) }}>Trade</button>

                        </div>
                    </div>


                </div>
            </div>
        )
    }

    GoTrade(tempID) {
        localStorage.setItem('FriendID', tempID);
        window.location.href = '/Rtrading'
    }

    GoToFriendProfile(tempID) {
        localStorage.setItem('tempPlayerID', PLAYERIDTEMP);
        localStorage.setItem('player_id', tempID);
        console.log(`Onclick is still working. The id you click is ${tempID}`)
        //window.location.href = 'friendProfile.html'
    }

}   
*/
