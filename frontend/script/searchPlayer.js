


const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');


const Search = document.getElementById('Search');
const SearchResults = document.getElementById('SearchResults');
const SearchImpact = document.getElementById('SearchImpact');

window.onload = function () {
    let tempKey = document.getElementById('keyword');
    let tempnameKey = document.getElementById('namekeyword');
    let searchKeyword = tempKey.value;
    let nameKeyword = tempnameKey.value;
    clickOnSearch(PLAYERIDTEMP, searchKeyword, nameKeyword)
};

Search.onclick = function () {
    let tempKey = document.getElementById('keyword');
    let tempnameKey = document.getElementById('namekeyword');
    let searchKeyword = tempKey.value;
    let nameKeyword = tempnameKey.value;
    clickOnSearch(PLAYERIDTEMP, searchKeyword, nameKeyword)
};

function clickOnSearch(playerID, keyword, nameKeyword) {
    if ((keyword == null || keyword == "") && (nameKeyword == null || nameKeyword == "")) {
        var linkTemp = 'searchWithID/' + playerID
    }
    else if (nameKeyword == null || nameKeyword == "") {
        var linkTemp = 'searchWithID/' + playerID + '?keywordSearch=' + keyword
    }
    else if (keyword == null || keyword == "") {
        var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword
    }
    else {
        var linkTemp = 'searchWithName/' + playerID + '?keywordSearch=' + nameKeyword + '&keywordID=' + keyword
    }
    axios.post(API_URL + '/api/searchRoute/' + linkTemp)
        .then((response) => {
            console.log(linkTemp)
            console.log(response)
            console.log(response.data);
            AllUsersDisplay(response.data, playerID);

        })
        .catch(function (error) {
            console.log(error);
            AllUsersDisplay(error);
        })
}

function checFriOrNot(objData, mainplayer_id) {
    axios.post(API_URL + '/api/searchRoute/checFriOrNot/' + playerID)
        .then((response) => {
            console.log("checFriOrNot response.data.length = " + response.data.length);
            let friButton = ``;
            if (response.data.length == 0) {
                friButton += `<button onclick="checkDuplicateFriReq(${objData[i].player_id}, ${mainplayer_id})">Send Request</button>`
            }
            else {
                friButton += `<button>Friends</button>`
            }
        })
        .catch(function (error) {
            console.log("checFriOrNot is in error!");
            console.log(error);
            SearchImpact.innerHTML = `<h2 style="text-align: center;">  checkFriOrNot Function Error </h2>`
        })
}

function AllUsersDisplay(objData, mainplayer_id) {
    console.log(objData);
    console.log(objData.length);
    console.log(mainplayer_id);
    let EachFriend = ` `
    if (objData.length == 0) {
        EachFriend += `<h3> You do not have any pending friend request </h3>`
    }
    else {
        EachFriend += `
        <div>`
        for (var i = 0; i < objData.length; i++) {
            if (objData[i].player_id == mainplayer_id) {
                var friCheckButton = `<button class="custom-button" >Check your own profile</button>`
            }
            else if (objData[i].ReqCheck == '1') {
                var friCheckButton = `<button class="custom-button" onclick="checkDuplicateFriReq(${objData[i].player_id}, ${mainplayer_id})">Accept Friend Request</button>`
            }
            else if (objData[i].friCheck == '0') {
                var friCheckButton = `<button class="custom-button" onclick="checkDuplicateFriReq(${objData[i].player_id}, ${mainplayer_id})">Send Request</button>`
            }
            else {
                var friCheckButton = `<img src="./images/friendsButton.png" alt="Friends Already" style="width: 170px;">`
            }
            EachFriend += ` 
                <div class="container"
                    style="background-color: rgba(0, 0, 0, 0.884); margin: 25px; border: 3px solid rgb(145, 0, 207);">
                    <div class="row align-items-center p-1">
                        <div class="col-md-3 profilePic" style="padding-left: 50px;">
                            <img src="${objData[i].image_path}" alt="PlayerProfile" style="width: 150px;">
                        </div>
                        <div class="col-md-9 profileDetail">
                            <h3>${objData[i].player_username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #${objData[i].player_id}</h3>
                            
                            <div style="margin: 8px;">
                                <button onclick="GoToFriendProfile(${objData[i].player_id})" class=" custom-button btn btn-primary">Check</button>
                                ${friCheckButton}
                            </div>

                        </div>
                    </div>
                </div>


        `
        }
        EachFriend += `</div>`
    }
    SearchResults.innerHTML = EachFriend;
}

function GoToFriendProfile(tempID) {
    localStorage.setItem('FriendID', tempID);
    window.location.href = 'friendProfile.html'
}

//Sending Friend Request
function checkDuplicateFriReq(tempID, mainplayer_id) {
    axios.post(API_URL + '/api/searchRoute/checkDuplicateFriReq', {
        "friendID": tempID,
        "mainplayer_id": mainplayer_id
    })
        .then((response) => {
            console.log(response.data);
            if (response.data.length == 0) {
                checkDuplicateFriReqToAccept(tempID, mainplayer_id)

            }
            else {
                SearchImpact.innerHTML = `<h2 style="text-align: center;">  You Already sent the friend request </h2>`
            }

        })

        .catch(function (error) {
            console.log(error);
        })
}

function checkDuplicateFriReqToAccept(tempID, mainplayer_id) {
    axios.post(API_URL + '/api/searchRoute/checkDuplicateFriReqToAccept', {
        "friendID": tempID,
        "mainplayer_id": mainplayer_id
    })
        .then((response) => {
            console.log(response.data);
            if (response.data.length == 0) {
                SendFriReq(tempID, mainplayer_id);
            }
            else if (response.data.length == 1) {
                //console.log("The player already sent you the request. You are now friends")
                SearchImpact.innerHTML = `<h2 style="text-align: center;">  The player already sent you the request. So, you are now friends </h2>`
                acceptRequest(tempID);
            }
            else {
                SearchImpact.innerHTML = `<h2 style="text-align: center;">  unexpected error occurs in checkDuplicateFriReqToAccept function </h2>`

            }

        })

        .catch(function (error) {
            console.log(error);
        })
}

function SendFriReq(tempID, mainplayer_id) {
    axios.post(API_URL + '/api/searchRoute/sentFriReq', {
        "friendID": tempID,
        "mainplayer_id": mainplayer_id
    })
        .then((response) => {
            console.log(response.data);
            console.log("FriendRequest Sent!");
            SearchImpact.innerHTML = `<h2 style="text-align: center;">FriendRequest Sent!</h2>`

        })
        .catch(function (error) {
            console.log(error);
        })
}


//These are from friendRequest page 
function acceptRequest(tempID) {
    axios.post(API_URL + '/api/friendReqRoute/addToFriendship/' + PLAYERIDTEMP + '/' + tempID)

        .then((response) => {
            console.log(response)
            console.log(response.data);
            console.log("Accepted the friend request.")
        })
        .then(() => {
            deleteRequest(tempID);
        })
        .catch(function (error) {
            console.log(error);
        })
}


function deleteRequest(tempID) {
    axios.delete(API_URL + '/api/friendReqRoute/friReqDelete/' + PLAYERIDTEMP + '/' + tempID)
        .then((response) => {
            console.log(response)
            console.log(response.data);
            setTimeout(function () {
                location.reload();
            }, 1000);
        })
        .catch(function (error) {
            console.log(error);
        })
}