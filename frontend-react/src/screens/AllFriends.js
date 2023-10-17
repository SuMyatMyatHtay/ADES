
import React from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios

import 'bootstrap/dist/css/bootstrap.css';
import Instructions from '../components/AF_Component'
import NavBar from '../components/NavBar'

import '../css/allFriends.css';
import FriendsBorder from '../images/FriendsBorder.png';
import AFBG from '../images/FriendBg.jpg'

const playerID = localStorage.getItem('player_id')

const API_URL = 'https://monster-cat-world.onrender.com';

class AllFriendsScreen extends React.Component {
    constructor() {
        super();

    }



    render() {
        return (
            <div >
                <NavBar />
                <div className='Main' style={{
                    overflow: 'scroll', height: '100vh', backgroundImage: `url(${AFBG})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", padding: "0px 0px 100px 0px"
                }}>
                    <style>
                        {`
        .Main::-webkit-scrollbar {
            width: 0;
            height: 0; 
        }
        
        `}
                    </style>

                    <div className='imgDiv'>
                        <img src={FriendsBorder} alt="Friends Badge" />
                    </div>
                    <Instructions />

                </div >
            </div>

        );
    }
}

export default AllFriendsScreen;


/*
import React from 'react'; // Import React from 'react' instead of importing Component
import axios from 'axios'; // Import axios

import 'bootstrap/dist/css/bootstrap.css';
import Instructions from '../components/AF_Component'

import '../css/allFriends.css';
import FriendsBorder from '../images/FriendsBorder.png';


let everyFriends = []


const API_URL = 'https://monster-cat-world.onrender.com';

class AllFriendsScreen extends React.Component {
    constructor() {
        super();

        this.state = {
            friendListAreaR: "Loading ...",
            playerID: localStorage.getItem('player_id'),
            everyFriendsR: everyFriends
        }


    }

    componentDidMount() {
        axios
            .get(`${API_URL}/api/friendsRoute/friendBase/${(this.state.playerID)}`)
            .then((response) => {
                //console.log(response.data);
                everyFriends = [];
                for (var i = 0; i < response.data.length; i++) {
                    everyFriends.push([response.data[i].FriendID, response.data[i].FriendName, response.data[i].image_path])

                }
                this.setState({ everyFriendsR: everyFriends })
                //this.FriendDisplay(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const divElements = [];

        for (let i = 0; i < Math.ceil(this.state.everyFriendsR.length); i++) {

            divElements.push(<Instructions name={this.state.everyFriendsR[i][1]} imagePath={this.state.everyFriendsR[i][2]} PID={this.state.everyFriendsR[i][0]} />)
        }



        console.log(divElements)
        console.log(this.state.everyFriendsR)
        return (
            <div className='Main' >
                <div className='imgDiv'>
                    <img src={FriendsBorder} alt="Friends Badge" />
                </div>
                <div className=" FriendListArea" style={{ width: "100%", color: "white", paddingTop: "20px", display: "flex", flexWrap: 'wrap', justifyContent: "center" }}>
                    {divElements}

                </div>
            </div >

        );
    }
}

export default AllFriendsScreen;
*/

