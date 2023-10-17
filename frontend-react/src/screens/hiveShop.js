import React from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import '../css/hiveShop.css';
import LoadingGif from '../images/gif/LoadingGif3.gif'
let API_URL = 'https://monster-cat-world.onrender.com'
var REACT_URL = 'https://monster-cat-world.onrender.com';
if (window.location.hostname === 'localhost' && window.location.port === '3001') {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
var showNext = false;
var showPrev = false;
var limit = 6;
var offset = 1;
var own = 0

const player_id = localStorage.getItem('player_id')
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
var ClanID;
let hasRun = false;

class HiveShop extends React.Component {
    constructor() {
        super();
        this.state = {
            clanPoint: '',
            row1: [],
            row2: [],
            showPrev: false,
            showNext: false,
            own: 0,
            showAlert: false,
            alertText: []
        }
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }

    componentDidMount() {
        if (player_id == null) {
            window.location.assign(`${API_URL}/Clan`)
        }
        //check if player belongs to clan
        axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
            .then((response) => {
                if (response.data.ClanID == null) {
                    window.location.assign(`${API_URL}/Clan`);
                }
                ClanID = response.data.ClanID;
                axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                    .then((result) => {
                        if (result.data.length == 0) {
                            window.location.assign(`${API_URL}/Clan`)
                        }
                        else {
                            document.getElementById(`loadingGifHiveShop`).style.opacity = 1;
                            if (hasRun == false) {
                                hasRun = true;
                                this.showClanPoint()
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

    showClanPoint() {
        Promise.all([
            axios.get(`${REACT_URL}/api/clanDetails/getClanDetails/${ClanID}`),
            this.showFurnitures()
        ])
            .then(([response, nothing]) => {
                this.setState({ clanPoint: response.data[0].clan_point })

            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    showFurnitures() {
        //disable prev and next button (prevent spamming)
        if (document.getElementById('hiveShopPrev') != null) {
            document.getElementById('hiveShopPrev').disabled = true;
        }
        if (document.getElementById('hiveShopNext') != null) {
            document.getElementById('hiveShopNext').disabled = true;
        }
        let row1 = [];
        let row2 = [];
        if (document.getElementById(`loadingGifHiveShop`).style.opacity = 0) {
            document.getElementById(`loadingGifHiveShop`).style.opacity = 1;
        }
        if (this.state.showAlert == false) {
            document.getElementById(`loadingGifHiveShop`).style.opacity = 1;
        }
        this.setState({ showPrev: showPrev, showNext: showNext })

        Promise.all(
            [
                axios.get(`${REACT_URL}/api/hive/noOfFurniture`),
                axios.get(`${REACT_URL}/api/hive/showAllFurnitures/${limit}/${offset}`)
            ])
            .then(([no_of_furniture, response]) => {
                if (offset > 1) {
                    showPrev = true;
                }
                else {
                    showPrev = false
                }
                if (limit < no_of_furniture.data.no_of_furniture) {
                    showNext = true;
                }
                else {
                    document.getElementById("hiveShopPrev").style.left = "1150px"
                    showNext = false;
                }

                for (let x = 0; x < response.data.length; x++) {
                    //getting the furniture details;
                    axios.get(`${REACT_URL}/api/hive/furnitureDetails/${response.data[x].furniture_id}/${ClanID}`)
                        .then((result2) => {
                            var disable = false;
                            var buttonText = 'Buy'
                            if (parseInt(this.state.clanPoint) < parseInt(response.data[x].clan_points)) {
                                disable = true;
                                buttonText = 'Not Enough Points'
                            }
                            var image_path = response.data[x].image_path.split('../images/');
                            var inventory_style = response.data[x].inventory_style.split(',');
                            var width = inventory_style[0].split('width:');
                            var marginTop = response.data[x].inventory_style.split('marginTop:')
                            if (marginTop.length == 1) {
                                marginTop.push('0')
                            }

                            if (x < 3) {
                                //3 divs each row
                                row1.push(
                                    <div class="individualItems">
                                        <div>
                                            <img src={require(`../images/` + image_path[1])} className="furnitureItemsImg" style={{ width: width[1], marginTop: marginTop[1] }} />
                                        </div>
                                        <div class="itemsDetail">
                                            <p class="furnitureName">{response.data[x].furniture_name}</p>
                                            <div class="quantityOwned">
                                                <p class="ownedLabel">Owned: <span class="quantityLabel">{result2.data.length}</span></p>
                                                <p class="costLabel" >Cost: <span class="quantityLabel">{response.data[x].clan_points} pts</span></p>
                                            </div>
                                            <p class="furnitureDescription">{response.data[x].description}</p>
                                            <button class="buyFurnitureBtn" onClick={() => this.buyFurniture(response.data[x])} disabled={disable}>{buttonText}</button>
                                        </div>

                                    </div>)
                            }
                            else {
                                //3 divs each row
                                row2.push(
                                    <div class="individualItems">
                                        <div>
                                            <img src={require(`../images/` + image_path[1])} className="furnitureItemsImg" style={{ width: width[1], marginTop: marginTop[1] }} />
                                        </div>
                                        <div class="itemsDetail">
                                            <p class="furnitureName">{response.data[x].furniture_name}</p>
                                            <div class="quantityOwned">
                                                <p class="ownedLabel">Owned: <span class="quantityLabel">{result2.data.length}</span></p>
                                                <p class="costLabel" >Cost: <span class="quantityLabel">{response.data[x].clan_points} pts</span></p>
                                            </div>
                                            <p class="furnitureDescription">{response.data[x].description}</p>
                                            <button class="buyFurnitureBtn" onClick={() => this.buyFurniture(response.data[x])} id={`Furniture${response.data[x].furniture_id}Btn`} disabled={disable}>{buttonText}</button>
                                        </div>

                                    </div>)
                            }
                            if (x == (response.data.length - 1)) {
                                this.setState({ row1: row1, row2: row2, showPrev: showPrev, showNext: showNext })
                                if ((showNext == true && showPrev == false) || (showNext == false && showPrev == true)) {
                                    document.getElementById("hiveShopNextPrev").style.left = "1160px"
                                }
                                else {
                                    document.getElementById("hiveShopNextPrev").style.left = "1100px"
                                }
                            }
                            return;

                        })
                        .catch((error) => {
                            console.log(error);
                            return;
                        })
                }
                setTimeout(() => {
                    document.getElementById(`loadingGifHiveShop`).style.opacity = 0
                    if (document.getElementById('hiveShopPrev') != null) {
                        document.getElementById('hiveShopPrev').disabled = false;
                    }
                    if (document.getElementById('hiveShopNext') != null) {
                        document.getElementById('hiveShopNext').disabled = false;
                    }
                }, 1500)
            })
            .catch((error) => {
                console.log(error);
                return;
            })

    }

    buyFurniture(details) {
        //buy furniture
        var image_path = details.image_path.split('../images/');
        var inventory_style = details.inventory_style.split(',');
        var width = inventory_style[0].split('width:');
        const body = {
            "clan_point": parseInt('-' + details.clan_points)
        }
        Promise.all([
            axios.post(`${REACT_URL}/api/hive/buyFurniture/${details.furniture_id}/${ClanID}/${player_id}`, { dateBought: new Date() }),
            axios.put(`${REACT_URL}/api/ClanDetails/updateClanPoints/${ClanID}`, body)
        ])
            .then(([result, result2]) => {
                if (result.data.affectedRows == 1) {
                    var alert = [];
                    alert.push(
                        <div>
                            <p>You succesfully purchased {details.furniture_name} ! {details.clan_points} points has been deducted ! </p>
                            <img src={require(`../images/` + image_path[1])} style={{ width: width[1] }} />
                        </div>)
                    this.setState({ showAlert: true, alertText: alert })
                    setTimeout(() => {
                        this.setState({ showAlert: false, alertText: [] })
                    }, 5000)
                    this.showClanPoint();

                }
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }

    //check number of own furniture
    checkOwned(furniture_id) {
        axios.get(`${REACT_URL}/api/hive/furnitureExists/${furniture_id}/${ClanID}`)
            .then((result) => {
                own = result.data.length
                return;
            })
            .catch((error) => {
                console.log(error);
                return;
            })
    }

    next() {
        limit += 6
        offset += 6

        this.showFurnitures()
    }
    prev() {
        limit -= 6
        offset -= 6

        this.showFurnitures()
    }

    render() {
        return (
            <div id="hiveShop">
                <div id="backToRoomBtn">
                    <img src={require(`../images/roomIcon.png`)} id='backToHiveImg' onClick={() => { window.location.assign(`${REACT_URL}/TheHive?Clan_Name=${clan_Name}`) }} />
                    <p>Back To Hive</p>
                </div>
                {this.state.showAlert && (
                    <div id="hiveShopAlert">
                        {this.state.alertText}
                    </div>
                )}
                <div id='loadingGifHiveShopDiv'>

                    <img src={LoadingGif} id='loadingGifHiveShop' />

                </div>
                <div id="detailsPage">
                    <p id="TitlePage">Hive Shop </p>
                    <p id="hiveClanPoints">Clan Points: {this.state.clanPoint} pts</p>
                </div>
                <div id="shopItems">
                    <div class="row">
                        {this.state.row1}

                    </div>
                    <div class="row">
                        {this.state.row2}
                    </div>
                    <div id="hiveShopNextPrev">
                        {this.state.showPrev && (
                            <button id="hiveShopPrev" onClick={this.prev}>Prev</button>
                        )}
                        {this.state.showNext && (
                            <button id="hiveShopNext" onClick={this.next}>Next</button>
                        )}
                    </div>
                </div>
            </div >
        )
    }
}
export default HiveShop