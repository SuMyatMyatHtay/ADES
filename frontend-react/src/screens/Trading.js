import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

import TradingComponent from '../components/Trading_Component';
import TradingBg from '../images/getAllTradingBG.jpg';


import 'bootstrap/dist/css/bootstrap.css';
const API_URL = 'https://monster-cat-world.onrender.com';

const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const currentDateGMT = new Date();
const currentMonthGMT = currentDateGMT.getUTCMonth();
const currentYearGMT = currentDateGMT.getUTCFullYear();

// const startDateGMT = new Date('July 30, 2023 18:00:00 GMT');
// const endDateGMT = new Date('August 5, 2023 18:00:00 GMT');

const bettingEndDate = new Date(`${Months[currentMonthGMT]} 18, ${currentYearGMT} 18:00:00 GMT`);
if (currentMonthGMT == 11) {
    var bettingStartDate = new Date(`${Months[0]} 1, ${currentYearGMT + 1} 18:00:00 GMT`);
}
else {
    var bettingStartDate = new Date(`${Months[currentMonthGMT + 1]} 1, ${currentYearGMT} 18:00:00 GMT`);
}




const TradingScreen = () => {

    const [buttonDisable, setButtonDisable] = useState(false);

    useEffect(() => {
        if (currentDateGMT >= bettingEndDate && currentDateGMT <= bettingStartDate) {
            setButtonDisable(true);
            console.log('Current GMT is between the specified period.');
        } else {
            setButtonDisable(false);
            console.log('Current GMT is not between the specified period.');
        }
    })

    const navigateTo = () => {
        window.location.href = '/RallFriends'
    }

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
        padding: "0px 5px",
        top: '80px',
        right: '35px',
        color: "gold",
        backgroundColor: "black"
    }

    const HeadingText = {
        color: "gold",
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: "5px"
    }

    const backButtonStyle = {
        margin: "10px",
        padding: "3px 25px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '3px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };

    return (
        <div className="Main" style={{ overflow: 'scroll', height: '100vh', backgroundImage: `url(${TradingBg})` }}>
            <style>
                {`
                    .Main::-webkit-scrollbar {
                        width: 0;
                        height: 0; 
                    }
        
        `}
            </style>
            <button style={backButtonStyle} onClick={() => { navigateTo() }}>Back</button>
            <button className={buttonDisable ? "d-none" : ""} style={cardButtonStyle} onClick={() => { window.location.href = '/RBlindTrade' }}>
                <img src={require("../images/chest.png")} alt="Loading..." style={{ width: "45px", }} />
            </button>
            <div className={buttonDisable ? "d-none" : ""} style={cardButtonTextStyle}>Box Portal</div>

            <h2 style={HeadingText} > Trading Ground</h2>
            <div style={{ padding: "20px" }}>
                <TradingComponent />
            </div>
        </div>

    )
}

export default TradingScreen;

/*
import React from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios

import 'bootstrap/dist/css/bootstrap.css';

import TradeCard from '../components/TradeCard_Component'

let myCard = [];
let myFriCard = [];
const API_URL = 'https://monster-cat-world.onrender.com';

class TradingScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            playerID: localStorage.getItem('player_id'),
            friendID: localStorage.getItem('FriendID'),
            myCardR: myCard,
            myFriCardR: myFriCard
        }

    }

    componentDidMount() {
        this.printOutPlayerCards(this.state.playerID, this.state.friendID)
    }


    printOutPlayerCards(playerID, friendID) {
        axios.get(`${API_URL}/api/tradingRoute/cardtrading/${(playerID)}`)
            .then((response) => {
                //console.log(response)
                //console.log(response.data);
                myCard = [];
                for (var i = 0; i < response.data.length; i++) {
                    myCard.push([response.data[i].card_id, response.data[i].creature_name, response.data[i].card_image, response.data[i].attack_names, response.data[i].hit_points])

                }
                this.setState({ myCardR: myCard })


            })
            .catch(function (error) {
                console.log(error);
            })


        axios.get(`${API_URL}/api/tradingRoute/cardtrading/${(playerID)}/${(friendID)}`)
            .then((response) => {
                //console.log(response)
                //console.log(response.data);
                myFriCard = [];
                for (var i = 0; i < response.data.length; i++) {
                    myFriCard.push([response.data[i].card_id, response.data[i].creature_name, response.data[i].card_image, response.data[i].attack_names, response.data[i].hit_points])

                }
                this.setState({ myFriCardR: myFriCard })
                // console.log(this.state.myCardR)
                // console.log(this.state.myFriCardR)

            })
            .catch(function (error) {
                console.log(error);
            })


    }

    render() {
        const divElements = [];
        const divFriElements = [];

        if (divElements.length == 0)
            if (this.state.myCardR.length == 0) {
                divElements.push(<div> You do not have any cards to trade. Go buy you broke bitch </div>)
            }
            else {
                for (let i = 0; i < this.state.myCardR.length; i++) {
                    if (this.state.myCardR[i]) {
                        if (this.state.myCardR[i][2]) {
                            divElements.push(<TradeCard cardName={this.state.myCardR[i][1]} imagePath={this.state.myCardR[i][2]} />)
                        }
                    }

                }
            }

        if (this.state.myCardR.length == 0) {
            divElements.push(<div> The player do not have any cards </div>)
        }
        else {
            for (let i = 0; i < this.state.myFriCardR.length; i++) {
                if (this.state.myCardR[i]) {
                    if (this.state.myCardR[i][2]) {
                        divFriElements.push(<TradeCard cardName={this.state.myFriCardR[i][1]} imagePath={this.state.myFriCardR[i][2]} />)
                    }
                }

            }
        }


        console.log(this.state.myCardR)
        return (

            <div className="Main">
                <button>Back</button>
                <h2> Trading Ground</h2>
                <div style={{ padding: "20px" }}>
                    <div className="row">
                        <div className="col-md-9">
                            <div style={{ width: '100%', height: "120vh", backgroundColor: "red", display: "flex", flexDirection: "column" }}>
                                <div style={{ flex: "1", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                    <h2>Choose Your Card for Trading </h2>
                                    <div style={{ flex: "1", overflowY: "auto", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                        {divElements}
                                    </div>

                                </div>
                                <div style={{ flex: "1", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                    <h2>Choose Your Friend's Card for Trading </h2>
                                    <div style={{ flex: "1", overflowY: "auto", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                                        {divFriElements}
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ width: '100%', height: "120vh", backgroundColor: "yellow", display: "flex", flexDirection: "column" }}>
                                <div style={{ flex: "1" }}>1st </div>
                                <div style={{ flex: "1" }}> 2nd</div>

                            </div>
                        </div>
                    </div>
                </div>





            </div>


        )

    }
}

export default TradingScreen;

*/