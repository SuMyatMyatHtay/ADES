
const player_id = localStorage.getItem('player_id');
const email=document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById("confirmPassword");
const confirmBtn = document.getElementById("confirm");
const back2Login = document.getElementById("back2login");

confirmBtn.onclick = forgetPassword;
back2Login.onclick = () => { window.location.assign(`${API_URL}/login.html`) }

function forgetPassword() {

    password.style.border = '1px solid black';
    confirmPassword.style.border = '1px solid black';
    


    if (!password.value == '' || !confirmPassword.value == '') {
        if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/) || confirmPassword.value != password.value) {
            if (!password.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
                password.style.border = '2px solid red';
                document.getElementById('success').innerHTML = `
                <div id="alertBox">
                        <p>
                        Password must have at least 1 number, 1 uppercase letter and it must be at least 6 characters
                        </p>
                    </div>`;

                setTimeout(() => {
                    document.getElementById('success').innerHTML = ''
                }, 5000)
                return;
            }
            if (confirmPassword.value != password.value) {
                password.style.border = '2px solid red';
                confirmPassword.style.border = '2px solid red';
                document.getElementById('success').innerHTML = `
                <div id="alertBox">
                        <p>
                        Make sure both inputs are the same
                        </p>
                    </div>`;

                setTimeout(() => {
                    document.getElementById('success').innerHTML = ''
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
            if(result.data[0].affectedRows==1){
            document.getElementById('success').innerHTML = `
            <div id="alertBox">
                    <p>
                        Password Changed!! Don't forget your password next time...
                    </p>
                </div>`;

            setTimeout(() => {
                document.getElementById('success').innerHTML = ''
            }, 3000)
            console.log(result);
            password.value = "";
            confirmPassword.value = "";
            email.value="";
        }
        else{
            document.getElementById('success').innerHTML = `
            <div id="alertBox">
                    <p>
                        Email/Username not found...Have you sign up?
                    </p>
                </div>`;

            setTimeout(() => {
                document.getElementById('success').innerHTML = ''

            }, 3000)
           
           
        }
            return;
        })
        .catch((error) => {
            if (error.response.status == 400) {
                console.log(error)
                document.getElementById('success').innerHTML = `
                <div id="alertBox">
                        <p>
                            Fill All Inputs
                        </p>
                    </div>`;

                setTimeout(() => {
                    document.getElementById('success').innerHTML = ''
                }, 3000)
                return;
            };
            console.log(error);
            return;
        })
}
