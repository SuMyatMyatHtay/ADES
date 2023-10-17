import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import '../css/signUp.css';
var REACT_URL = 'https://monster-cat-world.onrender.com';
const API_URL = 'https://monster-cat-world.onrender.com';
if (window.location.hostname === "localhost" && window.location.port === "3001") {
    REACT_URL = window.location.protocol + "//" + window.location.hostname + ":" + "3000";
}
let genderValue = ''
let image_id = ''

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            alert: ''
        }
        this.signUp = this.signUp.bind(this);
    }
    componentDidMount() {
        let token = localStorage.getItem('token');
        //let's verify the token
        var headersConfig = {
            'authorisation': "Bearer " + token
        }
        axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
            .then((response) => {
                var alert = [];
                alert.push(
                    <div class="signUpwarning">
                        <p id="signUpError">Sorry you are already logged in</p>
                    </div>
                )
                this.setState({ alert: alert })
                setTimeout(() => {
                    this.setState({ alert: '' })
                }, 3000)

                document.getElementById('submitSignUp').disabled = true;
            })
            .catch((error) => {
                console.log(error)
            })

    }

    signUp() {
        var username = document.getElementById("signUpUsername");
        var email = document.getElementById("signUpEmail");
        var password = document.getElementById("signUpPassword");
        var confirmPassword = document.getElementById("confirmPassword");

        username.style.border = '1px solid black';
        email.style.border = '1px solid black';
        password.style.border = '1px solid black';
        confirmPassword.style.border = '1px solid black';
        const pattern = /^[a-zA-Z0-9._%+-]+@mail\.com$/;
        var radioButtons = document.querySelectorAll("input[type='radio'][name='gender']")
        for (let x = 0; x < radioButtons.length; x++) {
            if (radioButtons[x].checked) {
                genderValue = radioButtons[x].value;
            }
        }
        console.log(email.value, password.value, confirmPassword.value, genderValue, username.value)
        //all values cannot be null
        //validation of inputs
        //email must be in the form of ***@mail.com
        if (!(email.value == '') || !(password.value == '') || !(confirmPassword.value == '') || !(genderValue == null) || !(username.value == '')) {
            if (!email.value.match(pattern) || !password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) || confirmPassword.value != password.value) {
                //email must be in the form of ***@mail.com
                if (!email.value.match(pattern)) {
                    var alert = []
                    email.style.border = '2px solid red';
                    alert.push(
                        <div class="signUpwarning">
                            <p id="signUpError">Email needs to be in the form of 'example@mail.com'</p>
                        </div>
                    )
                    console.log(alert)
                    this.setState({ alert: alert })
                    setTimeout(() => {
                        this.setState({ alert: '' })
                    }, 3000)
                    return;
                }
                //Password must have at least 6 characters, 1 upper & lower case and a number
                if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                    var alert = [];
                    password.style.border = '2px solid red';
                    alert.push(
                        <div class="signUpwarning">
                            <p id="signUpError">Password must have at least 6 characters, 1 upper & lower case and a number</p>
                        </div>
                    )
                    this.setState({ alert: alert })
                    setTimeout(() => {
                        this.setState({ alert: '' })
                    }, 3000)
                    return;

                }
                //confirm password and password must match
                if (confirmPassword.value != password.value) {
                    var alert = []
                    password.style.border = '2px solid red';
                    confirmPassword.style.border = '2px solid red';
                    alert.push(
                        <div class="signUpwarning">
                            <p id="signUpError">Password does not match</p>
                        </div>
                    )
                    this.setState({ alert: alert })
                    setTimeout(() => {
                        this.setState({ alert: '' })
                    }, 3000)

                    return;
                }
            }

        }

        axios.get(`${API_URL}/api/players/getImages`)
            .then((result) => {
                //choose avatar (random generated based on gender)
                if (genderValue == "male") {
                    const randomIndex = Math.floor(Math.random() * result.data.male_Images.length);
                    image_id = result.data.male_Images[randomIndex];
                    console.log(image_id)
                }
                else if (genderValue == "female") {
                    const randomIndex = Math.floor(Math.random() * result.data.female_Images.length);
                    image_id = result.data.female_Images[randomIndex];
                    console.log(image_id)
                }
                axios.get(`${REACT_URL}/api/players/getAllPlayers`)
                    .then((response) => {
                        console.log(response.data)
                        //check if username or email is used
                        //no duplicates of username or email is allowed
                        for (let x = 0; x < response.data[0].length; x++) {
                            if (email.value == response.data[2][x]) {
                                var alert = []
                                email.style.border = '2px solid red';
                                alert.push(
                                    <div class="signUpwarning">
                                        <p id="signUpError">Email is already in use</p>
                                    </div>
                                )
                                this.setState({ alert: alert })
                                setTimeout(() => {
                                    this.setState({ alert: '' })
                                }, 3000)
                                return;
                            }
                            if (username.value == response.data[1][x]) {
                                var alert = []
                                username.style.border = '2px solid red';
                                alert.push(
                                    <div class="signUpwarning">
                                        <p id="signUpError">Username is already in use</p>
                                    </div>
                                )
                                this.setState({ alert: alert })
                                setTimeout(() => {
                                    this.setState({ alert: "" })
                                }, 3000)
                                return;
                            }
                        }
                        //inserting into db
                        const bodyData = {
                            player_id: response.data[0].length + 1,
                            username: username.value,
                            email: email.value,
                            password: password.value,
                            gold: 10.00,
                            image_id: image_id
                        }

                        axios.post(`${API_URL}/api/players/addPlayer`, bodyData)
                            .then((response) => {
                                axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                                    .then((response) => {
                                        var playerImagePath = response.data.split("./images/")
                                        //success
                                        var alert = []
                                        alert.push(
                                            <div class="alert">
                                                <p id="congrats">Congratulations! You are now a player!<span style={{ display: 'block', marginTop: '2%' }}>You get $10 as a welcome gift :D</span></p>
                                                <p>Your given avatar:</p>
                                                <img src={`${require(`../images/` + playerImagePath[1])}`} width={"40%"} />

                                            </div>
                                        )
                                        this.setState({ alert: alert })
                                        //lead player to login
                                        setTimeout(() => window.location.assign(`${REACT_URL}/Login`), 4000);
                                        return;
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })

                            })
                            .catch((error) => {
                                if (error.response.status == 400) {
                                    console.log(error);
                                    var alert = [];
                                    alert.push(
                                        <div class="signUpwarning">
                                            <p id="signUpError">Fill in all inputs!!!</p>
                                        </div>
                                    )
                                    this.setState({ alert: alert })
                                    setTimeout(() => {
                                        this.setState({ alert: '' })
                                    }, 3000)
                                };
                            })

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }


    render() {
        return (
            <div id="signUpBody">
                <NavBar />
                <div class="signUp">
                    <div class="main">
                        <img src={require(`../images/ExtraChar3.PNG`)} id="signUpCharacter" />
                        <p id="signUpText">Sign Up</p>
                        <div class="signUpDiv" >
                            <label for="username">Username :</label>
                            <input type="text" class="signUpInputs" id="signUpUsername" placeholder="username" />
                            <p class="error" id="username-error"></p>
                        </div>
                        <div class="signUpDiv">
                            <label for="email">Email :</label>
                            <input type="text" class="signUpInputs" id="signUpEmail" placeholder="example@mail.com" />
                            <p class="error" id="email-error"></p>
                        </div>
                        <div class="signUpDiv">
                            <label for="password">Password :</label>
                            <input type="password" class="signUpInputs" id="signUpPassword" placeholder="password" />
                            <p class="error" id="password-error"></p>
                        </div>
                        <div class="signUpDiv">
                            <label for="ConfirmPassword">Confirm password :</label>
                            <input type="password" class="signUpInputs" id="confirmPassword" placeholder="re-type your password" />
                            <p class="error" id="confirm-password error"></p>
                        </div>
                        <div class="signUpDiv" id="genderSignUp">
                            <label for="">Gender:</label>
                            <div class="radioOpt">
                                <input type="radio" id="maleOpt" name="gender" value="male" class="signUpRadio" />
                                <label for="opt1">Male</label>
                            </div>
                            <div class="radioOpt">
                                <input type="radio" id="femaleOpt" name="gender" value="female" class="signUpRadio" />
                                <label for="opt2">Female</label>
                            </div>
                        </div>
                        <button id="submitSignUp" type="button" onClick={this.signUp}>Sign Up</button>
                    </div>
                </div>

                <div id="signUpAlert">
                    {this.state.alert}
                </div>
            </div>


        )
    }
}

export default SignUp