import '../css/nav.css';
import React from 'react';
import logo from '../images/logo.PNG';
import axios from 'axios';

const API_URL = 'https://monster-cat-world.onrender.com';
var REACT_URL = 'https://monster-cat-world.onrender.com';

if (window.location.hostname === 'localhost' && window.location.port === '3001') {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
const player_id = localStorage.getItem('player_id')
const navul = document.getElementById('navul');

class NavBar extends React.Component {
    constructor() {
        super()
        this.state = {
            showClanSub: false,
            showCardSub: false,
            showFriendSub: false,
            showAuthorised: false,
            showNotAuthorised: false
        }

    }


    componentDidMount() {
        this.checkUnauthorisedAccess();
    }


    checkUnauthorisedAccess() {
        const navul = document.getElementById('navul');
        //try to get token
        let token = localStorage.getItem('token');
        //let's verify the token
        var headersConfig = {
            'authorisation': "Bearer " + token
        }
        axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
            .then((response) => {
                //create nav
                navul.style.position = 'static';
                this.setState({ showAuthorised: true, showNotAuthorised: false })

            })
            .catch((error) => {
                console.log(error);
                navul.style.position = 'relative'
                navul.style.right = '-370px'
                this.setState({ showNotAuthorised: true, showAuthorised: false })
                if (document.getElementById('loginButton') != null) {
                    document.getElementById('loginButton').disabled = false;
                    document.getElementById('loginEmail2').disabled = false;
                    document.getElementById('loginPassword2').disabled = false;
                }
                /*
                if (window.location.href != `${API_URL}/login.html` && window.location.href != `${API_URL}/index.html` && window.location.href != `${API_URL}/signup.html` && window.location.href != `${API_URL}/forgetPassword.html`) {
                     window.location.assign(`${API_URL}/index.html`)
                }*/

                if (window.location.href != `${REACT_URL}/Login` && window.location.href != `${REACT_URL}/` && window.location.href != `${REACT_URL}/SignUp` && window.location.href != `${REACT_URL}/ForgetPassword`) {
                 window.location.assign(`${REACT_URL}/`)

                }
            })

    }

    handleClick = (e) => {
        if (e.target.id != "clanNav" && e.target.id != "clanCaretDown") {
            this.setState({ clanSubNav: false })
        }
        if (e.target.id != "cardNav" && e.target.id != "cardCaretDown") {
            this.setState({ cardSubNav: false })
        }
        if (e.target.id != "friendNav" && e.target.id != "friendCaretDown") {
            this.setState({ friendSubNav: false })
        }

        if (e.target.id == "clanNav") {
            this.clanClick();
        }
        if (e.target.id == "cardNav") {
            this.cardClick();
        }
        if (e.target.id == "friendNav") {
            this.friendClick();
        }
        if (e.target.id == "clanCaretDown") {
            this.clanClick();
        }
        if (e.target.id == "cardCaretDown") {
            this.cardClick();
        }
        if (e.target.id == "friendCaretDown") {
            this.friendClick();
        }
        if (!e.target.id.includes("friend") && !e.target.id.includes("clan") && !e.target.id.includes("card")) {
            this.setState({
                showClanSub: false,
                showCardSub: false,
                showFriendSub: false
            });
        }
        if (e.target.id == "signOut") {
            localStorage.clear();
            this.checkUnauthorisedAccess();
        }

    }
    clanClick() {
        this.setState({ showClanSub: true });
    }

    cardClick() {
        this.setState({ showCardSub: true });
    }

    friendClick() {
        this.setState({ showFriendSub: true });
    }




    handleMouseOver = (e) => {
        if (e.target.id == "clanNav") {
            this.setState({
                showClanSub: true,
                showCardSub: false,
                showFriendSub: false
            });
        }

        else if (e.target.id == "cardNav") {
            this.setState({
                showClanSub: false,
                showCardSub: true,
                showFriendSub: false
            });
        }

        else if (e.target.id == "friendNav") {
            this.setState({
                showClanSub: false,
                showCardSub: false,
                showFriendSub: true
            });

        }

        else if (e.target.id == "battleNav" || e.target.id == "profileNav") {
            this.setState({
                showClanSub: false,
                showCardSub: false,
                showFriendSub: false
            });
        }

    }

    handleMouseLeave = (e) => {
        if (e.target.id == "clanSubNav" || e.target.id == "cardSubNav" || e.target.id == "friendSubNav") {
            this.setState({
                showClanSub: false,
                showCardSub: false,
                showFriendSub: false
            });
        }

    }

    render() {
        return (
            <div onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>

                <nav>
                    <p id="gameName" onClick={() => { window.location.assign(`${REACT_URL}/`) }}>Monster World</p>
                    <img src={logo} id="logo" onClick={() => { window.location.assign(`${REACT_URL}/`) }} />
                    <ul id="navul">
                        {this.state.showAuthorised && (
                            <div>
                                <li><a href={`${REACT_URL}/battleScene`} id="battleNav">Battle</a></li>
                                <li id="clanNav" >Clans <i class="fa fa-caret-down" id="clanCaretDown"></i></li>
                                {this.state.showClanSub && (
                                    <div id="clanSubNav" className="subNav">
                                        <ul>
                                            <li><a href={`${REACT_URL}/Clan`}>All Clans</a></li>
                                            <li><a href={`${REACT_URL}/CreateClan`}>Create Clan</a></li>
                                            <li><a href={`${API_URL}/clanRequest`}>Clan Request</a></li>
                                            <li><a href={`${REACT_URL}/clanlist`}>Mini Game</a></li>
                                            <li><a href={`${REACT_URL}/leaderBoardPage`}>LeaderBoard</a></li>
                                        </ul>
                                    </div>
                                )}
                                <li id="cardNav" >Cards <i class="fa fa-caret-down" id="cardCaretDown"></i></li>
                                {this.state.showCardSub && (
                                    <div id="cardSubNav" className="subNav">
                                        <ul>
                                            <li><a href={`${REACT_URL}/CardCollection`}>Card Collection</a></li>
                                            <li><a href={`${REACT_URL}/BuyCards`}>Buy Cards</a></li>
                                        </ul>
                                    </div>
                                )}
                                <li id="friendNav" >Friends <i class="fa fa-caret-down" id="friendCaretDown"></i></li>
                                {this.state.showFriendSub && (
                                    <div id="friendSubNav" className="subNav">
                                        <ul>
                                            <li><a href={`${REACT_URL}/RsearchPlayer`}>Search Players</a></li>
                                            <li><a href={`${REACT_URL}/RallFriends`}>View Friends</a></li>
                                            <li><a href={`${REACT_URL}/RFriReq`}>Friends Request</a></li>
                                            <li><a href={`${REACT_URL}/RTradeReq`}>Trading Request</a></li>
                                            <li><a href={`${REACT_URL}/RTradingGraph`}>Trading Data</a></li>
                                            <li><a href={`${REACT_URL}/ChatMessages`}>Chat</a></li>
                                        </ul>
                                    </div>
                                )}
                                <li ><a href={`${REACT_URL}/Profile`} id="profileNav" >Profile</a></li>
                                <li id="signOut">Sign Out</li>
                            </div>
                        )}
                        {this.state.showNotAuthorised && (
                            <div>
                                <li><a href={`${REACT_URL}/Login`}>Login</a></li>
                                <li><a href={`${REACT_URL}/SignUp`}>Sign Up</a></li>
                            </div>
                        )}
                    </ul>
                </nav>


            </div>
        );
    }
}

export default NavBar;
