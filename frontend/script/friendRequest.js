
const showRequest = document.getElementById("showRequest");
const aftResponse = document.getElementById("aftResponse");
const PLAYERIDTEMP = localStorage.getItem('player_id');
var AorR = '';

window.onload = function () { getAllFriReq() }

function getAllFriReq() {

    axios.post(API_URL + '/api/friendReqRoute/getAllFriReq/' + PLAYERIDTEMP)

        .then((response) => {
            console.log(response)
            console.log(response.data);
            AllFriReqDisplay(response.data);

        })
        .catch(function (error) {
            console.log(error);
            //AllFriReqDisplay(error);
        })
}

function AllFriReqDisplay(objData) {
    console.log(objData);
    console.log(objData.length);
    let EachFriend = ` `

    if (objData.length == 0) {
        EachFriend += `<h3> You have no friend Request left </h3>`
    }
    else {
        EachFriend += `
        <div>`
        for (var i = 0; i < objData.length; i++) {

            EachFriend += ` 
                <div class="container"
                    style="background-color: rgba(0, 0, 0, 0.884); margin: 25px; border: 3px solid rgb(145, 0, 207);">
                    <div class="row align-items-center p-1">
                        <div class="col-md-3 profilePic" style="padding-left: 50px;">
                            <img src="${objData[i].avatar}" alt="PlayerProfile" style="width: 150px;">
                        </div>
                        <div class="col-md-9 profileDetail">
                        <h3 style="margin-right: 30px;">${objData[i].player_username} &nbsp;&nbsp;&nbsp;&nbsp; #${objData[i].player_id}</h3>
                        <h4>Gold : ${objData[i].gold}</h4>
                        
                            <div style="margin: 8px;">
                            <button onclick="acceptRequest(${objData[i].player_id})" class="btn btn-primary">Accept</button>
                            <button onclick="deleteRequest(${objData[i].player_id})" class="btn btn-danger">Reject</button>
                            </div>

                        </div>
                    </div>
                </div>


                

        `
        }
        EachFriend += `</div>`
    }
    showRequest.innerHTML = EachFriend;
}

function acceptRequest(tempID) {
    axios.post(API_URL + '/api/friendReqRoute/addToFriendship/' + PLAYERIDTEMP + '/' + tempID)

        .then((response) => {
            console.log(response)
            console.log(response.data);
            console.log("Accepted the friend request.")
            AorR += 'Friend Request is accepted successfully.'
            //deleteRequest(tempID);
            //AllFriReqDisplay(response.data);
        })
        .then(() => {
            deleteRequest(tempID);
        })
        .catch(function (error) {
            console.log(error);
            //AllFriReqDisplay(error);
        })
}

function deleteRequest(tempID) {
    axios.delete(API_URL + '/api/friendReqRoute/friReqDelete/' + PLAYERIDTEMP + '/' + tempID)
        .then((response) => {
            if (AorR == '') {
                AorR += 'Friend Request is successfully rejected.'
            }
            console.log(response)
            console.log(response.data);
            aftResponse.innerHTML = `
                <div style="margin-bottom: 50px;">
                    <h3 style="text-align: center;">${AorR}</h3>
                    <div
                        style="display: flex; justify-content: center; align-items: center; height: 400px; margin: 0 auto;">
                        <img src="./images/gif/LoadingPinkBar.gif" alt="Loading"
                            style="width: 700px; background-color: rgba(0, 0, 0, 0.649);">
                    </div>
                </div>
            `
            console.log("Friend request successfully deleted.")

            setTimeout(function () {
                location.reload();
            }, 3000);
        })
        .then(() => {
            showRequest.innerHTML = ``;
        })
        .catch(function (error) {
            console.log(error);
        })
}
