import React, { Component, useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import axios from 'axios';
import ContributionBar from "../components/contributionChart.js";
import SpendingBar from "../components/spendingChart.js";
import EarnedDateLineChart from '../components/earnDateLineChart.js'
import SpentDateLineChart from '../components/spentDateLineChart.js'
import '../css/clanData.css';
import LoadingGif from "../images/dataLoading.gif";
import Loading2Gif from "../images/gif/loading2.gif";
import LoadingInstructions from "../images/gif/InstructionGifClanData.gif"
var invertedMonth = ["December", "November", "October", "Septemeber", "August", "July", "June", "May", "April", "March", "February", "January"]
const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var allMembersArr = [];
const API_URL = 'https://monster-cat-world.onrender.com';
var REACT_URL = 'https://monster-cat-world.onrender.com';
if (window.location.hostname === 'localhost' && window.location.port === '3001') {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
const queryParams = new URLSearchParams(window.location.search);
const clan_Name = queryParams.get('Clan_Name');
const player_id = localStorage.getItem('player_id');
var ClanID;
var player_idRole = ''

let run = false;

function ClanData() {
    const [showAllPlayers, setPlayers] = useState('');
    const [playersDate, setDatePlayers] = useState('');
    const [playersSpent, setPlayersSpent] = useState('');
    const [clickOut, setClickOut] = useState(true);
    const [clanName, setClanName] = useState('');
    const [labelText, setlabelText] = useState('Overall Clan Member Contribution');
    const [contributionData, setContributionData] = useState([]);
    const [contributionLabel, setContributionLabel] = useState([]);
    const [alertPlayer, setAlertPlayer] = useState([]);
    const [dateText, setdateText] = useState('Dates played by Clan Members this month');
    const [spentDateText, setSpentDateText] = useState('Dates spent by Clan Members this month');
    const [AvgText, setAvgText] = useState(0);
    const [TotalText, SetTotalText] = useState(0);
    const [NoMembers, setNoMembers] = useState(0);
    const [Topmember, setTopMember] = useState(0);
    const [clanLoad, setClanLoad] = useState(false);
    const [chartData, setChartData] = useState({
        labels: contributionLabel,
        datasets: [
            {
                label: "Clan Members Contribution",
                data: contributionData,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                labelColor: "white",
                borderWidth: 2,
                barPercentage: 0.6,
            }
        ]
    });
    const [chartData2, setChartData2] = useState({
        labels: contributionLabel,
        datasets: [
            {
                label: "Clan Members Contribution",
                data: contributionData,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                labelColor: "white",
                borderWidth: 2,
                barPercentage: 0.6, // Adjust this value to change the width of the bars
                // categoryPercentage: 0.8 
            }
        ]
    });
    const [lineData, setLineData] = useState({
        labels: contributionLabel,
        datasets: [
            {
                label: "Clan Members Contribution",
                data: contributionData,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                labelColor: "white",
                borderWidth: 2,
            }
        ]
    });
    const [lineData2, setLineData2] = useState({
        labels: contributionLabel,
        datasets: [
            {
                label: "Clan Members Contribution",
                data: contributionData,
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                labelColor: "white",
                borderWidth: 2,
                barPercentage: 0.6,
            }
        ]
    });




    useEffect(() => {
        setChartData({
            labels: contributionLabel,
            datasets: [
                {
                    data: contributionData,
                    backgroundColor: [
                        "#191970",
                        "#000080",
                        "#1434A4",
                        "#0047AB",
                        "#0437F2",
                        "#4169E1",
                        "#6495ED",
                        "#87CEEB",
                        "#89CFF0",
                        "#ADD8E6",
                    ],
                    borderColor: "black",
                    borderWidth: 1,
                    barPercentage: 0.7,
                }
            ]
        });
        document.getElementById('clanDataLoading').style.opacity = 0
    }, [contributionData, contributionLabel]);



    useEffect(() => {
        document.getElementById('clanDataLoading').style.opacity = 1
        if (run == false) {
            setClanName(clan_Name)
            //check if player belongs to clan
            axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
                .then((response) => {
                    if (response.data.ClanID == null) {
                        window.location.assign(`${API_URL}/Clan?${player_id}`);
                    }
                    ClanID = response.data.ClanID;
                    axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                        .then((result) => {
                            if (result.data.length != 0 && (result.data[0].PlayerRole == 'leader' || result.data[0].PlayerRole == 'coleader')) {
                                player_idRole = result.data[0].PlayerRole;
                                Promise.all([getClanPointContribution(), getClanPointSpending(), getEarnedByDate(), getBasicData(), getAllMembers(), getSpentByDate()])
                                    .then(([]) => {

                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })

                            }
                            else {
                                window.location.assign(`${REACT_URL}/ClanDashboard?Clan_Name=${clan_Name}`)
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
    }, [])

    function getBasicData() {
        //get average, total, no of contribution qnd top contributor
        Promise.all([
            axios.get(`${REACT_URL}/api/ClanDetails/getAvgClanPointsFromGame/${ClanID}`),
            axios.get(`${REACT_URL}/api/ClanDetails/getTotalClanPointsFromGame/${ClanID}`),
            axios.get(`${REACT_URL}/api/ClanDetails/noOfMembers/${ClanID}`),
            axios.get(`${REACT_URL}/api/ClanDetails/topContribution/${ClanID}`),

        ])
            .then(([avgPoints, totalPoints, NoMembers, topMember]) => {
                console.log(totalPoints);
                console.log(NoMembers);
                console.log(topMember)
                var average = 0
                if (avgPoints.data.avgPoints != null) {
                    average = Math.round(parseInt(avgPoints.data.avgPoints) * 10) / 10
                }
                setAvgText(average);
                SetTotalText(totalPoints.data.points);
                setNoMembers(NoMembers.data[0].no_of_members);
                setTopMember(topMember.data.topPlayerEarned)
            })
            .catch((error) => {
                console.log(error)
            })

    }

    function contributionDropDown(e) {
        document.getElementById('clanDataLoading').style.opacity = 1
        var dateNow = new Date();
        var nowMonth = dateNow.getMonth();
        var nowYear = dateNow.getFullYear();
        var nowDate = dateNow.getDate();
        var todayDay = dateNow.getDay();
        var monthsArr = [];
        var bodyData = {
            "": ""
        }
        //for the different values of the dropdown
        if (e.target.value == "last3Months" || e.target.value == "last6Months") {
            bodyData = {
                month: e.target.value
            }
            if (e.target.value == "last3Months") {
                for (let x = 0; x < 3; x++) {
                    var lastMonth = []
                    if (nowMonth - 6 < 0) {
                        monthsArr.push(invertedMonth[-(nowMonth - 5)])
                    }
                    else {
                        monthsArr.push(monthArr[nowMonth - 2]);
                    }

                    nowMonth++;
                }

                setlabelText(`Clan Member Contribution for ${monthsArr.join()}`)
            }
            else {
                for (let x = 0; x < 6; x++) {
                    var lastMonth = []
                    if (nowMonth - 6 < 0) {
                        monthsArr.push(invertedMonth[-(nowMonth - 5)])
                    }
                    else {
                        monthsArr.push(monthArr[nowMonth - 5]);
                    }
                    console.log(new Date())


                    nowMonth++;
                }

                setlabelText(`Clan Member Contribution for ${monthsArr.join()}`)
            }
        }
        else if (e.target.value == "week") {
            bodyData = {
                date: e.target.value
            }
            setlabelText(`Clan Member Contribution for the past 7 days`)
        }
        else if (e.target.value == "yearly") {
            bodyData = {
                year: e.target.value
            }
            setlabelText(`Clan Member Contribution for this year`)
        }


        Promise.all([getClanPointContribution(bodyData), getClanPointSpending(bodyData)])
            .then((result) => {

            })
            .catch((error) => {
                console.log(error)
            })

    }

    function getClanPointContribution(bodyData) {
        console.log(bodyData)
        Promise.all(
            [
                axios.get(`${REACT_URL}/api/ClanDetails/getTotalClanPointsFromGame/${ClanID}`),
                axios.post(`${REACT_URL}/api/ClanDetails/getClanPointsContribution/${ClanID}`, bodyData),
            ])
            .then(([totalClanPoints, result]) => {
                var data = [];
                var label = []
                result.data.forEach(element => {
                    data.push(element.clan_points_earned)
                    label.push(element.player_username)
                });
                setContributionData(data)
                setContributionLabel(label);
                return totalClanPoints.data.points;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function getClanPointSpending(bodyData) {
        axios.post(`${REACT_URL}/api/ClanDetails/clanPointsSpent/${ClanID}`, bodyData)
            .then((memberSpent) => {
                var spendingData = [];
                var label = []
                memberSpent.data.forEach((result) => {
                    spendingData.push(
                        result.clan_points_spent
                    )
                    label.push(
                        result.player_username
                    )

                })
                console.log(spendingData)
                setChartData2({
                    labels: label,
                    datasets: [
                        {
                            label: "Clan Members Contribution",
                            data: spendingData,
                            backgroundColor: [
                                "#191970",
                                "#000080",
                                "#1434A4",
                                "#0047AB",
                                "#0437F2",
                                "#4169E1",
                                "#6495ED",
                                "#87CEEB",
                                "#89CFF0",
                                "#ADD8E6",
                            ],
                            borderColor: "black",
                            labelColor: "white",
                            borderWidth: 2,
                            barPercentage: 0.6, // Adjust this value to change the width of the bars
                            // categoryPercentage: 0.8 
                        }
                    ]
                })

            })
            .catch((error) => {
                console.log(error)
            })
    }


    function lineDropDown(e) {
        document.getElementById('clanDataLoading').style.opacity = 1
        console.log(e.target.value);
        getEarnedByDate(e.target.value);
    }

    function getEarnedByDate(value) {
        var dateNow = new Date();
        var nowMonth = dateNow.getMonth();
        var nowDate = dateNow.getDate();
        var monthsArr = []
        var bodyData = {
            thisMonth: nowMonth + 1
        }
        setdateText('Dates played by Clan Members this month')

        if (value != null) {
            if (value == "thisweek") {
                bodyData = {
                    thisweek: nowDate
                }
                setdateText('Dates played by Clan Members for the past 7 days')
            }
            else if (value == "last3week") {
                bodyData = {
                    last3week: nowDate
                }

                setdateText('Dates played by Clan Members last 3 weeks')
            }
            else if (value == "last3Months") {
                bodyData = {
                    last3Months: nowDate
                }
                for (let x = 0; x < 3; x++) {
                    var lastMonth = []
                    if (nowMonth - 6 < 0) {
                        monthsArr.push(invertedMonth[-(nowMonth - 5)])
                    }
                    else {
                        monthsArr.push(monthArr[nowMonth - 2]);
                    }

                    nowMonth++;
                }
                setdateText('Dates played by Clan Members last 3 months')
            }

        }
        axios.post(`${REACT_URL}/api/clanDetails/getClanPointsByDate/${ClanID}`, bodyData)
            .then((result) => {
                setLineData({
                    labels: result.data.Date,
                    datasets: [
                        {
                            label: "Clan Members Contribution",
                            data: result.data.points_earned,
                            backgroundColor: [
                                "#191970",
                                "#000080",
                                "#1434A4",
                                "#0047AB",
                                "#0437F2",
                                "#4169E1",
                                "#6495ED",
                                "#87CEEB",
                                "#89CFF0",
                                "#ADD8E6",
                            ],
                            borderColor: "black",
                            labelColor: "white",
                            borderWidth: 2,
                            barPercentage: 0.6, // Adjust this value to change the width of the bars
                            // categoryPercentage: 0.8 
                        }
                    ]
                })
                var playerData = []
                var resultPlayer = result.data.playersDate

                for (let x = 0; x < resultPlayer.length; x++) {
                    var playersInfoArr = []
                    for (let y = 0; y < resultPlayer[x][0].playersDate.length; y++) {
                        playersInfoArr.push(resultPlayer[x][0].playersDate[y] + ' (' + resultPlayer[x][0].pointsEarnedEach[y] + 'pts) ')
                    }
                    playerData.push({ additionalInfo: playersInfoArr })
                }
                setDatePlayers(playerData);
                document.getElementById('clanDataLoading').style.opacity = 0

            })
            .catch((error) => {
                console.log(error);
            })
    }

    function lineSpentDropDown(e) {
        document.getElementById('clanDataLoading').style.opacity = 1
        getSpentByDate(e.target.value);
    }

    function getSpentByDate(value) {
        var dateNow = new Date();
        var nowMonth = dateNow.getMonth();
        var nowDate = dateNow.getDate();
        var monthsArr = [];
        var bodyData = {
            thisMonth: nowMonth + 1
        }
        setSpentDateText('Dates spent by Clan Members this month')

        if (value != null) {
            if (value == "thisweek") {
                bodyData = {
                    thisweek: nowDate
                }
                setSpentDateText('Dates spent by Clan Members for the past 7 days')
            }
            else if (value == "last3week") {
                bodyData = {
                    last3week: nowDate
                }
                setSpentDateText('Dates spent by Clan Members last 3 weeks')
            }
            else if (value == "last3Months") {
                bodyData = {
                    last3Months: nowDate
                }
                for (let x = 0; x < 3; x++) {
                    var lastMonth = []
                    if (nowMonth - 6 < 0) {
                        monthsArr.push(invertedMonth[-(nowMonth - 5)])
                    }
                    else {
                        monthsArr.push(monthArr[nowMonth - 2]);
                    }

                    nowMonth++;
                }
                setSpentDateText(`Dates spent by Clan Members for ${monthsArr.join()} `)
            }

        }
        axios.post(`${REACT_URL}/api/clanDetails/getClanSpentPointsByDate/${ClanID}`, bodyData)
            .then((result) => {
                setLineData2({
                    labels: result.data.Date,
                    datasets: [
                        {
                            label: "Clan Members Contribution",
                            data: result.data.points_spent,
                            backgroundColor: [
                                "#191970",
                                "#000080",
                                "#1434A4",
                                "#0047AB",
                                "#0437F2",
                                "#4169E1",
                                "#6495ED",
                                "#87CEEB",
                                "#89CFF0",
                                "#ADD8E6",
                            ],
                            borderColor: "black",
                            labelColor: "white",
                            borderWidth: 2,
                        }
                    ]
                })
                var playerData = []
                var resultPlayer = result.data.playersDate

                for (let x = 0; x < resultPlayer.length; x++) {
                    var playersInfoArr = []
                    console.log(resultPlayer[x][0].playersDate.length)
                    for (let y = 0; y < resultPlayer[x][0].playersDate.length; y++) {
                        playersInfoArr.push(resultPlayer[x][0].playersDate[y] + ' (' + resultPlayer[x][0].pointsSpentEach[y] + 'pts) ')
                    }
                    playerData.push({ additionalInfo: playersInfoArr })
                }
                setPlayersSpent(playerData);
                document.getElementById('clanDataLoading').style.opacity = 0

            })
            .catch((error) => {
                console.log(error);
            })
    }


    function getAllMembers() {
        //getting all members
        var loading = document.getElementById('clanDataLoading');
        if (document.getElementById('clanDataLoading').style.opacity == 0 && loading.style.opacity == 0) {
            loading.style.opacity = 1
        }
        var column = document.getElementById(`memberColumn`)
        //for my side button div
        if (clickOut == false) {
            column.style.transform = 'translate3d(-180px, 0px,0px)';
            setClickOut(true);
        }
        //for my side button div 
        else if (clickOut == true) {
            column.style.transform = 'translate3d(20px, 0px,0px)';
            setClickOut(false);
        }

        //getting all the members
        axios.get(`${REACT_URL}/api/clanDetails/getAllMembers/${clan_Name}`)
            .then((result) => {
                var playerArr = [];
                allMembersArr = result.data;
                if (result.data.length != 0) {
                    var count = 0
                    result.data.forEach((data) => {
                        count++;
                        //if player role not leader or co-leader (kick)
                        if (data.player_id == player_id) {
                            if (!(data.PlayerRole == 'leader' || data.PlayerRole == 'coleader')) {
                                window.location.assign(`${REACT_URL}/ClanDashboard?Clan_Name=${clan_Name}`)
                            }
                        }
                        var date = new Date(data.date_joined);
                        var formattedDate = date.getDate().toString().padStart(2, 0) + '/' + (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getFullYear();

                        var backgroundColor = 'rgb(0,216,254)';
                        var buttonText = 'Kick'
                        var memberUsername = data.player_username
                        //different background color and button for player_id;
                        if (data.player_id == player_id) {
                            backgroundColor = '#f1d32b';
                            memberUsername = 'You'
                            buttonText = 'Leave'
                        }

                        var playerAvatar = data.image_path.split('./images/');
                        //coleaders are not allowed to kick the leader or change their leader's role
                        if (player_idRole == 'coleader' && data.PlayerRole == 'leader') {
                            playerArr.push(
                                <div class="divMember" style={{ backgroundColor: `${backgroundColor}` }}>
                                    <img src={require(`../images/` + playerAvatar[1])} className="dataMember" id={`dataMember${data.player_id}`} />

                                    <div>
                                        <p className="dataMemberName">{memberUsername}</p>
                                        <p className="dataMemberRole">({data.PlayerRole})</p>
                                        <p className="dataMemberRole">Joined:{formattedDate}</p>

                                    </div>
                                </div>
                            )
                        }
                        //move coleader div to the second row if player is coleader (just some design)
                        else if (player_idRole == 'coleader' && count == 3 && data.player_id == player_id) {
                            playerArr.splice(1, 0, <div class="divMember" style={{ backgroundColor: `${backgroundColor}` }}>
                                <img src={require(`../images/` + playerAvatar[1])} className="dataMember" id={`dataMember${data.player_id}`} />

                                <div>
                                    <p className="dataMemberName">{memberUsername}</p>
                                    <p className="dataMemberRole">({data.PlayerRole})</p>
                                    <p className="dataMemberRole">Joined:{formattedDate}</p>
                                    <div id={`functionButtons${data.player_id}`}>
                                        <button className='changePlayerButton' id="smallDiv" onClick={() => enableChange(data)}>Change Role</button>
                                        <button className='kickPlayerButton' onClick={() => enableKick(data)}>{buttonText}</button>
                                    </div>

                                </div>
                            </div>)
                        }
                        else {
                            //for the rest of the players
                            playerArr.push(
                                <div class="divMember" style={{ backgroundColor: `${backgroundColor}` }}>
                                    <img src={require(`../images/` + playerAvatar[1])} className="dataMember" id={`dataMember${data.player_id}`} />

                                    <div>
                                        <p className="dataMemberName">{memberUsername}</p>
                                        <p className="dataMemberRole">({data.PlayerRole})</p>
                                        <p className="dataMemberRole">Joined:{formattedDate}</p>
                                        <div id={`functionButtons${data.player_id}`}>
                                            <button className='changePlayerButton' id="smallDiv" onClick={() => enableChange(data)}>Change Role</button>
                                            <button className='kickPlayerButton' onClick={() => enableKick(data)}>{buttonText}</button>
                                        </div>

                                    </div>
                                </div>
                            )
                        }


                    })

                    setPlayers(playerArr)
                    var loading = document.getElementById('clanDataLoading');
                    loading.style.opacity = 0;
                }
                return;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function enableChange(data) {
        var playerIndex = allMembersArr.findIndex(element => element.player_id == player_id);
        var playerData = allMembersArr[playerIndex];
        let leaderOption = ``;
        let coleaderOption = ``;
        let memberOption = ``;
        //for dropdown design, basically the player's role will be the selected one
        if (data.PlayerRole == 'leader') {
            leaderOption = `selected="selected"`
        }
        else if (data.PlayerRole == 'coleader') {
            coleaderOption = `selected="selected"`
        }
        else if (data.PlayerRole == 'member') {
            memberOption = `selected="selected"`
        }
        if (playerData.PlayerRole == 'leader') {

            //making the dropdown for leaders
            document.getElementById(`functionButtons${data.player_id}`).innerHTML = `                                   
            <select name="options" id="optionsRole${data.player_id}" class="optionsRole">
            <option value="leader" ${leaderOption}>Leader</option>
            <option value="coleader" ${coleaderOption}>Coleader</option>
            <option value="member" ${memberOption}>Member</option>
            </select>
            <button class="confirimRoleOptions" id="confirmRole${data.player_id}" >Confirm</button>
            `
        }
        else {
            //dropdown for coleaders because they are not allowed to change any player to leader or leader to any role
            document.getElementById(`functionButtons${data.player_id}`).innerHTML = `                                   
        <select name="options" id="optionsRole${data.player_id}" class="optionsRole"  >
        <option value="coleader" ${coleaderOption}>Co-Leader</option>
        <option value="member" ${memberOption}>Member</option>
        </select>
        <button class="confirimRoleOptions"  id="confirmRole${data.player_id}" >Confirm</button>
        `
        }



    }


    function changeRole(member_id) {
        //officially change role
        setAlertPlayer('')
        var membersIndex = allMembersArr.findIndex(element => element.player_id == member_id);
        var playerIndex = allMembersArr.findIndex(element => element.player_id == player_id);
        var data = allMembersArr[membersIndex]
        var selectedOption = document.getElementById(`optionsRole${member_id}`).value
        var alertPlayer = [];
        axios.get(`${REACT_URL}/api/ClanDetails/countPlayersRoles/${ClanID}`)
            .then((result) => {
                console.log(result);
                var numberOfLeaders = result.data[0].noLeaders;
                var numberOfCoLeaders = result.data[0].nocoLeaders;
                var numberOfMembers = result.data[0].noMember;
                var playersRole = allMembersArr[playerIndex].PlayerRole;
                //state
                if (playersRole == 'leader') {
                    //for if leader becomes membeer
                    if (selectedOption == 'member' && data.player_id == player_id) {
                        var chooseLeader = [];
                        allMembersArr.forEach((element) => {
                            if (element.player_id != player_id) {
                                chooseLeader.push(<option value={element.player_id}>{element.player_username}</option>)
                            }
                        })

                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px', top: '100px' }}>
                                <p id="AreYouSure">Are you sure?</p>
                                <p>You chose to be a member.</p>
                                <p>You won't be the leader if you change and</p>
                                <p>you will not be able to access this page anymore</p>
                                <p style={{ marginBottom: '2%' }}>Choose a leader: </p>
                                <select style={{ display: 'block', marginBottom: '3%' }} id='selectNewLeader'>
                                    {chooseLeader}
                                </select>
                                <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                            </div>)
                        setAlertPlayer(alertPlayer)
                    }
                    //for if chooses someone else to be leader
                    else if (selectedOption == 'leader' && data.player_id != player_id) {

                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p id="AreYouSure">Are you sure?</p>
                                <p>Assigning {data.player_username} as a leader will removed you as a leader</p>
                                <p>You will become a member and won't be able to access this page anymore.</p>
                                <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                            </div>)
                        setAlertPlayer(alertPlayer)
                    }
                    //for if choose member role for a current coleader
                    else if (selectedOption == 'member' && data.PlayerRole == 'coleader') {
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p>You are removing {data.player_username}'s role as coleader</p>
                                <p>They will become a member and won't be able to access this page anymore.</p>
                                <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                            </div>)
                        setAlertPlayer(alertPlayer)
                    }
                    //only two coleaders allowed!!
                    if (parseInt(numberOfCoLeaders) != 2) {
                        //if leader becomes coleader
                        if (selectedOption == 'coleader' && data.player_id == player_id) {
                            var chooseLeader = [];
                            allMembersArr.forEach((element) => {
                                if (element.player_id != player_id) {
                                    chooseLeader.push(<option value={element.player_id}>{element.player_username}</option>)
                                }
                            })
                            alertPlayer.push(
                                <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                    <p id="AreYouSure">Are you sure?</p>
                                    <p>You will lose your leader status to be a coleader.</p>
                                    <p style={{ marginBottom: '2%' }}>Choose a leader: </p>
                                    <select style={{ display: 'block', marginBottom: '3%' }} id='selectNewLeader'>
                                        {chooseLeader}
                                    </select>
                                    <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                    <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                                </div>)
                            setAlertPlayer(alertPlayer)
                        }
                        //if member becomes coleader
                        else if (selectedOption == 'coleader' && data.PlayerRole != 'coleader') {
                            alertPlayer.push(
                                <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                    <p>You have chosen {data.player_username} to be {clan_Name}'s coleader</p>
                                    <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                    <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                                </div>)
                            setAlertPlayer(alertPlayer)
                        }

                    }
                    else {
                        //already have 2 coleaders!!
                        if (selectedOption == 'coleader' && selectedOption != data.PlayerRole) {

                            alertPlayer.push(
                                <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                    <p id="AreYouSure">Already have 2 coleaders!</p>
                                    <p>Each Clan can only have 2 coleaders.</p>
                                </div>)
                            setAlertPlayer(alertPlayer)
                            setTimeout(() => {
                                setPlayers([]);
                                getAllMembers();
                                changeColumn();
                                setAlertPlayer('');
                            }, 3000)

                        }
                    }
                    //if selected option for player is same as player's id
                    if (selectedOption == data.PlayerRole && data.player_id == player_id) {

                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p style={{ textAlign: 'center' }}>You are already a {selectedOption}</p>
                            </div>)
                        setAlertPlayer(alertPlayer)
                        setTimeout(() => {
                            setPlayers([]);
                            setAlertPlayer('');
                            getAllMembers();
                            changeColumn();
                        }, 3000)
                    }
                    //if selected option for player is same as their current role
                    else if (selectedOption == data.PlayerRole) {
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p style={{ textAlign: 'center' }}>{data.player_username} is already a {selectedOption}</p>
                            </div>)
                        setAlertPlayer(alertPlayer)
                        setTimeout(() => {
                            setPlayers([]);
                            setAlertPlayer('');
                            getAllMembers();
                            changeColumn();
                        }, 3000)
                    }
                }
                //some diffs for coleader
                else if (playersRole == 'coleader') {
                    //change from coleader to memebr for player
                    if (selectedOption == 'member' && data.player_id == player_id) {
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p id="AreYouSure">Are you sure?</p>
                                <p>You chose to be a member.</p>
                                <p>You won't be a coleader anymore if you change.</p>
                                <p>You will not be able to access this page anymore</p>
                                <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                            </div>)
                        setAlertPlayer(alertPlayer)
                    }
                    //change coleaer to member  for tother players
                    else if (selectedOption == 'member' && data.PlayerRole == 'coleader') {
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p>You are removing {data.player_username}'s role as coleader</p>
                                <p>They will become a member and won't be able to access this page anymore.</p>
                                <button onClick={() => { updateRole(data.player_id, selectedOption) }}>Confirm</button>
                                <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                            </div>)
                        setAlertPlayer(alertPlayer)
                    }
                    //if no max 2 coleaders
                    if (parseInt(numberOfCoLeaders) != 2) {
                        //if choose member as cooleader
                        if (selectedOption == 'coleader' && data.PlayerRole != 'coleader') {
                            alertPlayer.push(
                                <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                    <p>You have chosen {data.player_username} to be {clan_Name}'s coleader</p>
                                    <button onClick={(() => { updateRole(data.player_id, selectedOption) })}>Confirm</button>
                                    <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                                </div>)
                            setAlertPlayer(alertPlayer)
                        }

                    }
                    else {
                        //if alr max 2 coleader
                        if (selectedOption == 'coleader' && selectedOption != data.PlayerRole) {
                            setClickOut(false);
                            alertPlayer.push(
                                <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                    <p id="AreYouSure">Already have 2 coleaders!</p>
                                    <p>Each Clan can only have 2 coleaders.</p>
                                </div>)
                            setAlertPlayer(alertPlayer)
                            setTimeout(() => {
                                setPlayers([]);
                                getAllMembers();
                                changeColumn();
                                setAlertPlayer('');
                            }, 3000)


                        }
                    }
                    //if player alr the option role
                    if (selectedOption == data.PlayerRole && data.player_id == player_id) {
                        setClickOut(false);
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p style={{ textAlign: 'center' }}>You are already a {selectedOption}</p>
                            </div>)
                        setAlertPlayer(alertPlayer)
                        setTimeout(() => {
                            setPlayers([]);
                            setAlertPlayer('');
                            getAllMembers()
                            changeColumn();
                        }, 3000)
                    }
                    //if members alr the option role
                    else if (selectedOption == data.PlayerRole) {
                        setClickOut(false);
                        alertPlayer.push(
                            <div id="clanDataAlertDiv" style={{ width: '380px' }}>
                                <p style={{ textAlign: 'center' }}>{data.player_username} is already a {selectedOption}</p>
                            </div>)
                        setAlertPlayer(alertPlayer)
                        setTimeout(() => {
                            setPlayers([]);
                            setAlertPlayer('');
                            getAllMembers();
                            changeColumn();
                        }, 3000)
                    }

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function changeColumn() {
        //moving of column
        var column = document.getElementById(`memberColumn`)
        column.style.transform = 'translate3d(-175px, 0px,0px)';
        setClickOut(true);


    }

    function updateRole(member_id, role) {
        //update role
        const optionsRoleSelect = document.getElementsByClassName("optionsRole")
        const changeRoleSelect = document.getElementsByClassName("changePlayerButton")
        const kickPlayerButton = document.getElementsByClassName("kickPlayerButton")
        const confirimRoleOptions = document.getElementsByClassName("confirimRoleOptions")
        //disable all pressable things while updating (reduce spamming or duplicates)
        if (optionsRoleSelect.length != 0) {
            for (let x = 0; x < optionsRoleSelect.length; x++) {
                optionsRoleSelect[x].disabled = true;
            }
        }
        if (changeRoleSelect.length != 0) {
            for (let x = 0; x < changeRoleSelect.length; x++) {
                changeRoleSelect[x].disabled = true;
            }
        }

        if (kickPlayerButton.length != 0) {
            for (let x = 0; x < kickPlayerButton.length; x++) {
                kickPlayerButton[x].disabled = true;
            }
        }
        if (confirimRoleOptions.length != 0) {
            for (let x = 0; x < confirimRoleOptions.length; x++) {
                confirimRoleOptions[x].disabled = true;
            }
        }

        setClickOut(false);
        setAlertPlayer('');
        setPlayers([]);

        var bodyData = {
            role: role
        }
        //so leaders that change their roles have to select a new leader for the clan
        var selectNewLeader = document.getElementById('selectNewLeader')
        if (selectNewLeader != null) {
            var leader_id = selectNewLeader.value;
            Promise.all([
                axios.put(`${REACT_URL}/api/ClanDetails/changeRole/${ClanID}/${member_id}`, bodyData),
                axios.put(`${REACT_URL}/api/ClanDetails/changeRole/${ClanID}/${leader_id}`, { role: 'leader' }),
            ])
                .then(([response, response1]) => {
                    window.location.assign(`${REACT_URL}/ClanDashboard?Clan_Name=${clan_Name}`);
                })
                .catch((error) => {
                    console.log(error)
                })

        }
        else {
            //update role
            axios.put(`${REACT_URL}/api/ClanDetails/changeRole/${ClanID}/${member_id}`, bodyData)
                .then((result) => {
                    Promise.all([getAllMembers(), changeColumn()])
                        .then((result) => {
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error);
                    return;
                })
        }
    }

    // pre-kick members 
    function enableKick(data) {
        var alertPlayer = []
        if (data.player_id == player_id) {
            // if leader wants to leave
            if (data.PlayerRole == 'leader') {
                var chooseLeader = [];
                allMembersArr.forEach((element) => {
                    if (element.player_id != player_id) {
                        chooseLeader.push(<option value={element.player_id}>{element.player_username}</option>)
                    }
                })

                alertPlayer.push(
                    <div id="clanDataAlertDiv" >
                        <p id="AreYouSure">Are you sure?</p>
                        <p>{clan_Name} would be sad too see you leave...</p>
                        <p style={{ marginBottom: '2%' }}>Choose a leader: </p>
                        <select style={{ display: 'block', marginBottom: '3%' }} id='selectNewLeader'>
                            {chooseLeader}
                        </select>
                        <button onClick={() => { deleteMember(data.player_id) }}>Confirm</button>
                        <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                    </div>)
                setAlertPlayer(alertPlayer)
            }

            else if (data.PlayerRole == 'coleader') {
                alertPlayer.push(
                    <div id="clanDataAlertDiv">
                        <p id="AreYouSure">Are you sure?</p>
                        <p>{clan_Name} would be sad too see you leave...</p>
                        <button onClick={() => { deleteMember(data.player_id) }}>Confirm</button>
                        <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                    </div>)
                setAlertPlayer(alertPlayer)
            }
        }
        else {
            alertPlayer.push(
                <div id="clanDataAlertDiv">
                    <p>You have decided to kick {data.player_username}</p>
                    <button onClick={() => { deleteMember(data.player_id) }}>Confirm</button>
                    <button style={{ marginLeft: '15px' }} onClick={() => cancel()}>Cancel</button>
                </div>)
            setAlertPlayer(alertPlayer)
            setTimeout(() => {
                setAlertPlayer([])
            }, 3000)
        }
    }
    //deleting the member
    function deleteMember(member_id) {
        var alertPlayer;
        axios.delete(`${REACT_URL}/api/clanDetails/deleteMember/${ClanID}/${member_id}`)
            .then((result) => {
                if (member_id == player_id) {
                    alertPlayer.push(
                        <div id="clanDataAlertDiv">

                        </div>)
                    setAlertPlayer(alertPlayer)
                    setTimeout(() => {
                        window.location.assign(`${REACT_URL}/ClanDashboard?Clan_Name=${clan_Name}`)
                    }, 5000)
                }
                else {
                    Promise.all([getAllMembers(), changeColumn()])
                        .then((result) => {
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //cancel any kicking or chenging
    function cancel() {
        setAlertPlayer([]);
        Promise.all([getAllMembers(), changeColumn()])
            .then((result) => {
            })
            .catch((error) => {
                console.log(error)
            })

    }

    function onClickEvent(e) {
        if (e.target.id.includes('confirmRole')) {
            var confrimArr = e.target.id.split('confirmRole');
            changeRole(confrimArr[1]);
        }
    }


    return (
        <div id="clanDataBG" onClick={(e) => onClickEvent(e)}>

            <div id='topBarDataNav'>
                <ul>
                    <li style={{ marginLeft: '0', textDecoration: 'none' }}><a href={`${REACT_URL}/ClanDashboard`} id='backToClanDashboard'>< i className='fa fa-arrow-left' style={{ marginRight: '5px' }} /><p style={{ display: 'inline' }}>Back</p></a></li>
                    <li><a href="#basicStats">General Stats</a></li>
                    <li><a href="#contributionChartSection">Contribution Graph</a></li>
                    <li><a href="#lineGraphContributionDate">Clan Point Earned By Date</a></li>
                    <li><a href="#lineGraphSpentDate">Clan Point Spent By Date</a></li>
                    <li onClick={() => getAllMembers()}>View Members</li>
                </ul>
            </div>

            <section id="basicStats">
                <p id="clanDataName">{clanName}'s Data</p>
                <div id="basicStatsDiv">
                    <div>
                        <p className='basicStatsLabel'>Average Clan Point Earned: </p>
                        <div className='basicStatsSpanDiv'>
                            <p className='basicStatsSpan'>{AvgText} pts</p>
                        </div>
                    </div>
                    <div>
                        <p className='basicStatsLabel'>Total Clan Point Earned: </p>
                        <div className='basicStatsSpanDiv'>
                            <p className='basicStatsSpan'>{TotalText} pts</p>
                        </div>
                    </div>
                    <div>
                        <p className='basicStatsLabel'>No of members: </p>
                        <div className='basicStatsSpanDiv'>
                            <p className='basicStatsSpan'>{NoMembers}</p>
                        </div>
                    </div>
                    <div>

                        <p className='basicStatsLabel'>Top member: </p>
                        <div className='basicStatsSpanDiv'>
                            <p className='basicStatsSpan'>{Topmember}</p>
                        </div>
                    </div>
                </div>

            </section >
            <section id="contributionChartSection">
                <p id="contributionText">{labelText}</p>
                <select name="options" id="contributionChartDropdown" onChange={(e) => { contributionDropDown(e) }}>
                    <option value="general">Overall</option>
                    <option value="week">Past 7 Days</option>
                    <option value="last3Months">Past 3 Months</option>
                    <option value="last6Months">Past 6 Months</option>
                    <option value="yearly">This Year</option>
                </select>
                <div id="firstCharts">
                    <div id="contributionChart">
                        <ContributionBar chartData={chartData} />
                    </div>
                    <div id="spendingChart">
                        <SpendingBar chartData={chartData2} />
                    </div>
                </div>
            </section>
            <section id="lineGraphContributionDate">
                <p id="lineGraphDateText">{dateText}</p>
                <p id="lineGraphNote">(only dates where clan point changes will appear)</p>
                <select name="options" id="lineChartDropdown" onChange={(e) => { lineDropDown(e) }}>

                    <option value="lastMonth">This Month</option>
                    <option value="thisweek">Past 7 Days</option>
                    <option value="last3Months">Past 3 Months</option>
                    <option value="last3week">Past 3 week</option>


                </select>
                <div id="lineChartsBottom">
                    <EarnedDateLineChart chartData={lineData} players={playersDate} />
                </div>
            </section>
            <section id="lineGraphSpentDate">
                <p id="lineGraphDateText">{spentDateText}</p>
                <p id="lineGraphNote">(only dates where clan point changes will appear)</p>
                <select name="options" id="lineChartSpentDropdown" onChange={(e) => { lineSpentDropDown(e) }}>

                    <option value="lastMonth">This Month</option>
                    <option value="thisweek">Past 7 Days</option>
                    <option value="last3Months">Past 3 Months</option>
                    <option value="last3week">Past 3 week</option>


                </select>
                <div id="lineChartsBottom">
                    <SpentDateLineChart chartData={lineData2} players={playersSpent} />
                </div>
            </section>
            <div id="memberColumn">
                <div id="arrowMembersDiv">
                    <i className='fa fa-caret-left' id="adminArrowLeft" onClick={() => getAllMembers()} />
                </div>
                <div id="clanMemberListDiv">
                    {showAllPlayers}

                </div>

            </div>

            <div id="loadingGIF">
                <img src={LoadingGif} id="clanDataLoading" />
            </div>

            <div id="loading2GIF">
                <div>
                    <img src={LoadingInstructions} id="membersDataLoading" />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} >

                {alertPlayer}

            </div>

        </div >
    )
}

export default ClanData