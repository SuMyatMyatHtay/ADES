import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
var PLAYERIDTEMP = localStorage.getItem('player_id');

const TradeCard = (props) => {
    console.log(props.imagePath);
    const myArray = [props.imagePath];

    const GoTrade = (tempID) => {
        localStorage.setItem('FriendID', tempID);
        window.location.href = '/Rtrading';
    };

    const GoToFriendProfile = (tempID) => {
        localStorage.setItem('tempPlayerID', PLAYERIDTEMP);
        localStorage.setItem('player_id', tempID);
        console.log(`Onclick is still working. The id you click is ${tempID}`);
        //window.location.href = 'friendProfile.html'
    };

    return (
        <div className="container" style={{ backgroundColor: "rgb(255, 249, 161)", margin: "25px", border: "4px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", width: "220px" }}>
            <div className="row align-items-center p-1">
                <p>Card Name: {props.cardName} </p>
                <div className="" style={{}}>
                    <img src={require('../images/cards/' + myArray[0])} alt="PlayerProfile" style={{ width: "180px", height: "180px", margin: "5px 0px" }} />
                </div>
                <div>
                    <p>Card ID : {props.ID} </p>
                    <p> Hit Points : {props.HP}</p>
                    <p> Attack Type : {props.AT}</p>
                </div>
                <button onClick={() => GoTrade(props.ID)}> Choose </button>
            </div>
        </div>
    );
};

export default TradeCard;


/*

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
var PLAYERIDTEMP = localStorage.getItem('player_id');
export default class TradeCard extends Component {

    render() {
        console.log(this.props.imagePath)
        var myArray = [this.props.imagePath];
        return (
            <div className="container" style={{ backgroundColor: "rgb(255, 249, 161)", margin: "25px", border: "4px solid red", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", width: "220px" }}  >
                <div className="row align-items-center p-1">

                    <p>Card Name: {this.props.cardName} </p>
                    <div className="" style={{}}>
                        <img src={require('../images/cards/' + myArray[0])} alt="PlayerProfile" style={{ width: "180px", height: "180px", margin: "5px 0px" }} />
                    </div>
                    <div>
                        <p>Card ID : {this.props.ID} </p>
                        <p> Hit Points : {this.props.HP}</p>
                        <p> Attack Type : {this.props.AT}</p>
                    </div>
                    <button> Choose </button>

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