import React from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/theHive.css';
import PutAway from '../images/putAwayIcon.png'
let API_URL = 'https://monster-cat-world.onrender.com'
var REACT_URL = 'https://monster-cat-world.onrender.com';
const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
var ClanID;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var furnitureArr = [];
var furnitureBought2 = [];
var furnitureBought = [];
var totalPrice = 0;
var totalFreshness = 0;
var freshnessRecorded = [];
let notUse = []
let hasRun = false;
let playerRole;
let playerPosition = '';
if (window.location.hostname === "localhost" && window.location.port === "3001") {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}


class TheHive extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: 'Loading ...',
            players: [],
            clan_Name: '',
            hivePoints: 0,
            totalFreshness: 0,
            totalPrice: 0,
            pos1: 0,
            pos2: 0,
            pos3: 0,
            pos4: 0,
            target: '',
            furnitureBought: [],
            showFurnitureBought: false,
            furnitureBought2: [],
            showPlayers: true,
            showEditBtn: false,
            showBottom: false,
            showShopBtm: false,
            showAlert: false,
            showDelete: true,
            showImage: true,
            setLimit: 5,
            setOffset: 0,
            arrowUp: [],
            arrowDown: [],
            bottomEditor: [],
            rank: [],
            alert: [],
            disable: false,
            furniture: [],
            bottomImg: [],
            furnitureName: [],
            editorDetails: [],
            showInstructions: false,
            loadingGifOption: '',
            showCongratulations: false,
            congratulationsDetails: []

        }
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.showFurnitureBought = this.showFurnitureBought.bind(this);
        this.editBtn = this.editBtn.bind(this);
        this.dragMouseDown = this.dragMouseDown.bind(this);
        this.elementDrag = this.elementDrag.bind(this);
        this.closeDragElement = this.closeDragElement.bind(this);
        this.doneEdit = this.doneEdit.bind(this);
        this.nextOptions = this.nextOptions.bind(this);
        this.prevOptions = this.prevOptions.bind(this);
        this.clickInstructions = this.clickInstructions.bind(this);
    }

    componentDidMount() {
        if (player_id == null) {
            window.location.assign(`${API_URL}/Clan`)
        }
        //check if player belongs to clan
        axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
            .then((response) => {
                if (response.data.ClanID == null) {
                    window.location.assign(`${REACT_URL}/Clan?${player_id}`)
                }
                const DCEntranceCd = ClanID + '' + player_id
                ClanID = response.data.ClanID;
                const bodyData = {
                    "player_id": player_id,
                    "ClanID": ClanID
                }

                axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                    .then((result) => {
                        if (result.data.length == 0) {

                            window.location.assign(`${REACT_URL}/Clan?${player_id}`)
                        }
                        else {
                            playerRole = result.data[0].PlayerRole;
                            if (hasRun == false) {
                                hasRun = true;
                                Promise.all([
                                    axios.delete(`${API_URL}/api/rooms/deleteFromDisco/${DCEntranceCd}`),
                                    axios.post(`${API_URL}/api/rooms/insertToHive`, bodyData),
                                    this.getPlayers(),
                                    this.showFurnitureBought(),
                                    this.checkIfWinPrevMonth()
                                ])
                                    .then(([deleteDC, insertHive]) => {



                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            }
                        }
                    })

            })
            .catch((error) => {
                console.log(error)
            })

        this.setState({ showImage: true, loadingGifOption: <img src={require(`../images/gif/HFInstructions.gif`)} id='THloadingGIF' /> });
    }

    //check if ckan won prev month
    checkIfWinPrevMonth() {
        if (playerRole == 'leader') {
            var todayDate = new Date();
            var bodyData = {
                month: todayDate.getMonth(),
                year: todayDate.getFullYear()
            }
            axios.post(`${REACT_URL}/api/hive/hiveRank`, bodyData)
                .then((result) => {
                    var addPoints = 0;
                    if (result.data.length > 0) {
                        var rank = result.data.findIndex(obj => obj.clan_id == ClanID)
                        console.log('rank:' + rank);
                        console.log(result.data[rank].claimed)
                        if (result.data[rank].claimed == 'no') {
                            switch (rank) {
                                case 0:
                                    addPoints = 100;
                                    break;
                                case 1:
                                    addPoints = 80;
                                    break;
                                case 2:
                                    addPoints = 50;
                                    break;
                            }
                            var leaderboard_id = ClanID + '' + todayDate.getMonth() + '' + todayDate.getFullYear();
                            console.log(leaderboard_id);
                            Promise.all([
                                axios.put(`${REACT_URL}/api/clanDetails/updateClanPoints/${ClanID}`, { clan_point: addPoints }),
                                axios.put(`${REACT_URL}/api/hive/updateClaimedStatus/${leaderboard_id}`, { claimed: 'yes' })
                            ]).then(([updateClanPoints, result]) => {
                                console.log(result);
                                if (updateClanPoints.data == 'update clan points succesful') {
                                    var congratsArr = [];
                                    congratsArr.push(
                                        <div id='congratulatoryTextTH'>
                                            <p>Congratulations!!</p>
                                            <p> {clan_Name} was rank {rank + 1} for {month[todayDate.getMonth() - 1]}'s Hive Competition!</p>
                                            <p>Your Clan get {addPoints} points !</p>
                                        </div>
                                    )
                                    setTimeout(() => {
                                        this.setState({ showCongratulations: true, congratulationsDetails: congratsArr });
                                    }, 4000)
                                    setTimeout(() => {
                                        this.setState({ showCongratulations: false, congratulationsDetails: [] });
                                    }, 10000)
                                }
                                return;
                            })
                                .catch((error) => {
                                    console.log(error);
                                })
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return;
                })

        }

    }

    //get all players
    getPlayers() {
        let players = []
        //for later use (image position)
        let position = [
            { top: '-15px', left: '20px' },
            { top: '-10px', left: '370px' },
            { top: '30px', left: '1020px' },
            { top: '65px', left: '800px' },
            { top: '160px', left: '250px' },
            { top: '130px', left: '680px' },
            { top: '200px', left: '100px' },
            { top: '150px', left: '470px' },
            { top: '0px', left: '570px' },
            { top: '160px', left: '900px' },
            { top: '180px', left: '1060px' },
            { top: '0px', left: '200px' }]

        //get location (The Hive or Disco Cosmo or RPS)
        var path = window.location.pathname;
        var removeLocalHost = path.split("/").pop();
        var removeHtml = removeLocalHost.split(".html");
        var location = removeHtml[0];
        let bodyData = {
            'location': location
        }

        axios.post(`${API_URL}/api/rooms/getAllPlayersInRoom/${ClanID}`, bodyData)
            .then((response) => {
                response.data.forEach((result) => {
                    let player_ID = result;
                    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_ID}`)
                        .then((result) => {
                            const image_id = result.data.image_id;
                            const player_username = result.data.player_username
                            console.log(image_id)
                            axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                                .then((response) => {
                                    //Places where players avatar can be to avoid overlapping 
                                    //i tried not to 'hard code' it but it caused a lag on the website
                                    //choose position from array (to allow some sort of variation whenever player enter this TheHive.html)
                                    //choose position from array (to allow some sort of variation whenever player enter this discoCosmo.html)
                                    var randomIndex = Math.floor(Math.random() * position.length)
                                    var topLeft = position[randomIndex];
                                    var topValue = topLeft.top;
                                    var leftValue = topLeft.left;
                                    var playerImagePath = response.data.split("./images/")
                                    position.splice(randomIndex, 1);

                                    players.push(
                                        <div id={`playerDiv${player_ID}`} class='playerDiv' style={{ position: 'absolute', top: topValue, left: leftValue }} >
                                            <img src={`${require(`../images/` + playerImagePath[1])}`} id={player_ID} class="playersInHive" />
                                            <p class="playerNameHive">{player_username}</p>
                                        </div >
                                    )
                                    this.setState({ clan_Name: clan_Name, players: players });
                                    setTimeout(() => {
                                        if (playerPosition == '' || playerPosition > parseInt(topValue)) {
                                            playerPosition = parseInt(topValue);
                                            if (document.getElementById(`playerDiv${player_ID}`) != null) {
                                                document.getElementById(`playerDiv${player_ID}`).style.zIndex = 1;
                                            }
                                        }
                                        if (document.getElementById(`playerDiv${player_id}`) != null) {
                                            document.getElementById(`playerDiv${player_id}`).style.zIndex = 3;
                                        }
                                    }, 500)
                                    setTimeout(() => {
                                        this.setState({ showShopBtm: true, showEditBtn: true })
                                    }, 1000)
                                    setTimeout(() => {
                                        this.setState({ showImage: false })
                                    }, 4000)

                                })
                                .catch((error) => {
                                    console.log(error)
                                })

                        })
                        .catch((error) => {
                            console.log(error)
                        })

                });

            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    //edit furniture
    editBtn() {
        if (this.state.showImage == false) {
            this.setState({ showPlayers: false, showFurnitureBought: true, showEditBtn: false });
            this.showFurnitureBought();
            document.getElementById('hiveShopBtn').style.width = '80px';
            document.getElementById('hiveShopBtnDiv').style.right = '20px';
            document.getElementById('gotoHiveShopText').style.fontSize = '12px'

        }
    }

    //done btn
    doneEdit() {
        this.setState({ showPlayers: true, showFurnitureBought: false, showEditBtn: true, showBottom: false });
        document.getElementById('bottomImageHive').style.filter = "none"
        this.showFurnitureBought();
        document.getElementById('hiveShopBtn').style.width = '100px';
        document.getElementById('hiveShopBtnDiv').style.right = '10px';
        document.getElementById('gotoHiveShopText').style.fontSize = '13px'

    }

    //show all the furniture bought
    showFurnitureBought() {
        if (this.state.setOffset < 0) {
            this.setState({ setOffset: 0, setLimit: 5 })
        }
        this.setState({ showFurnitureBought2: true })
        axios.get(`${REACT_URL}/api/hive/furnitureOwn/${ClanID}`)
            .then((result) => {
                var count = 0;
                var count2 = 0;
                var count3 = 0;
                for (let x = 0; x < result.data.length; x++) {
                    let parseWidth = '0';
                    let marginTop = '0';
                    let marginLeft = '0';
                    var image_path = result.data[x].image_path.split('../images/');
                    let setStyle = JSON.parse(result.data[x].divWidth);
                    if (setStyle.width != null) {
                        parseWidth = setStyle.width;
                    }
                    if (setStyle.marginTop != null) {
                        marginTop = setStyle.marginTop;
                    }
                    if (setStyle.marginLeft != null) {
                        marginLeft = setStyle.marginLeft;
                    }

                    //for inventory furnitures
                    if (result.data[x].position == null && this.state.showFurnitureBought == true) {

                        count2 += 1



                        if (count2 <= this.state.setLimit && count2 > this.state.setOffset) {
                            count += 1;
                            var arrowDown = [];
                            if ((result.data.length - x + 1) <= 4) {
                                arrowDown = []
                            }
                            else {
                                arrowDown = [<i className='fa fa-caret-down' id="hiveArrowIcons2" onClick={this.nextOptions} />]
                            }

                            var arrowUp = [];
                            if (this.state.setOffset !== 0) {
                                arrowUp = [<i className='fa fa-caret-up' id="hiveArrowIcons" onClick={this.prevOptions} />]
                            }
                            this.setState({ arrowUp: arrowUp, arrowDown: arrowDown });
                            var boughtIndex = furnitureBought.findIndex(element => element.props.id == `furnitureDiv${result.data[x].hiveFurniture_id}`)

                            if (boughtIndex == -1) {
                                furnitureBought.push(
                                    <div className="furnitureDivBorder" id={`furnitureDiv${result.data[x].hiveFurniture_id}`}>
                                        <img src={require(`../images/` + image_path[1])} onMouseDown={this.dragMouseDown} className="furnitureDivImg" id={`furnitureDivImg${result.data[x].hiveFurniture_id}`} style={{ width: parseWidth, marginTop: marginTop, marginLeft }} />
                                    </div>
                                );
                            }


                        }
                        else {
                            let checkNotUse = notUse.findIndex(element => element.hiveFurniture_id == result.data[x].hiveFurniture_id)

                            if (checkNotUse == -1) {
                                notUse.push({
                                    "hiveFurniture_id": result.data[x].hiveFurniture_id,
                                    "image_path": image_path[1],
                                    "width": result.data[x].width,
                                    "divWidth": result.data[x].divWidth,
                                    "parseWidth": parseWidth,
                                    "marginTop": marginTop,
                                    "marginLeft": marginLeft,
                                })
                            }
                        }
                    }
                    //fornot in inventory (on the room)
                    else if (result.data[x].position != null) {
                        count3++
                        var image_id = document.getElementById(`furnitureDivImg${result.data[x].hiveFurniture_id}`);
                        var div_id = document.getElementById(`furnitureDiv${result.data[x].hiveFurniture_id}`);

                        if (div_id != null) {
                            div_id.innerHTML = '';
                            div_id.remove()
                        }
                        var width = result.data[x].width + 'px';
                        var jsonResult = JSON.parse(result.data[x].position);
                        if (document.getElementById(`furnitureDiv${result.data[x].hiveFurniture_id}`) == null) {
                            furnitureBought2.push(
                                <div className="furnitureDivBorder2" id={`furnitureDiv${result.data[x].hiveFurniture_id}`}>
                                    <img src={require(`../images/` + image_path[1])} className="furnitureDivImg" id={`furnitureDivImg${result.data[x].hiveFurniture_id}`} style={{ width: width, position: 'absolute', top: jsonResult.top, left: jsonResult.left }} />
                                </div>
                            );
                        }

                        //calculate freshness (lifetime:90 days)
                        var date_bought = new Date(result.data[x].date_bought)
                        var current_date = new Date();
                        var milliSeconds = 24 * 60 * 60 * 1000;
                        //difference in days
                        const differenceInDays = Math.floor(
                            (current_date - date_bought) / milliSeconds
                        );
                        if (!freshnessRecorded.includes(`furnitureDivImg${result.data[x].hiveFurniture_id}`)) {
                            totalFreshness += Math.max(0, Math.min(((90 - differenceInDays) / 90 * 100), 100));
                            totalPrice += parseInt(result.data[x].clan_points);
                            freshnessRecorded.push(`furnitureDivImg${result.data[x].hiveFurniture_id}`)
                            this.calculateHivePoint()
                        }
                    }
                    //push in arr(for later use)
                    var checkExist = furnitureArr.find(obj => obj.hiveFurniture_id == result.data[x].hiveFurniture_id)
                    if (checkExist == null) {
                        furnitureArr.push({
                            "id": `furnitureDivImg${result.data[x].hiveFurniture_id}`,
                            "hiveFurniture_id": result.data[x].hiveFurniture_id,
                            "furniture_id": result.data[x].furniture_id,
                            "roomWidth": result.data[x].roomWidth,
                            "date_bought": result.data[x].date_bought,
                            "furniture_name": result.data[x].furniture_name,
                            "image_path": image_path[1],
                            "width": result.data[x].width,
                            "divWidth": result.data[x].divWidth,
                            "parseWidth": parseWidth,
                            "marginTop": marginTop,
                            "marginLeft": marginLeft,
                            "position": result.data[x].position,
                            "clan_points": result.data[x].clan_points
                        })
                    }


                }

                this.setState({ furnitureBought: furnitureBought, furnitureBought2: furnitureBought2 });
                setTimeout(() => {
                    if (this.state.showFurnitureBought == true) {
                        for (let x = 0; x < document.getElementsByClassName("furnitureDivImg").length; x++) {
                            document.getElementsByClassName("furnitureDivImg")[x].addEventListener('mousedown', this.dragMouseDown)
                        }
                    }
                }, 500)
                if (this.state.showFurnitureBought == false) {
                    this.calculateHivePoint()
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //the moving player
    getCursorPosition(e) {
        if (e.target.id != 'hiveExit' && this.state.showImage == false && this.state.showPlayers == true) {

            var currentPlayerDiv = document.querySelector(`#playerDiv${player_id}`);
            if (currentPlayerDiv != null) {
                // Calculate new x and y positions
                var xPosition = e.clientX - currentPlayerDiv.offsetLeft - (currentPlayerDiv.offsetWidth / 2);
                var yPosition = e.clientY - currentPlayerDiv.offsetTop - (currentPlayerDiv.offsetHeight / 2) - (currentPlayerDiv.offsetWidth / 2);

                // Check if new position is within bounds
                if (yPosition < 0) {
                    yPosition = 0;
                }
                console.log(yPosition);

                var translateValue = `translate3d(${xPosition}px,${yPosition}px,0)`;
                currentPlayerDiv.style.transform = translateValue;
            }
        }
    }

    //drag element
    dragMouseDown(e) {
        if (e.target.id.includes('furnitureDivImg')) {
            e.target.style.position = 'absolute'
            e.preventDefault();
            var pos3 = e.clientX;
            var pos4 = e.clientY;
            this.setState({ pos3: pos3, pos4: pos4, target: e.target.id, showBottom: true });
            e.target.addEventListener('mousemove', this.elementDrag);
            document.addEventListener('mouseup', this.closeDragElement);
            this.getEdittable(e.target.id)
        }
    };

    elementDrag(e) {
        e.preventDefault();
        document.getElementById('bottomImageHive').style.filter = "hue-rotate(90deg)"
        const id = document.getElementById(e.target.id);
        var currentTop = id.style.top;
        var currentLeft = id.style.left;
        id.style.zIndex = 1;

        // calculate the new cursor position:
        var pos1 = this.state.pos3 - e.clientX;
        var pos2 = this.state.pos4 - e.clientY;
        this.setState({ pos3: e.clientX, pos4: e.clientY });
        if (id != null && e.target.id == this.state.target) {
            // set the element's new position:
            id.style.top = id.offsetTop - pos2 + 'px';
            id.style.left = id.offsetLeft - pos1 + 'px';

        }

        var splitArr = e.target.id.split("furnitureDivImg");
        var findWidth = furnitureArr.find(obj => obj.id === e.target.id);
        var bottomImgTop = document.getElementById('bottomDivMock').getBoundingClientRect().top;
        if (id.getBoundingClientRect().top < bottomImgTop && findWidth != null) {
            id.style.top = currentTop;
            id.style.left = currentLeft
        }

        if (findWidth != null && ((document.getElementById(`furnitureDiv${splitArr[1]}`).getBoundingClientRect().left > id.getBoundingClientRect().left || document.getElementById(`furnitureDiv${splitArr[1]}`).getBoundingClientRect().right < id.getBoundingClientRect().right))) {
            let divStyle = JSON.parse(findWidth.divWidth);
            let roomWidth = findWidth.roomWidth + "px";
            if (id.style.width == divStyle.width) {
                id.style.width = roomWidth
                var pos1 = this.state.pos3 - e.clientX;
                var pos2 = this.state.pos4 - e.clientY;

                document.getElementById(`furnitureDiv${findWidth.hiveFurniture_id}`).classList.remove("furnitureDivBorder");
                document.getElementById(`furnitureDiv${findWidth.hiveFurniture_id}`).classList.add("furnitureDivBorder2");
                var totalShown = document.getElementsByClassName('furnitureDivBorder2').length + document.getElementsByClassName('furnitureDivBorder').length;
                console.log(totalShown);
                console.log(this.state.setLimit)
                if (totalShown >= this.state.setLimit) {
                    let earliest;
                    let earliestArr;
                    let earliestIndex;
                    for (let x = 0; x < notUse.length; x++) {
                        if (earliest > notUse[x].hiveFurniture_id || earliest == null) {
                            earliest = notUse[x].hiveFurniture_id;
                            earliestArr = notUse[x];
                            earliestIndex = x;

                        }
                    }
                    var newDetails = earliestArr

                    if (newDetails != null) {
                        furnitureBought.push(
                            <div className="furnitureDivBorder" id={`furnitureDiv${newDetails.hiveFurniture_id}`}>
                                <img src={require(`../images/` + newDetails.image_path)} onMouseDown={this.dragMouseDown} className="furnitureDivImg" id={`furnitureDivImg${newDetails.hiveFurniture_id}`} style={{ width: newDetails.parseWidth, marginTop: newDetails.marginTop, marginLeft: newDetails.marginLeft }} />
                            </div>
                        )

                        this.setState({ furnitureBought: furnitureBought })
                        console.log(furnitureBought)
                        notUse.splice(earliestIndex, 1)
                    }
                    if (totalShown + 1 == furnitureArr.length) {
                        this.setState({ arrowDown: [] })
                    }
                }

                //calculate freshness (lifetime:90 days)
                var date_bought = new Date(findWidth.date_bought)
                var current_date = new Date();
                var milliSeconds = 24 * 60 * 60 * 1000;
                //difference in days
                const differenceInDays = Math.floor(
                    (current_date - date_bought) / milliSeconds
                );
                if (!freshnessRecorded.includes(e.target.id + '')) {
                    totalFreshness += Math.max(0, Math.min(((90 - differenceInDays) / 90 * 100), 100));
                    totalPrice += parseInt(findWidth.clan_points)
                    freshnessRecorded.push(e.target.id + '')

                    if (this.state.totalFreshness != totalFreshness && this.state.totalPrice != totalPrice) {
                        this.calculateHivePoint();
                    }
                }

            }
        }
    };

    //close dragging
    closeDragElement(event) {
        document.getElementById('bottomImageHive').style.filter = "hue-rotate(0deg)"
        if (event.target.id.includes('furnitureDivImg')) {
            var splitArr = event.target.id.split('furnitureDivImg');
            document.getElementById('bottomImageHive').style.filter = "none"
            event.target.style.zIndex = 0;
            document.getElementById(event.target.id).removeEventListener('mousemove', this.elementDrag);
            document.removeEventListener('mousemove', this.elementDrag);
            document.removeEventListener('mouseup', this.closeDragElement);
            this.updatePosition(splitArr[1])
        }
    };

    //update position of furniture
    updatePosition(hiveFurniture_id) {
        var element = document.getElementById(`furnitureDivImg${hiveFurniture_id}`)
        var findArr = furnitureArr.find(obj => obj.id == `furnitureDivImg${hiveFurniture_id}`);
        if (element != null) {
            var width = element.style.width;
            var top = element.style.top;
            var left = element.style.left;
            var position = `{"top":"${top}", "left":"${left}"}`;
            if (findArr != null) {
                if (width == findArr.parseWidth) {
                    position = null;
                    element.style.zIndex = 1;
                }
            }
            const body = {
                position: position,
                width: width
            }
            axios.put(`${REACT_URL}/api/hive/updatePosition/${hiveFurniture_id}`, body)
                .then((result) => {
                    return;
                })
                .catch((error) => {
                    console.log(error);
                    return;
                })
        }
    }

    //update width of furniture
    updateWidth(array) {
        var rangeValue = document.getElementById('widthInputSlider').value;
        var calculatedWidth = (parseInt(array.roomWidth) - 100) + parseInt(rangeValue)
        document.getElementById(array.id).style.width = calculatedWidth + 'px';
        var body = {
            "width": calculatedWidth
        }
        axios.put(`${REACT_URL}/api/hive/updateWidth/${array.hiveFurniture_id}`, body)
            .then((result) => {
                return;
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    //the bottom column (allow put away, dlete, adjusting width...)
    getEdittable(id) {
        this.setState({ showDelete: true, disable: false })
        var showDelete = true;
        var disable = false;
        var bottomImg = [];
        var furnitureName = [];
        var editorDetails = [];
        var furniture = furnitureArr.find(obj => obj.id === id);
        var image_path = furniture.image_path;
        let setStyle = JSON.parse(furniture.divWidth);
        var width = parseInt(setStyle.width) - 30;
        var parseDate = new Date(furniture.date_bought);
        var date_bought = parseDate.getDate().toString().padStart(2, '0') + '/' + parseDate.getMonth().toString().padStart(2, '0') + '/' + parseDate.getFullYear();
        //calculate freshness
        var current_date = new Date();
        var milliSeconds = 24 * 60 * 60 * 1000;
        const differenceInDays = Math.floor(
            (current_date - parseDate) / milliSeconds
        );

        //  var currentWidth = parseInt(document.getElementById(`furnitureDivImg${furniture.hiveFurniture_id}`).style.width);
        // var sliderValue = (currentWidth / furniture.roomWidth) * 100
        var freshness = Math.max(0, Math.min(((90 - differenceInDays) / 90 * 100), 100));

        bottomImg.push(
            <div id="furnitureImgBtm">
                <img src={require(`../images/` + image_path)} width={width + 'px'} />
            </div>
        )

        furnitureName.push(
            <p id="furnitureNameBtm">{furniture.furniture_name}</p>
        )
        editorDetails.push(
            <div>
                <p id="editorDate">Date Bought: <span class="hiveSpan">{date_bought}</span></p>
                <p id="editorFreshness">Freshness: <span class="hiveSpan">{freshness.toFixed(1)}%</span></p>
            </div>)

        if (document.getElementById(id).style.width == setStyle.width) {
            showDelete = false;
            disable = true;
        }

        this.setState({ furniture: furniture, bottomImg: bottomImg, furnitureName: furnitureName, editorDetails: editorDetails, showDelete: showDelete, disable: disable })


    }

    //calculate hive points in clan
    calculateHivePoint() {
        if (this.state.totalFreshness != totalFreshness && this.state.totalPrice != totalPrice) {
            this.setState({ totalFreshness: totalFreshness, totalPrice: totalPrice })
            axios.get(`${REACT_URL}/api/hive/totalPrice`)
                .then((result) => {
                    var avgFreshness = totalFreshness / freshnessRecorded.length;
                    var calculatedScore = (avgFreshness / 100) * 50 + (totalPrice / parseInt(result.data.totalPrice)) * 50;
                    var current_date = new Date();
                    if (isNaN(calculatedScore)) {
                        calculatedScore = 0;
                    }

                    this.setState({ hivePoints: Math.round(calculatedScore) });
                    var body = {
                        hive_points: Math.round(calculatedScore),
                        month: current_date.getMonth() + 1,
                        year: current_date.getFullYear()
                    }
                    axios.put(`${REACT_URL}/api/hive/updateHiveScore/${ClanID}`, body)
                        .then((response) => {
                            if (response.data[0].affectedRows == 1) {
                                this.updateRank()
                            }

                            return;
                        })
                        .catch((error) => {
                            console.log(error);
                            return;
                        })

                })
                .catch((error) => {
                    console.log(error);
                    return;
                })
        }
    }

    //prev button for inventory
    prevOptions() {
        furnitureBought = [];
        this.setState({ setLimit: this.state.setLimit - 5, setOffset: this.state.setOffset - 5 })
        console.log(this.state.limit)
        console.log(this.state.offset)
        this.showFurnitureBought()
    }

    //next button for inventory
    nextOptions() {
        furnitureBought = [];
        this.setState({ setLimit: this.state.setLimit + 5, setOffset: this.state.setOffset + 5 })
        console.log(this.state.setOffset)
        console.log(this.state.setLimit)
        this.showFurnitureBought()
    }

    //update ranking of clan 
    updateRank() {
        var rankArr = []
        var current_date = new Date();
        var body = {
            month: current_date.getMonth() + 1,
            year: current_date.getFullYear(),
        }
        axios.post(`${REACT_URL}/api/hive/hiveRank`, body)
            .then((result) => {
                console.log(result);
                for (let x = 0; x < result.data.length; x++) {
                    if (x < 3) {
                        if (x == 0) {
                            rankArr.push(<p class="hiveRankLabel">Rank{x + 1}: <span class="hiveRankSpan" id={`span${x}`}></span></p>)

                        }

                        else {
                            rankArr.push(<p class="hiveRankLabel">, Rank{x + 1}: <span class="hiveRankSpan" id={`span${x}`}></span></p>)
                        }
                        if (x == result.data.length - 1) {
                            this.setState({ rank: rankArr })
                        }

                    }
                    axios.get(`${REACT_URL}/api/ClanDetails/getClanDetails/${result.data[x].clan_id}`)
                        .then((clan_Name) => {
                            setTimeout(() => {
                                if (document.getElementById(`span${x}`) != null) {
                                    document.getElementById(`span${x}`).innerHTML = clan_Name.data[0].ClanName;
                                }
                            }, 500)
                            if (result.data[x].clan_id == ClanID) {
                                var hive_points = this.state.hivePoints + ''
                                if (!hive_points.includes(`(Rank ${x + 1})`)) {
                                    this.setState({ hivePoints: this.state.hivePoints + ` (Rank ${x + 1})` })
                                }
                                setTimeout(() => {
                                    if (document.getElementById(`span${x}`) != null) {

                                        document.getElementById(`span${x}`).style.color = '#ffd900'
                                    }
                                }, 500)
                            }
                            else {
                                setTimeout(() => {
                                    if (document.getElementById(`span${x}`) != null) {

                                        document.getElementById(`span${x}`).style.color = 'white'
                                    }
                                }, 500)
                            }
                        })
                }
            })
            .catch((error) => {
                console.log(error);
                return;
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    //delete alert 
    deleteAlert(details) {
        var alert = [];
        //calculate freshness (lifetime:90 days)
        var date_bought = new Date(details.date_bought)
        var current_date = new Date();
        var milliSeconds = 24 * 60 * 60 * 1000;
        //difference in days
        const differenceInDays = Math.floor(
            (current_date - date_bought) / milliSeconds
        );
        var freshness = Math.max(0, Math.min(((90 - differenceInDays) / 90 * 100), 100));
        var price = parseInt(details.clan_points);
        var clanPointEarned = Math.round(freshness / 100 * price);
        alert.push(
            <div>
                <p>Do you want to delete this furniture? Refund will be {clanPointEarned} points</p>
                <button style={{ marginRight: '4px' }} onClick={() => { this.deleteFurniture(clanPointEarned, details.hiveFurniture_id, freshness, price) }}>yes</button>
                <button style={{ marginLeft: '4px' }} onClick={() => { this.setState({ showAlert: false }) }}>no</button>
            </div>)
        this.setState({ showAlert: true, alert: alert })

    }

    //delete furniture
    deleteFurniture(clanPointEarned, hiveFurniture_id, freshness, price) {

        var alert = [];
        this.setState({ showAlert: false, alert: alert })
        const body = {
            "clan_point": clanPointEarned
        }
        axios.delete(`${REACT_URL}/api/hive/deleteFurniture/${hiveFurniture_id}`)
            .then((result) => {
                if (result.data.affectedRows == 1) {
                    axios.put(`${REACT_URL}/api/ClanDetails/updateClanPoints/${ClanID}`, body)
                        .then((response) => {
                            if (response.data == 'update clan points succesful') {
                                document.getElementById(`furnitureDiv${hiveFurniture_id}`).remove();
                                const index = furnitureArr.findIndex(obj => obj.hiveFurniture_id == hiveFurniture_id)
                                furnitureArr.splice(index, 1);
                                const index2 = freshnessRecorded.findIndex(obj => obj == `furnitureDivImg${hiveFurniture_id}`)
                                freshnessRecorded.splice(index2, 1);
                                totalFreshness -= freshness;
                                totalPrice -= price;
                                alert.push(< p> Furniture deleted! Refunded {clanPointEarned} clan points</p >)
                                this.setState({ alert: alert, showAlert: true })
                                setTimeout(() => {
                                    this.setState({ alert: alert, showAlert: false })
                                }, 3000)
                                this.calculateHivePoint()

                            }


                        })
                        .catch((error) => {
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

    //put away items back into inventory
    putAwayItems(details) {

        this.setState({ showDelete: false, disable: true, furnitureBought: [], loadingGifOption: <img src={require(`../images/gif/loading2.gif`)} id='THloadingGIF' style={{ width: '400px' }} />, showImage: true })
        axios.put(`${REACT_URL}/api/hive/updatePosition/${details.hiveFurniture_id}`)
            .then((result) => {
                if (result.data.affectedRows == 1) {
                    var image_id = document.getElementById(`furnitureDivImg${details.hiveFurniture_id}`)
                    var div_id = document.getElementById(`furnitureDiv${details.hiveFurniture_id}`)
                    setTimeout(() => {
                        if (div_id != null) {
                            if (image_id !== null) {
                                image_id.remove();
                                div_id.remove();
                            }
                            else {
                                div_id.remove();
                            }
                        }
                    }, 1000)
                    var removeIndex = furnitureBought.findIndex(element => element.props.id == `furnitureDiv${details.hiveFurniture_id}`);
                    furnitureBought.splice(removeIndex, 1);


                    //calculate freshness (lifetime:90 days)
                    var date_bought = new Date(details.date_bought)
                    var current_date = new Date();
                    var milliSeconds = 24 * 60 * 60 * 1000;
                    //difference in days
                    const differenceInDays = Math.floor(
                        (current_date - date_bought) / milliSeconds
                    );
                    var freshness = Math.max(0, Math.min(((90 - differenceInDays) / 90 * 100), 100));
                    var price = parseInt(details.clan_points);
                    const index = freshnessRecorded.findIndex(obj => obj == `furnitureDivImg${details.hiveFurniture_id}`)
                    freshnessRecorded.splice(index, 1);
                    //const index2 = furnitureArr.findIndex(obj => obj.hiveFurniture_id == details.hiveFurniture_id)
                    //furnitureArr.splice(index2, 1);
                    furnitureArr = []
                    totalFreshness -= freshness;
                    totalPrice -= price;
                    furnitureBought = [];

                    this.showFurnitureBought();
                    setTimeout(() => {
                        this.calculateHivePoint();
                    }, 500)
                    setTimeout(() => {
                        this.setState({ showImage: false })
                    }, 2000)

                }
                return;
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    hiveShop() {
        window.location.assign(`${REACT_URL}/HiveShop?Clan_Name=${clan_Name}`)
    }

    clickInstructions() {
        if (this.state.showInstructions == true) {
            this.setState({ showInstructions: false })
        }
        else if (this.state.showInstructions == false) {
            this.setState({ showInstructions: true })
        }
    }

    render() {
        return (
            <div id='hive' >
                <div id="bottomDivMock"></div>
                <img src={require('../images/bottom.PNG')} id="bottomImageHive" />
                <button id="hiveExit" onClick={() => { window.location.assign(`${REACT_URL}/ClanVillage?Clan_Name=${clan_Name}`) }}>Exit to Village</button>
                {this.state.showImage && (
                    <div id='loadingGifTHDiv'>
                        {this.state.loadingGifOption}
                    </div>
                )}
                <div id="hiveNamePoints">

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p id="hiveName">{this.state.clan_Name}</p>
                            <div style={{ paddingRight: '5px', marginTop: '5px', marginLeft: '9px' }}>
                                <div id='infoCircleIcon' onClick={this.clickInstructions}>
                                    <p>i</p>
                                </div></div>

                        </div>
                        <p id="hiveScoreLabel">Hive Score:<span id="hiveScoreSpan">{this.state.hivePoints}</span></p>
                        {this.state.rank}
                    </div>
                </div>
                <div id="furnitureColumn2" class="furnitureColumn">
                    <div id="boughtFurniture2">
                        {this.state.furnitureBought2}
                    </div>
                </div>
                {this.state.showPlayers && (
                    <div id="HivePlayers" onClick={this.getCursorPosition}>
                        {this.state.players}
                    </div>
                )
                }
                {
                    this.state.showFurnitureBought && (
                        <div id="furnitureColumn" class="furnitureColumn">
                            <div class="hiveArrows">
                                {this.state.arrowUp}
                            </div>
                            <div id="boughtFurniture">
                                {this.state.furnitureBought}
                            </div>

                            <div class="hiveArrows">
                                {this.state.arrowDown}
                            </div>
                        </div>
                    )
                }
                {
                    this.state.showBottom && (
                        <div className="hiveBottomEditor" id={`hiveBottomEditor${this.state.furniture.hiveFurniture_id}`}>
                            <div id="furnitureImgBtm">
                                {this.state.bottomImg}
                            </div>
                            <div id="furnitureNameDiv">
                                {this.state.furnitureName}
                            </div>
                            <div id="editorDetails">
                                {this.state.editorDetails}
                            </div>
                            <div id="hiveWidthSlider">
                                <div id="upperSlider">
                                    <label id="hiveWidthLabel">Width: </label>
                                    <input type="range" style={{ width: '150px' }} onChange={() => this.updateWidth(this.state.furniture)} id="widthInputSlider" min="0" max="100" disabled={this.state.disable} />
                                </div>
                                <div id="rangeNumLabelDiv">
                                    <span id="Num0Label">0%</span>
                                    <span id="Num100Label">100%</span>
                                </div>
                            </div>

                            <div id="hiveButtonOptions">
                                {this.state.showDelete && (
                                    <div id="putAwayDiv">
                                        <img src={PutAway} id="putAwayItems" onClick={() => this.putAwayItems(this.state.furniture)} />
                                        <p class="optionsText">put back</p>
                                    </div>
                                )}
                                <div >
                                    <i className="fa fa-trash" id="sellFurniture" onClick={() => this.deleteAlert(this.state.furniture)}></i>
                                    <p id="optionsText2" >delete</p>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    this.state.showShopBtm && (
                        < div id="hiveShopBtnDiv" >
                            <img src={require('../images/hiveShopIcon.png')} id="hiveShopBtn" onClick={this.hiveShop} />
                            <p class="hiveBtnName" id='gotoHiveShopText'>Hive Shop</p>
                        </div >
                    )}
                {
                    this.state.showEditBtn && (
                        <div id="editHiveBtnDiv">
                            <img src={require('../images/editHiveImg.PNG')} id="editHiveBtn" onClick={this.editBtn} />
                            <p class="hiveBtnName">Edit Furniture</p>
                        </div>
                    )
                }
                {
                    this.state.showFurnitureBought && (
                        <button id="doneEditingHiveBtn" onClick={this.doneEdit}>Done</button>
                    )
                }
                {this.state.showAlert && (
                    <div id="hiveAlert">
                        {this.state.alert}
                    </div>
                )}
                {this.state.showCongratulations && (
                    <div id='congratulationsDivTH'>
                        <div>
                            <img src={require('../images/gif/congratulationGIF.gif')} id='congratulationsGifTH' />
                            {this.state.congratulationsDetails}
                        </div>
                    </div>
                )}
                {this.state.showInstructions &&
                    (<div id='instructionDivTH'>
                        <div style={{ backgroundColor: 'white', width: '700px', padding: '2%' }}>
                            <p >Compete with other clans monthly to get clan points.
                                Hive Score is calculated by the <span style={{ fontWeight: '900' }}> furniture's price and furniture's freshness</span>.Clan Leaders to claim clan points by entering this page during the next month</p>
                            <p style={{ textDecoration: 'underline' }}>How to use?</p>
                            <p>1. Only can move furniture under 'Edit Furniture' </p>
                            <p>2. Drag furniture while on <span style={{ fontWeight: '900', textDecoration: 'underline' }}>mouse down</span></p>
                            <p>3. If furniture goes out of the view, it can still be dragged inside!!! Just continue mouse down while dragging</p>
                            <p>4. You can adjust the width by using the slider!</p>
                            <p>5. To put back the furniture, click on the 'Put Back' icon</p>
                            <p>6. Refund method for deleting furniture. Claim back freshness X price! </p>
                            <button id='doneReadingTH' onClick={this.clickInstructions}>Done Reading</button>
                        </div>
                    </div>
                    )
                }
            </div >
        )
    }
}
export default TheHive