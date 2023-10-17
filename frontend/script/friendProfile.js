const API_URL = 'https://monster-cat-world.onrender.com'

//Temporary Testing Data before connecting with other tables 
const PLAYERIDTEMP = localStorage.getItem('PlayerID');
const FRIENDIDTEMP = localStorage.getItem('FriendID');

const name = document.getElementById('name');
const profile = document.getElementById('profile');
const allFriends = document.getElementById("allFriends");

function friendDetail(playerID, friendID) {
    axios.get(API_URL + '/api/friendsRoute/friendBase/' + playerID + "/" + friendID)
        .then((response) => {
            console.log(response);
            name.innerHTML = response.data[0].player_id;
            profile.innerHTML = response.data[0].player_username;
        })
        .catch(function (error) {
            //console.log(error);
        })
}


friendDetail(PLAYERIDTEMP, FRIENDIDTEMP)