
//get html elements 
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitSignOut");
let genderValue = ''
let image_id = ''
//onclick events
submitBtn.onclick = signUp;

document.addEventListener("DOMContentLoaded", function (event) {
    let token = localStorage.getItem('token');
    //let's verify the token
    var headersConfig = {
        'authorisation': "Bearer " + token
    }
    axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
        .then((response) => {
            document.getElementById('alert-box').innerHTML = `
                <div class="warning">
                <p id="text">Sorry you are already logged in</p>
            </div>   
                `
            setTimeout(() => {
                document.getElementById('alert-box').innerHTML = ''
            }, 3000)

            document.getElementById('submitSignOut').disabled = true;
        })
        .catch((error) => {
            console.log(error)
        })

})


function signUp() {
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

    //all values cannot be null
    //validation of inputs
    //email must be in the form of ***@mail.com
    if (!(email.value == '') || !(password.value == '') || !(confirmPassword.value == '') || !(genderValue == null)|| !(username.value == '')) {
        if (!email.value.match(pattern) || !password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) || confirmPassword.value != password.value) {
               //email must be in the form of ***@mail.com
            if (!email.value.match(pattern)) {
                email.style.border = '2px solid red';
                document.getElementById('alert-box').innerHTML = `
                <div class="warning">
                <p id="text">Email needs to be in the form of 'example@mail.com'</p>
            </div>   
                `
                setTimeout(() => {
                    document.getElementById('alert-box').innerHTML = ''
                }, 3000)
                return;
            }
               //Password must have at least 6 characters, 1 upper & lower case and a number
            if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                password.style.border = '2px solid red';
                document.getElementById('alert-box').innerHTML = `
                <div class="warning">
                <p id="text">Password must have at least 6 characters, 1 upper & lower case and a number</p>
            </div>   
                `
                setTimeout(() => {
                    document.getElementById('alert-box').innerHTML = ''
                }, 3000)
                return;

            }
            //confirm password and password must match
            if (confirmPassword.value != password.value) {
                password.style.border = '2px solid red';
                confirmPassword.style.border = '2px solid red';
                document.getElementById('alert-box').innerHTML = `
                <div class="warning">
                <p id="text">Password does not match</p>
            </div>   
                `
                setTimeout(() => {
                    document.getElementById('alert-box').innerHTML = ''
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
            axios.get(`${API_URL}/api/players/getAllPlayers`)
                .then((response) => {
                    console.log(response.data)
                    //check if username or email is used
                    //no duplicates of username or email is allowed
                    for (let x = 0; x < response.data[0].length; x++) {
                        if (email.value == response.data[2][x]) {
                            email.style.border = '2px solid red';
                            document.getElementById('alert-box').innerHTML = `
                            <div class="warning">
                            <p id="text">Email is already in use</p>
                        </div>   
                            `
                            setTimeout(() => {
                                document.getElementById('alert-box').innerHTML = ''
                            }, 3000)
                            return;
                        }
                        if (username.value == response.data[1][x]) {
                            username.style.border = '2px solid red';
                            document.getElementById('alert-box').innerHTML = `
                            <div class="warning">
                            <p id="text">Username is already in use</p>
                        </div>   
                            `
                            setTimeout(() => {
                                document.getElementById('alert-box').innerHTML = ''
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
                                    //success
                                    const alert_box = document.getElementById("alert-box")
                                    alert_box.innerHTML =
                                        `  <div class="alert">
                            <p id="congrats">Congratulations! You are now a player!<span style="display: block; margin-top: 2%;">You get $10 as a welcome gift :D</span></p>
                            <p>Your given avatar:</p>
                            <img src="${response.data}" width="40%">
                
                        </div>`

                                    //lead player to login
                                    setTimeout(() => window.location.assign(`${API_URL}/login.html`), 4000);
                                    return;
                                })
                                .catch((error) => { console.log(error) })
                            console.log(response);


                        })
                        .catch((error) => {
                            console.log(error);
                            if (error.response.status == 400) {
                                console.log(error)
                                document.getElementById('alert-box').innerHTML = `
                                <div class="warning">
                                <p id="text">Fill in all inputs!!!</p>
                            </div>   
                                `
                                setTimeout(() => {
                                    document.getElementById('alert-box').innerHTML = ''
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

