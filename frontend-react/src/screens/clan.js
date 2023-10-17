import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/clan.css'
import NavBar from '../components/NavBar'
const API_URL = 'https://monster-cat-world.onrender.com'
const react_url = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id');
const clan = document.getElementById("clans");
var player_username;
let hasRun = false;
let clanDiv = [];
let alert = []

class Clan extends React.Component {
    constructor() {
        super();
        this.state = {
            hasRun: false,
            clanDiv: [],
            alert: []
        }

    }
    componentDidMount() {
        if (hasRun == false) {
            hasRun = true;
            axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
                .then((result) => {
                    //save player username
                    player_username = result.data.player_username
                    //rename url 
                    const redirectUrl = `${API_URL}/clan.html?${result.data.player_username}`
                    window.history.replaceState(null, "New Page Title", `/Clan?${result.data.player_username}`)
                    //getAllClans()
                    this.getAllClans();
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    //getAllClans player_id is in
    getAllClans() {
        console.log(player_id)
        axios.post(`${API_URL}/api/clanDetails/getAllClans/${player_id}`)
            .then((response) => {
                const clan = document.getElementById("clans")
                // for each clans that player_id is in append 
                response.data.forEach((clanData) => this.createClanInfo(clanData))
                if (response.data.length < 4) {
                    for (let x = (4 - response.data.length); x > 0; x--) {
                        //if player hasn't join 4 clans, encourage them to join by putting a plus button
                        //and linking them to the join clan page
                        clanDiv.push(
                            <div class="clanDiv">
                                <i class="fa fa-plus" id="clanPlus" onClick={() => { this.goClanRequest() }}></i>
                                <p id="joinAClan" onClick={() => { this.goClanRequest() }}>Join a Clan</p>
                            </div>)
                    }
                    this.setState({
                        clanDiv: clanDiv
                    })
                }
                this.setState({ clanDiv: clanDiv })
            })
            .catch((error) => {
                console.log(error)
            })

    }

    //append info
    createClanInfo(clanData) {


        //different functions for different things
        //if clan is created by player_id, they can delete the clan
        if (clanData.CreatedBy == player_id) {
            clanDiv.push(<div class="clanDiv" id={`clanDiv${clanData.ClanID}`}>
                <div class="clanInfo">
                    <div class="clanDetails">
                        <p class="clanName">Clan Name: <span>{clanData.ClanName}</span></p>
                        <p class="clanType">Clan Type: <span>{clanData.ClanType}</span></p>
                        <p class="clanPoints">Clan Points: <span>{clanData.clan_point}</span></p>
                        <p class="clanRole">Clan Role: <span> {clanData.PlayerRole}</span></p>
                    </div>
                    <button class="members" onClick={() => { this.deleteClan(clanData.ClanName, clanData.ClanID) }}>Delete Clan</button>
                    <button class="goClan" onClick={() => { this.goToClan(clanData.ClanName) }}>Go to Clan</button>
                </div>
            </div>
            )
        }
        //if it is not created by player_id then players can unjoin them
        else {
            clanDiv.push(
                <div class="clanDiv" id={`clanDiv${clanData.ClanID}`}>
                    <div class="clanInfo">
                        <div class="clanDetails">
                            <p class="clanName">Clan Name: <span>{clanData.ClanName}</span></p>
                            <p class="clanType">Clan Type: <span>{clanData.ClanType}</span></p>
                            <p class="clanPoints">Clan Points: <span>{clanData.clan_point}</span></p>
                            <p>Clan Role: <span> {clanData.PlayerRole}</span></p>
                        </div>
                        <button class="members" onClick={() => this.unjoinClan(clanData.ClanName, clanData.ClanID)}>Unjoin Clan</button>
                        <button class="goClan" onClick={() => this.goToClan(clanData.ClanName)}>Go to Clan</button>
                    </div>
                </div>

            )
        }


    }


    //unjoining of clans for members
    unjoinClan(ClanName, ClanID) {
        //ask if they really want to unjoin
        alert.push(
            <div id="alert-unjoin">
                <p>
                    Are you sure you want to unjoin '{ClanName}' ?
                </p>
                <button id="yesUnjoin" class="unjoin" onClick={() => this.yesUnjoin(ClanID)}>yes</button>
                <button id="noUnjoin" class="unjoin" onClick={() => this.noUnjoin()}>no</button>
            </div>
        )
        this.setState({ alert: alert })
    }

    //deleting of clans by clan creator
    deleteClan(ClanName, ClanID) {
        //prompt if they really want to delete
        alert.push(
            <div id="alert-unjoin">
                <p>
                    Are you sure you want to delete '{ClanName}' ?
                </p>
                <button id="yesUnjoin" class="unjoin" onClick={() => this.yesDelete(ClanID)}>yes</button>
                <button id="noUnjoin" class="unjoin" onClick={() => this.noDelete()}>no</button>
            </div>
        )
        this.setState({ alert: alert })
    }


    // confirm unjoin
    yesUnjoin(ClanID) {
        // delete player_id
        axios.delete(`${API_URL}/api/clanDetails/unjoinClan/${ClanID}/${player_id}`)
            .then((result) => {
                console.log(document.getElementById(`clanDiv${ClanID}`));
                //remove clanDiv
                document.getElementById(`clanDiv${ClanID}`).remove();
                //add join a clan to encourage players to join a clan
                this.setState({ alert: [] })
                //add new clanDiv to ask players if they want to join clan
                clanDiv.push(<div class="clanDiv">
                    <i class="fa fa-plus" id="clanPlus" onClick={() => this.goClanRequest()}></i>
                    <p id="joinAClan" onClick={() => this.goClanRequest()}>Join a Clan</p>
                </div>)
                this.setState({ clanDiv: clanDiv })
                return;
            })
            .catch((error) => {
                console.log(error)
                return;
            })
    }


    noUnjoin() {
        //remove alert since say no    
        this.setState({ alert: [] })
        return;
    }

    //delete clan created
    yesDelete(ClanID) {
        console.log('ClanID' + ClanID);
        //delete clan
        axios.delete(`${API_URL}/api/clanDetails/deleteClan/${ClanID}`)
            .then((result) => {
                console.log(result);
                //remove the div
                document.getElementById(`clanDiv${ClanID}`).remove();
                //remove alert
                this.setState({ alert: [] })
                //add new clanDiv that asks if players wants to create a clan
                clanDiv.push(<div class="clanDiv">
                    <i class="fa fa-plus" id="clanPlus" onClick={() => this.goClanRequest()}></i>
                    <p id="joinAClan" onClick={() => this.goClanRequest()}>Create a Clan</p>
                </div>)
                this.setState({ clanDiv: clanDiv })
                return;
            })
            .catch((error) => {
                console.log(error)
                return;
            })
    }

    //remove alert if they decide to not join clan
    noDelete() {
        this.setState({ alert: [] })
        return;
    }






    //just some location assign

    goToClan(clanName) {
        window.location.assign(`${react_url}/ClanVillage?Clan_Name=${clanName}`);
    }
    goClanRequest() {
        window.location.assign(`${react_url}/legacy/ClanRequest.html`);
    }


    render() {
        return (

            <div >
                <NavBar />
                <div className="clanMain">
                    <div id="clanDiv">

                        <div id="clans">
                            {this.state.clanDiv}
                        </div>
                    </div>

                    <div id="alert">
                        {this.state.alert}
                    </div>
                </div>
            </div>
        )
    }
}

export default Clan;