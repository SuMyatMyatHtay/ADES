
//Temporary Testing Data before connecting with other tables 
const PLAYERIDTEMP = localStorage.getItem('player_id');
localStorage.setItem('player_id', PLAYERIDTEMP);

const allFriends = document.getElementById("allFriends");
const FriendListArea = document.getElementById('FriendListArea')
const txtDisplay = document.getElementById("messagesDisplay");


window.onload = function () { allFriendsFunction(PLAYERIDTEMP) };

//This is to print out all the friends that the user have 
function allFriendsFunction(playerID) {
    axios.get(API_URL + '/api/friendsRoute/friendBase/' + playerID)
        .then((response) => {
            console.log(response.data);
            FriendDisplay(response.data);
        })
        .catch(function (error) {
            console.log(error);
            FriendDisplay(error);
        })
}


function FriendDisplay(objData) {

    console.log(objData.length)
    let EachFriend = ` `
    for (var i = 0; i < objData.length; i++) {
        EachFriend += ` 
        <div class="container"
            style="background-color: rgba(0, 0, 0, 0.884); margin: 25px; border: 3px solid rgb(145, 0, 207);">
            <div class="row align-items-center p-1">
                <div class="col-md-3 profilePic" style="padding-left: 50px;">
                    <img src="${objData[i].image_path}" alt="PlayerProfile" style="width: 150px;">
                </div>
                <div class="col-md-9 profileDetail">
                    <h1>${objData[i].FriendName}</h1>
                    <div style="margin: 8px;">
                        <button onclick="GoToFriendProfile(${objData[i].FriendID})" class=" custom-button btn btn-primary">Check</button>
                        <button onclick="GoTrade(${objData[i].FriendID})" class="custom-button btn btn-primary">Trade</button>
                    </div>

                </div>
            </div>
        </div>

        `
    }

    FriendListArea.innerHTML = EachFriend;
}

function GoToFriendProfile(tempID) {
    localStorage.setItem('tempPlayerID', PLAYERIDTEMP);
    localStorage.setItem('player_id', tempID);
    window.location.href = 'friendProfile.html'
}
function GoTrade(tempID) {
    localStorage.setItem('FriendID', tempID);
    window.location.href = 'trading.html'
}

// function allFriendsFunction(playerID) {
//     axios.get(API_URL + '/api/friendsRoute/' + playerID)
//         .then((response) => {
//             console.log(response);
//             DisplayResponse(response.data);
//         })
//         .catch(function (error) {
//             DisplayResponse(error);
//         })
// }
// function DisplayResponse(objData) {
//     txtDisplay.innerHTML = "";
//     let sData = JSON.stringify(objData);
//     txtDisplay.append(sData);

//     //txtDisplay.append(objData[0].PlayerID_Send);
// }