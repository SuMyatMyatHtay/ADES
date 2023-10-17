
//get Id of HTML elements
const email = document.getElementById("email");
const password = document.getElementById("password")
const loginBtn = document.getElementById("login");
const forget = document.getElementById("forget")

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
                <p id="text">Sorry you have already logged in</p>
            </div>   
                `
            setTimeout(() => {
                document.getElementById('alert-box').innerHTML = ''
            }, 3000)


                document.getElementById('login').disabled = true;
            
        })
        .catch((error) => {
            console.log(error)
        })

})
//on click
loginBtn.onclick = login;

//functions
//checking validity of email & password for login
function login() {
    console.log(email.value, password.value);
    const bodyData = {
        username: email.value,
        email: email.value,
        password: password.value,
    }
    console.log(bodyData);
    axios.post(`${API_URL}/api/players/login`, bodyData)
        .then((response) => {
            console.log(response);
            if (response.data == "Incorrect username or password") {
                window.alert(response.data);
            }
            else if (response.data.message == 'You have successfully logged in') {
                window.alert(response.data.message);
                email.value = '';
                password.value = '';
                if (response.data.token != null) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('player_id', response.data.player_id);
                    localStorage.setItem('player_username', response.data.player_username);
                }

            }
            checkUnauthorisedAccess()
        })
        .catch((error) => {
            console.log(error)
            if (error.response.status == 400) {
                console.log(error)
                window.alert(error.response.data)
            };
        })
}

