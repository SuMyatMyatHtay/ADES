import React from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/discoClub.css';
import Audio from "../audio/DiscoMusic.mp3"
var ClanID;
const REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
let hasRun = false;
let noMore = false;
//for jump
//make sure jump is finish to jump again
var progressDone = 1



class DiscoClub extends React.Component {
    constructor() {
        super();
        this.state = {
            showAuthorised: false,
            loading: "Loading...",
            players: [],
            raveName: '',
            getGold: '',
            showGold: false,
            showImage: true,
        }
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.mysteryChest = this.mysteryChest.bind(this);
    }

    componentDidMount() {
        this.setState({ showImage: true })
        document.getElementById("audio").volume = 0.2;
        if (player_id == null) {
            window.location.assign(`${REACT_URL}/Clan`);
        }
        //check if player belongs to clan
        axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
            .then((response) => {
                if (response.data.ClanID == null) {
                    window.location.assign(`${REACT_URL}/Clan`);
                }
                ClanID = response.data.ClanID;
                axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                    .then((result) => {
                        if (result.data.length == 0) {
                            window.location.assign(`${REACT_URL}/Clan`)
                        }
                        else {
                            if (hasRun == false) {
                                hasRun = true;

                                this.removeFromHive()
                                this.insertIntoDC();
                                this.getPlayers();
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            })
            .catch((error) => {
                console.log(error)
            })


    }


    insertIntoDC() {
        const bodyData = {
            "player_id": player_id,
            "ClanID": ClanID
        }
        axios.post(`${API_URL}/api/rooms/insertToDC`, bodyData)
            .then((response) => {
                console.log(response);
                return;
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    removeFromHive() {
        const hiveEntranceCd = ClanID + '' + player_id
        console.log(hiveEntranceCd);
        axios.delete(`${API_URL}/api/rooms/deleteFromHive/${hiveEntranceCd}`)
            .then((result) => {
                console.log("delete was successful", result);
            })
            .catch((error) => {
                console.log(error);
            })

    }


    getPlayers() {
        let players = []
        //for later use (image position)
        //Places where players avatar can be. to avoid overlapping 
        //i tried not to 'hard code' it but it caused a lag on the website
        let position = [
            { top: '190px', left: '1080px' },
            { top: '160px', left: '-10px' },
            { top: '35px', left: '440px' },
            { top: '50px', left: '100px' },
            { top: '90px', left: '550px' },
            { top: '40px', left: '270px' },
            { top: '35px', left: '680px' },
            { top: '75px', left: '1000px' },
            { top: '50px', left: '820px' },
            { top: '200px', left: '370px' },
            { top: '170px', left: '903px' },
            { top: '220px', left: '770px' },
        ];


        //get location (The Hive or Disco Cosmo or RPS)
        var path = window.location.pathname;
        var removeLocalHost = path.split("/").pop();
        var removeHtml = removeLocalHost.split(".html");
        var location = removeHtml[0];
        if (location == 'DiscoClub' || location == 'DiscoCosmo') {
            location = 'DiscoCosmo'
        }
        let bodyData = {
            'location': location
        }

        axios.post(`${API_URL}/api/rooms/getAllPlayersInRoom/${ClanID}`, bodyData)
            .then((response) => {
                console.log(response.data);
                response.data.forEach((result) => {
                    let playerid = result;
                    axios.get(`${API_URL}/api/players/getPlayerInfo/${playerid}`)
                        .then((result) => {
                            const image_id = result.data.image_id;
                            const player_username = result.data.player_username;
                            axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                                .then((result) => {
                                    //choose position from array (to allow some sort of variation whenever player enter this discoCosmo.html)
                                    var randomIndex = Math.floor(Math.random() * position.length)
                                    var topLeft = position[randomIndex];
                                    var topValue = topLeft.top;
                                    var leftValue = topLeft.left;
                                    var playerImagePath = result.data.split("./images/")
                                    position.splice(randomIndex, 1);
                                    if (playerid == player_id) {
                                        players.push(
                                            <div id={`playerDiv${playerid}`} class='playerDiv' style={{ position: 'absolute', top: topValue, left: leftValue }}>
                                                <button id="jumpBtn" onClick={this.jump}>Jump</button>
                                                <img src={`${require(`../images/` + playerImagePath[1])}`} id={`${playerid}`} style={{ zIndex: 1 }} />
                                                <p class="playerName">{player_username}</p>
                                            </div >
                                        )
                                    }
                                    else {
                                        players.push(
                                            <div id={`playerDiv${playerid}`} class='playerDiv' style={{ position: 'absolute', top: topValue, left: leftValue }}>

                                                <img src={`${require(`../images/` + playerImagePath[1])}`} id={`${playerid}`} />
                                                <p class="playerName">{player_username}</p>
                                            </div >
                                        )
                                    }
                                    this.setState({ loading: '', showAuthorised: true, raveName: clan_Name });
                                    setTimeout(() => {
                                        this.setState({ showImage: false })
                                    }, 4200)
                                    return;
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                });
                this.setState({ players: players })
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    getCursorPosition(e) {
        console.log(e.target.id)
        document.getElementById("audio").play();
        if (e.target.id == "jumpBtn" || e.target.id == "DiscoExit" || e.target.id == "discoMonster") {

            if (e.target.id == "jumpBtn") {
                this.jump();
            }
            else if (e.target.id == "discoMonster") {
                this.mysteryChest()
            }
            return;
        }
        else if (this.state.loading == '') {

            var currentPlayerDiv = document.querySelector(`#playerDiv${player_id}`);

            // Calculate new x and y positions
            var xPosition = e.clientX - currentPlayerDiv.offsetLeft - (currentPlayerDiv.offsetWidth / 2);
            var yPosition = e.clientY - currentPlayerDiv.offsetTop - (currentPlayerDiv.offsetHeight / 2) - (currentPlayerDiv.offsetWidth / 2);

            // Check if new position is within bounds
            if (yPosition < 0) {
                yPosition = 0;
            }
            var translateValue = `translate3d(${xPosition}px,${yPosition}px,0)`;
            currentPlayerDiv.style.transform = translateValue;
        }
    }


    jump() {
        if (progressDone == 1) {
            var playerDiv = document.getElementById(`playerDiv${player_id}`);
            console.log(playerDiv)
            var top = parseInt(playerDiv.style.top) || 0;
            var jumpHeight = 30;
            var jumpDuration = 200;
            var startTime = null;

            function animateJump(currentTime) {
                if (startTime === null) {
                    startTime = currentTime;
                }
                var elapsedTime = currentTime - startTime;
                var progress = Math.min(elapsedTime / jumpDuration, 1);
                progressDone = progress
                var deltaY = jumpHeight * 4 * progress * (1 - progress);
                playerDiv.style.top = (top - deltaY) + "px";
                if (progress < 1) {
                    requestAnimationFrame(animateJump);
                }
            }
            requestAnimationFrame(animateJump);
        }

    }


    mysteryChest() {
        if (noMore == false) {
            var mysteryNum = Math.floor(Math.random() * 50);
            var duelNum = Math.floor(Math.random() * 50);
            //basically if the num are equal, they get gold;
            if (mysteryNum == duelNum) {
                let bodyData = {
                    "gold": 10.00
                }
                axios.put(`${API_URL}/api/players/updateGold/${player_id}`, bodyData)
                    .then((result) => {
                        var getGold = [];
                        getGold.push(<p>lucky ! $10.00 <span style={{ display: 'block' }}>for you !</span></p>)
                        this.setState({
                            showGold: true,
                            getGold: getGold,

                        })
                        setTimeout(() => {
                            this.setState({
                                showGold: false,
                                getGold: '',

                            })
                        }, 1000)
                        noMore = true;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
            else {

                var getGold = [];
                getGold.push(<p>unlucky !<span style={{ display: 'block' }}>try again !</span></p>)
                this.setState({
                    showGold: true,
                    getGold: getGold,

                })
                setTimeout(() => {
                    this.setState({
                        showGold: false,
                        getGold: '',

                    })
                }, 1000)
            }
        }
        else {
            var getGold = [];
            getGold.push(<p>no more <span style={{ display: 'block' }}>for now</span></p>)
            this.setState({
                showGold: true,
                getGold: getGold,

            })
            setTimeout(() => {
                this.setState({
                    showGold: false,
                    getGold: '',

                })
            }, 1000)

        }
    }



    render() {
        return (
            <div onClick={this.getCursorPosition} id="discoClub">
                <div id="discoCosmoPicContainer">
                    <img src={require('../images/discoCosmo.png')} id="discoCosmoPic" alt="Disco Cosmo" />
                </div>

                <audio controls autoPlay loop hidden id="audio">
                    <source src={Audio} type="audio/mpeg" />
                </audio>
                {this.state.showImage && (
                    <div id='loadingGifDCDiv'>

                        <img src={require(`../images/gif/DiscoCosmoInstruction.GIF`)} id='DCloadingGIF' />

                    </div>
                )}
                <div id="clubNameDiv">

                    <p id="raveName">
                        {this.state.raveName}
                    </p>
                </div>
                <div id="discoClubPlayers">
                    {this.state.players}
                </div>
                <button id="DiscoExit" onClick={() => { window.location.assign(`${REACT_URL}/ClanVillage?Clan_Name=${clan_Name}`) }}>
                    <p style={{ margin: '0%', textAlign: 'center' }}>Exit </p>
                </button>
                {this.state.showAuthorised && (
                    <img src={require("../images/discoMonster.PNG")} id="discoMonster" onClick={this.mysteryChest} />
                )}
                {this.state.showGold && (
                    <div id="getGold">{this.state.getGold}</div>
                )}
            </div>

        )
    }
}

export default DiscoClub