import '../css/profile.css';
import React from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import ProfileBorder from '../images/profileBorder.JPEG';
import Book from '../images/book.png'
import NavBar from '../components/NavBar';

const queryParams = new URLSearchParams(window.location.search);
const player_id = localStorage.getItem('player_id');
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
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


class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            image: '',
            player_id: '',
            name: '',
            email: '',
            dateJoined: '',
            goldEarned: '',
            clanPoints: '',
            noOfCards: '',
            noOfFriends: '',
            noOfClans: ''
        }
    }
    componentDidMount() {
        document.getElementById('profile_id').innerHTML = player_id
        //get player info
        axios.get(`https://monster-cat-world.onrender.com/api/players/getPlayerInfo/${player_id}`)
            .then((response) => {
                //format date joined
                var getDate = new Date(`${response.data.date_created}`);
                var month = monthArr[getDate.getMonth()];
                var year = getDate.getFullYear();
                var date = getDate.getDate().toString().padStart(2, 0)
                var formattedDate = date + " " + month + " " + year;

                //get necessary info
                this.setState({ name: response.data.player_username, email: response.data.email, dateJoined: formattedDate, goldEarned: `$${response.data.gold}` })
                //get player avatar
                axios.get(`https://monster-cat-world.onrender.com/api/players/getPlayerAvatar/${response.data.image_id}`)
                    .then((result) => {
                        let playerAvatar = result.data.split('./images/')
                        this.setState({ image: require(`../images/` + playerAvatar[1]) })
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            })
            .catch((error) => {
                console.log(error)
            })
        Promise.all(
            [
                //get player friends
                axios.get(`https://monster-cat-world.onrender.com/api/chat/getAllFriends/${player_id}`),
                //get number of clans  join by player
                axios.post(`https://monster-cat-world.onrender.com/api/clanDetails/getAllClans/${player_id}`),
                //get no of card player have
                axios.get(`https://monster-cat-world.onrender.com/api/players/getNumberOfCards/${player_id}`),
                //get total clan point
                axios.get(`https://monster-cat-world.onrender.com/api/clanDetails/totalClanPoints/${player_id}`)
            ]
        )
            .then(([friendsCount, clansCount, cardsCount, clanPoints]) => {

                document.getElementById('profile_clan_points_earned').innerHTML = `${clanPoints.data.total_points} pts`
                this.setState({ noOfFriends: friendsCount.data.length, noOfClans: clansCount.data.length, noOfCards: `${cardsCount.data[0].cardsNo}`, noOfCards: cardsCount.data[0].cardsNo })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    render() {
        return (

            <div id="profile-card">
                <img src={ProfileBorder} id="profileBorder" />
                <div>
                    <p id="profile">Profile</p>

                    <div id="playerBasicInfo">
                        <div id="imageDiv">
                            <img src={this.state.image} id="charImage" />
                        </div>
                        <div id="nameEmail">
                            <p class="infoLabelProfile">Player ID: <span class="infoSpanProfile" id="profile_id">{this.state.player_id}</span></p>
                            <p class="infoLabelProfile">Name: <span class="infoSpanProfile" id="profile_name">{this.state.name}</span></p>
                            <p class="infoLabelProfile">Email: <span class="infoSpanProfile" id="profile_email">{this.state.email}</span></p>

                        </div>


                    </div>
                    <div id="dataInfo">
                        <div id="rightInfo">
                            <p class="infoLabelProfile2">Date joined: <span class="infoSpanProfile2" id="profileDate">{this.state.dateJoined}</span></p>
                            <p class="infoLabelProfile2">Gold earned: <span class="infoSpanProfile2" id="profileGoldEarned">{this.state.goldEarned}</span></p>
                            <p class="infoLabelProfile2">Clan points earned: <span class="infoSpanProfile2" id="profile_clan_points_earned">{this.clanPoints}</span></p>
                            <p class="infoLabelProfile2">No of card: <span class="infoSpanProfile2" id="profile_no_of_cards">{this.state.noOfCards}</span></p>
                            <p class="infoLabelProfile2">No of friends: <span class="infoSpanProfile2" id="profile_no_of_friends">{this.state.noOfFriends}</span></p>
                            <p class="infoLabelProfile2">No of clans: <span class="infoSpanProfile2" id="profile_no_of_clans">{this.state.noOfClans}</span></p>
                        </div>

                    </div>
                </div>
            </div>

        )
    }

}

export default Profile