import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/createClan.css';
import ExtraChar from '../images/extraChar2.PNG'
const API_URL = 'https://monster-cat-world.onrender.com'

const player_id = localStorage.getItem('player_id');


//clanName.onchange = checkClanExists;

function CreateClan() {

    const [exceed, setExceed] = useState('');
    const [spanExceed, setSpan] = useState('');
    const [clanNameError, setclanNameError] = useState('');
    const [radioError, setRadioError] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
            .then((result) => {
                console.log(result);
                //add player_username to url
                const player_username = result.data.player_username
                const redirectUrl = `${API_URL}/createClan.html?${player_username}`
                window.history.replaceState(null, "New Page Title", `/createClan?${player_username}`)

                //check how many clans player has joined first
                if (checkNoOfClans()) {
                    //then check how many clans they have created
                    checkClan();
                }

            })
            .catch((error) => {
                console.log(error);
            })


    }, [])

    //each player can only create up to 2 clans
    function checkClan() {
        const exceedText = document.getElementById('createExceedText');
        axios.get(`${API_URL}/api/clanDetails/clanCreatedBy/${player_id}`)
            .then((result) => {
                if (result.data.length == 2) {
                    //append alert text
                    document.getElementById('createExceedText').style.backgroundColor = ` rgb(255, 72, 0)`;
                    setExceed('Sorry you have exceeded the number of clans created.');
                    setSpan('You will not be allowed to create anymore clans.')
                    //disable everything that can be inputted
                    document.getElementById("clanNameInput").disabled = true;
                    document.getElementById("privateCreateOpt").disabled = true;
                    document.getElementById("publicCreateOpt").disabled = true;
                    document.getElementById("createClanSubmit").disabled = true;
                    //setTimeout to make alert text disappear
                    setTimeout(() => {
                        setExceed('');
                        setSpan('');
                        exceedText.style.backgroundColor = ''
                    }, 5000)
                    return;
                }

            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }

    //check if clan name exists 
    //this is onchange
    function checkClanExists() {
        const clanName = document.getElementById("clanNameInput")
        setclanNameError('');
        clanName.style.border = "1px solid black";

        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/api/clanDetails/getClanID/${clanName.value}`)
                .then((result) => {
                    console.log(result.data.ClanID);
                    if (result.data.ClanID != null) {
                        // If exists, show error with red border
                        setclanNameError('Clan name exists');
                        clanName.style.border = "2px solid red";
                        resolve(true); // Clan name exists
                    }
                    else {
                        resolve(false); // Clan name does not exist
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }


    //createClan 
    function createClan() {
        const clanName = document.getElementById("clanNameInput")
        const exceedText = document.getElementById('createExceedText');
        var typeValue;
        //check which radio button is checked
        var radioButtons = document.querySelectorAll("input[type='radio'][name='type']")
        for (let x = 0; x < radioButtons.length; x++) {
            if (radioButtons[x].checked) {
                typeValue = radioButtons[x].value;
            }
        }
        //if null value, show radioError 
        if (typeValue == null) {
            setRadioError('please select one option');
        }
        //if ok, dont 'show' radioError
        else {
            setRadioError('');
        }
        //if value is empty string, border it and alert player
        if (clanName.value == '') {
            clanName.style.border = "2px solid red";
        }
        //no error
        else {
            clanName.style.border = "1px solid black";
        }
        //Tell player that they need to fill iup inputs
        if (clanName.value == '' || typeValue == null) {
            window.alert("Please fill up all inputs.")
            return;
        }
        checkClanExists().then((clanExists) => {
            if (clanExists) {
                exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
                setExceed(`Clan name exists`);
                setTimeout(() => {
                    setExceed('')
                    exceedText.style.backgroundColor = "";
                }, 5000);
                return;
            } else {

                const bodyData = {
                    "ClanName": clanName.value,
                    "ClanType": typeValue
                }


                axios.post(`${API_URL}/api/clanDetails/createClan/${player_id}`, bodyData)
                    .then((result) => {
                        console.log(result);
                        clanName.style.border = "1px solid black";
                        setRadioError('')
                        window.alert(`'${clanName.value}' has been created! You get free 15 clan points!`);
                        //once create check if players have exceeded no of clans created/joined
                        //in case they want too creat eanother one
                        if (checkNoOfClans()) {
                            checkClan();
                        }
                        //remove all values
                        clanName.value = ''
                        var radioButtons = document.querySelectorAll("input[type='radio'][name='type']")
                        for (let x = 0; x < radioButtons.length; x++) {
                            radioButtons[x].checked = false;
                        }
                        //give clans created by players 15 clan points as welcome gift
                        const bodydata2 = {
                            "clan_point": 15
                        }
                        axios.put(`${API_URL}/api/clanDetails/updateClanPoints/${result.data.insertId}`, bodydata2)
                            .then((result) => {
                                console.log(result)
                            })
                            .catch((error) => {
                                console.log(error);
                                return;
                            })
                    })

                    .catch((error) => {
                        if (error.response.status == 400) {
                            exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
                            setExceed(`Please fill up all inputs`);
                            setTimeout(() => {
                                setExceed('')
                                exceedText.style.backgroundColor = "";
                            }, 5000);
                        }
                        console.log(error);
                        return;

                    })

            }
        })
            .catch((error) => {
                console.log(error);
                return;

            })



    }

    //check number of clans player has joined
    function checkNoOfClans() {
        const exceedText = document.getElementById('createExceedText');
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/api/ClanDetails/getAllClans/${player_id}`)
                .then((result) => {
                    if (result.data.length >= 4) {
                        //if length exceeds or equals four, no more joining clans
                        //show exceedText again
                        exceedText.style.backgroundColor = `rgb(255, 72, 0)`;
                        setExceed(`Sorry, you have exceeded the number of clans joined.`)
                        setSpan(`Unjoin a clan to create a new clan.`);
                        //disable all buttons
                        document.getElementById("clanNameInput").disabled = true;
                        document.getElementById("privateCreateOpt").disabled = true;
                        document.getElementById("publicCreateOpt").disabled = true;
                        //make exceedText not seen after 5s
                        setTimeout(() => {
                            setExceed('');
                            setSpan('');
                            exceedText.style.backgroundColor = "";
                        }, 5000);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }


    return (
        <div id="createClan">
            <NavBar />
            <div className="createClanForm">
                <p id="createExceedText">{exceed}< span style={{ display: "block", marginTop: "10px" }} >{spanExceed}</span></p>
                <img src={ExtraChar} id="clanImage" />
                <p className="text-center" id="createClanText">Create Clan</p>
                <div className="createInputs" >
                    <label for="ClanName" className="mainLabel" id="createNameLabel">Clan Name:</label>
                    <input type="text" className="form-control" id="clanNameInput" onChange={()=>{checkClanExists()}}/>
                    <p className="error" id="clanNameError">{clanNameError}</p>
                </div>
                <p className="createClanError" id="clanNameError"></p>
                <div className="createInputs" id="clanTypeInput">
                    <label for="" id="typeLabel" className="mainLabel">Clan Type:</label>
                    <div id="privateClass">
                        <input type="radio" className="radio" id="privateCreateOpt" name="type" value="private" />
                        <label for="opt1" className="labelRadio">Private</label>
                    </div>
                    <div id="publicClass">
                        <input type="radio" className="radio" id="publicCreateOpt" name="type" value="public" />
                        <label for="opt2" className="labelRadio">Public</label>
                    </div>
                    <p className="createClanError" id="radioCreateError">{radioError}</p>
                </div>

                <button id="createClanSubmit" type="button" onClick={() => createClan()}>Create</button>
            </div>

        </div>
    )
}


export default CreateClan

