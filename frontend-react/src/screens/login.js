import '../css/login.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Route,
    useParams,
    Routes,
    BrowserRouter
} from "react-router-dom";
import NavBar from '../components/NavBar';
import LoadingGif from '../images/gif/LoginLoading.GIF'
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id');
if (window.location.hostname === "localhost" && window.location.port === "3001") {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}

class Login extends React.Component {

    constructor() {
        super();
        this.navBarRef = React.createRef();
        this.state = {
            alert: '',
            showAlert: false
        }
        this.login = this.login.bind(this);
        this.alert = this.alert.bind(this);
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        //let's verify the token
        var headersConfig = {
            'authorisation': "Bearer " + token
        }
        axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
            .then((response) => {
                this.alert();
            })
            .catch((error) => {
                console.log(error)
            })


    }

    //functions
    //checking validity of email & password for login
    login() {
        const email = document.getElementById("loginEmail2");
        const password = document.getElementById("loginPassword2")
        console.log(email.value, password.value);
        const bodyData = {
            username: email.value,
            email: email.value,
            password: password.value,
            status: 'online',
            last_login: new Date()
        }
        axios.post(`${REACT_URL}/api/players/login`, bodyData)
            .then((response) => {
                console.log(response);
                if (response.data == "Incorrect username or password") {
                    window.alert(response.data);
                }
                else if (response.data.message == 'You have successfully logged in') {
                    var alert = [];
                    alert.push(
                        <img src={LoadingGif} id='loginDoneGIf' />
                    )
                    this.setState({ alert: alert })
                    email.value = '';
                    password.value = '';
                    if (response.data.token != null) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('player_id', response.data.player_id);
                        localStorage.setItem('player_username', response.data.player_username);
                    }
                    this.checkNav();
                    document.getElementById('loginButton').disabled = true;
                    document.getElementById('loginEmail2').disabled = true;
                    document.getElementById('loginPassword2').disabled = true;

                    setTimeout(() => {
                        this.setState({ alert: '' })
                        window.location.assign(`${REACT_URL}/`)
                    }, 3000)

                }

            })
            .catch((error) => {
                if (error) {
                    console.log(error)
                }
                else if (error.response.status == 400) {
                    console.log(error)
                    window.alert(error.response.data)
                };
            })
    }

    checkNav() {
        if (this.navBarRef && this.navBarRef.current) {
            this.navBarRef.current.checkUnauthorisedAccess();
        }
    }

    alert() {
        var alert = [];

        alert.push(
            <div class="warning" style={{marginTop:'10%'}}>
                <p id="loginAlertText">Sorry you have already logged in</p>
            </div>
        )
        this.setState({ alert: alert })
        setTimeout(() => {
            this.setState({ alert: '' })
        }, 3000)


        document.getElementById('loginButton').disabled = true;
        document.getElementById('loginEmail2').disabled = true;
        document.getElementById('loginPassword2').disabled = true;
    }

    render() {
        return (
            <div>
                <NavBar ref={this.navBarRef} />
                <div className="login">
                    <form id="loginForm">
                        <p id="loginText">Log in</p>
                        <img src={require('../images/gif/knight.gif')} id="knight" />
                        <img src={require('../images/extraChar1.PNG')} id="loginCharacter" />

                        <div class="groupDiv" id="emailDiv">
                            <label for="email" class="loginLabel">Email/Username :</label>
                            <input type="text" class="loginInputs" id="loginEmail2" placeholder='Email/Username' />
                        </div>
                        <div class="groupDiv" id="passwordDiv">
                            <label for="password" class="loginLabel">Password :</label>
                            <input type="password" class="loginInputs" id="loginPassword2" placeholder="password" />
                        </div>

                        <div class="clearfix">
                            <a href="/ForgetPassword" class="" id="forgetText">Forgot Password? </a>
                        </div>

                        <div class="groupDiv">
                            <button type="button" id="loginButton" onClick={this.login}>Log in</button>
                        </div>

                    </form>
                    <div id="loginAlertBox">
                        {this.state.alert}
                    </div>
                </div>


            </div>
        )
    }
}

export default Login;