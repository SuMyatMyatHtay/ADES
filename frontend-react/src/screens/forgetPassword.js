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
import '../css/login.css'
const react_url = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id');

class ForgetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            success: []
        }
        this.forgetPassword = this.forgetPassword.bind(this);
    }


    forgetPassword() {
        var password = document.getElementById("loginPassword");
        var confirmPassword = document.getElementById('confirmPassword');
        var email = document.getElementById('loginEmail');
        password.style.border = '1px solid black';
        confirmPassword.style.border = '1px solid black';



        if (!password.value == '' || !confirmPassword.value == '') {
            if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) || confirmPassword.value != password.value) {
                if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                    password.style.border = '2px solid red';
                    var success = []
                    success.push(
                        <div id="forgetAlertBox">
                            <p>
                                Password must have at least 1 number, 1 uppercase letter and it must be at least 6 characters
                            </p>
                        </div>
                    )

                    this.setState({ success: success })

                    setTimeout(() => {
                        this.setState({ success: '' })
                    }, 5000)
                    return;
                }
                if (confirmPassword.value != password.value) {
                    password.style.border = '2px solid red';
                    confirmPassword.style.border = '2px solid red';
                    var success = []
                    success.push(
                        <div id="forgetAlertBox">
                            <p>
                                Make sure both inputs are the same
                            </p>
                        </div>)
                    this.setState({ success: success })
                    setTimeout(() => {
                        this.setState({ success: '' })
                    }, 3000)
                    return;
                }
            }

        }

        const bodyData = {
            "email": email.value,
            "password": password.value
        }

        axios.put(`${API_URL}/api/players/updatePassword`, bodyData)
            .then((result) => {
                console.log(result.data[0].affectedRows)
                var success = []
                if (result.data[0].affectedRows == 1) {
                    success.push(
                        <div id="forgetAlertBox">
                            <p>
                                Password Changed!! Don't forget your password next time...
                            </p>
                        </div>
                    )
                    this.setState({ success: success })
                    setTimeout(() => {
                        this.setState({ success: '' })
                    }, 3000)
                    console.log(result);
                    password.value = "";
                    confirmPassword.value = "";
                    email.value = "";
                }
                else {
                    var success = [];
                    success.push(
                        <div id="forgetAlertBox">
                            <p>
                                Email/Username not found...Have you sign up?
                            </p>
                        </div>)
                    this.setState({ success: success })
                    setTimeout(() => {
                        this.setState({ success: '' })

                    }, 3000)


                }
                return;
            })
            .catch((error) => {
                if (error.response.status == 400) {
                    console.log(error)
                    var success = []
                    success.push(
                        <div id="forgetAlertBox">
                            <p>
                                Fill All Inputs
                            </p>
                        </div>)
                    this.setState({ success: success })
                    setTimeout(() => {
                        this.setState({ success: '' })
                    }, 3000)
                    return;
                };
                console.log(error);
                return;
            })
    }

    render() {
        return (
            <div>
                <NavBar />
                <div class="login">
                    <form id="loginForm">
                        <div id="success">
                            {this.state.success}
                        </div>
                        <p id="loginText">Forget Password</p>
                        <div class="groupDiv" id="emailDiv">
                            <label for="username">Email/Username :</label>
                            <input type="text" class="loginInputs" id="loginEmail" />
                        </div>
                        <div class="groupDiv" id="passwordDiv">
                            <label for="password">Password :</label>
                            <input type="password" class="loginInputs" id="loginPassword" />
                        </div>
                        <div class="groupDiv" id="confirmDiv">
                            <label for="confirmPassword">Re-type Password:</label>
                            <input class="loginInputs" type="password" id="confirmPassword" />
                        </div>


                        <div class="groupDiv" id="forgetPasswordButtons">

                            <button type="button" id="confirm" onClick={this.forgetPassword}>Confirm</button>
                            <button type="button" id="back2login" onClick={() => { window.location.assign(`${API_URL}/Login`) }}>Back to login</button>
                        </div>

                    </form>

                </div>
            </div>
        )
    }
}
export default ForgetPassword