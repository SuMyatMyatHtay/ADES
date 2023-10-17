import '../css/homepage.css';
import React from 'react';
import NavBar from '../components/NavBar';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import WarPriest from '../fonts/WarPriestRegular-PanE.ttf'
import Logo from '../images/logo.PNG'
const API_URL = 'https://monster-cat-world.onrender.com'
const REACT_URL = 'https://monster-cat-world.onrender.com'
class App extends React.Component {
    constructor() {
        super()
    }


    login() {
        window.location.assign(`${REACT_URL}/Login`)
    }
    signUp() {
        window.location.assign(`${REACT_URL}/SignUp`)
    }
    render() {
        return (
            <div id="homepage">
                <NavBar />
                <div id="homepageDetails">
                    <p className='title' >Monster World</p>
                    <div  style={{display:'flex'}}>
                    <img src={Logo} id="HPlogo" />
                    </div>
                    <p id="description">Mark your dominance on the battlefield today!</p>
                    <div className="homePagebuttons">
                        <button id="toLogin" className="homePagebutton" onClick={() => { this.login() }}>Log In</button>
                        <button id="signUp" className="homePagebutton" onClick={() => { this.signUp() }}>Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;