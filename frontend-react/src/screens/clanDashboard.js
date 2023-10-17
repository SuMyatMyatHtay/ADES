
import React from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/clanDashboard.css';
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
if (window.location.hostname === 'localhost' && window.location.port === '3001') {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate()
const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemeber",
    "October",
    "November",
    "December"
]
const playerArr = []
var ClanID;
let run = false;


class ClanDashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: "",
            players: [],
            players2: [],
            adminData: []
        }
    }

    componentDidMount() {
        this.setState({ loading: 'loading...' })
        if (run == false) {
            //check if player belongs to clan
            axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
                .then((response) => {
                    if (response.data.ClanID == null) {
                        window.location.assign(`${REACT_URL}/Clan`)

                    }
                    ClanID = response.data.ClanID;
                    axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                        .then((result) => {
                            console.log(result)
                            if (result.data.length == 0) {
                                window.location.assign(`${REACT_URL}/Clan`)
                            }
                            else {
                                if (result.data[0].PlayerRole == 'leader' || result.data[0].PlayerRole == 'coleader') {
                                    var adminData = [];
                                    adminData.push(
                                        <div id="adminBtn">
                                            <img src={require('../images/dataIcon.png')} id="hiveDataIcon" onClick={() => window.location.assign(`${REACT_URL}/ClanData?Clan_Name=${clan_Name}`)} />
                                            <p >Clan Data</p>
                                        </div>
                                    )
                                    this.setState({ adminData: adminData })
                                }
                                this.showAllPlayers()
                            }

                        })
                        .catch((error) => {
                            console.log(error)
                        })

                })
                .catch((error) => {
                    console.log(error)
                })
            run = true
        }

    }

    showAllPlayers() {
        axios.get(`${REACT_URL}/api/clanDetails/getAllMembers/${clan_Name}`)
            .then((result) => {
                var players = [];
                var players2 = [];
                for (let x = 0; x < result.data.length; x++) {
                    console.log(result);
                    if (result.data[x] != null) {
                        let date = new Date(`${result.data[x].date_joined}`)
                        let day = date.getDate();
                        let month = monthArr[date.getMonth()]
                        let year = date.getFullYear();
                        let formattedDate = day + ' ' + month + ' ' + year
                        playerArr.push(result.data[x].player_id);
                        var playerAvatar = result.data[x].image_path.split('./images/');
                        if (x >= 5) {
                            players.push(
                                <div id={`player${x}`} className="charDiv">
                                    <img src={require(`../images/` + playerAvatar[1])} className="characters" id={`character${x}`} />
                                    <div className="details" id={`details${x}`}>
                                        <p>Name: <span className="charInfo"> {result.data[x].player_username}</span></p>
                                        <p>Clan Role: <span className="charInfo">{result.data[x].PlayerRole}</span></p>
                                        <p>Date Joined: <span className="charInfo">{formattedDate}</span></p>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            players2.push(
                                <div id={`player${x}`} class="charDiv">
                                    <img src={require(`../images/` + playerAvatar[1])} className="characters" id={`character${x}`} />
                                    <div className="details" id={`details${x}`}>
                                        <p>Name: <span className="charInfo"> {result.data[x].player_username}</span></p>
                                        <p>Clan Role: <span className="charInfo">{result.data[x].PlayerRole}</span></p>
                                        <p>Date Joined: <span className="charInfo">{formattedDate}</span></p>
                                    </div>
                                </div>
                            )
                        }
                        this.setState({ players: players, players2: players2, loading: '' })
                    }
                }

            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }


    exitDashboard() {
        window.location.assign(`${REACT_URL}/ClanVillage?Clan_Name=${clan_Name}`);
    }


    render() {
        return (
            <div className="clanDashboard">
                <button id="exitDashboard" onClick={this.exitDashboard}>Exit to Village</button>
                <div>
                    {this.state.adminData}
                </div>
                <h1 id="loading">
                    {this.state.loading}
                </h1>
                <div id="players">
                    {this.state.players}
                </div>
                <div id="players2">
                    {this.state.players2}
                </div>
            </div>
        )
    }

}

export default ClanDashboard;

