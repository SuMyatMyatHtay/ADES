import '../css/village.css';
import React from 'react';
import axios from 'axios';
import RpsButton from '../images/RPSBUTTON.PNG';
import HiveButton from '../images/HIVEBUTTON.PNG';
import CDButton from '../images/CLANDASHBOARD.PNG';
import DCButton from '../images/DCBUTTON.PNG'
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id');

var ClanID;
let queryParams = new URLSearchParams(window.location.search);
let clan_Name = queryParams.get('Clan_Name');
if (window.location.hostname === "localhost" && window.location.port === "3001") {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
class ClanVillage extends React.Component {
    constructor() {
        super()
        this.state = {
            imageSrc: "",
        }

    }

    componentDidMount() {
        if (player_id == null) {
            window.location.assign(`${REACT_URL}/Clan`)
        }
        axios.post(`${API_URL}/api/clanDetails/getClanID/${clan_Name}`)
            .then((response) => {
                if (response.data.ClanID == null) {
                    window.location.assign(`${REACT_URL}/Clan`)
                    // window.location.assign(`${API_URL}/Clan.html`);
                }
                ClanID = response.data.ClanID;
                console.log(response.data.ClanID);
                axios.get(`${API_URL}/api/clanDetails/checkPlayerFromClan/${ClanID}/${player_id}`)
                    .then((result) => {
                        console.log(result)
                        if (result.data.length == 0) {
                            window.location.assign(`${REACT_URL}/Clan?${player_id}`)
                            // window.location.assign(`${API_URL}/Clan.html`)
                        }
                        else {
                            Promise.all([
                                axios.get(`${REACT_URL}/api/players/getPlayerInfoImage/${player_id}`),
                                this.removeFromHive(),
                                this.removeFromDC()
                            ])
                                .then(([result]) => {
                                    var playerAvatar = result.data.image_path.split('./images/');
                                    this.setState({ imageSrc: require(`../images/` + playerAvatar[1]) })
                                })
                                .catch((error) => {
                                    console.log(error)

                                })
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


    goRPS() {
        let queryParams = new URLSearchParams(window.location.search);
        let clan_Name = queryParams.get('Clan_Name');
        window.location.assign(`${REACT_URL}/RockPaperScissors?Clan_Name=${clan_Name}`)
    }

    goDC() {
        let queryParams = new URLSearchParams(window.location.search);
        let clan_Name = queryParams.get('Clan_Name');
        window.location.assign(`${REACT_URL}/DiscoCosmo?Clan_Name=${clan_Name}`);
    }

    gotheHive() {
        let queryParams = new URLSearchParams(window.location.search);
        let clan_Name = queryParams.get('Clan_Name');
        window.location.assign(`${REACT_URL}/TheHive?Clan_Name=${clan_Name}`);
    }

    goClanDashboard() {
        let queryParams = new URLSearchParams(window.location.search);
        let clan_Name = queryParams.get('Clan_Name');
        window.location.assign(`${REACT_URL}/ClanDashboard?Clan_Name=${clan_Name}`);
    }

    removeFromDC() {
        const DCEntranceCd = ClanID + '' + player_id
        axios.delete(`${API_URL}/api/rooms/deleteFromDisco/${DCEntranceCd}`)
            .then((result) => {
                console.log("delete was successful", result);
            })
            .catch((error) => {
                console.log(error);
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
    /*
                    <button id="RPS" className="villageButton" onClick={() => this.goRPS()}>Rock, Paper, Scissors</button>
                    <button id="DC" className="villageButton" onClick={() => this.goDC()}> Disco Cosmo</button>
                    <button id="TH" className="villageButton" onClick={() => this.gotheHive()}>The Hive</button>
                    <button id="CD" className="villageButton" onClick={() => this.goClanDashboard()}>Clan Dashboard</button>
                    */
    render() {
        return (
            <div className="clanVillage">
                <div>
                    <div id="imageBG" onClick={() => window.location.assign(`${REACT_URL}/Clan?${player_id}`)}>
                        <img id="showClans" src={this.state.imageSrc} onClick={() => window.location.assign(`${REACT_URL}/Clan?${player_id}`)} />
                    </div>
                    <p id="backToClan" onClick={() => window.location.assign(`${REACT_URL}/Clan?${player_id}`)}>Back</p>
                </div>

                <div>
                    <img src={HiveButton} style={{ width: '400px' }} id="THImg" onClick={() => this.gotheHive()} />
                    <button id="TH" className="villageButton" onClick={() => this.gotheHive()}>The Hive</button>

                    <img src={DCButton} style={{ width: '250px' }} id="DCImg" onClick={() => this.goDC()} />
                    <button id="DC" className="villageButton" onClick={() => this.goDC()}> Disco Cosmo</button>

                    <img src={CDButton} style={{ width: '420px' }} id="CDImg" onClick={() => this.goClanDashboard()} />
                    <button id="CD" className="villageButton" onClick={() => this.goClanDashboard()}>Clan Dashboard</button>

                    <img src={RpsButton} style={{ width: '270px' }} id="RPSImg" onClick={() => this.goRPS()} />
                    <button id="RPS" className="villageButton" onClick={() => this.goRPS()}>Rock, Paper, Scissors</button>
                </div></div>
        )
    }

}


export default ClanVillage;