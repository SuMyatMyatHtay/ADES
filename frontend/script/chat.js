const API_URL = 'https://monster-cat-world.onrender.com'
const player_id = localStorage.getItem('player_id');

//get element from document id
const playerBar = document.getElementById('playerBar');
const friendsBar = document.getElementById('friendsBar');
const chat = document.getElementById('chat');
const topHeader = document.getElementById('topHeader');
const bottomHeader = document.getElementById('bottomHeader');
const individualChat = document.getElementById('individualChat');
var textArea = document.getElementById('textArea');
let playerImagePath = '';
let friendArr = [];
var messageData = [];
var prevDate = '';
var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


//when page loads
document.addEventListener("DOMContentLoaded", function (event) {
    //check authorisation
    if (player_id == null) {
        window.location.assign(`${API_URL}/index.html`)
    }
    //try to get token
    let token = localStorage.getItem('token');
    //let's verify the token
    var headersConfig = {
        'authorisation': "Bearer " + token
    }
    axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
        .then((response) => {
            getPlayerInfo();
            getAllfriends();
            getInstruction();

        })
        .catch((error) => {
            window.location.assign(`${API_URL}/index.html`)
            return;

        })


    //get player info
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
        .then((result) => {
            //change url
            const redirectUrl = `${API_URL}/chatMessages.html?${result.data.player_username}`
            window.history.pushState("", "new page with player_id", redirectUrl);
        })
        .catch((error) => {
            console.log(error)
        })
    bottomHeader.style.display = 'none';
    topHeader.style.display = 'none';


});



//instructions for new players
function getInstruction() {
    chat.innerHTML = `   <div id="instructionDiv">
    <p class="instructions">
        Welcome to Chat Messages! Click on your friend's profile to view your conversation
        with them. You are only allowed to chat with your friends so make sure to follow 
        more players if you want to chat with them. You are reminded to be respectful to
        one another. 
        <span style="display:block; font-weight:bold; text-decoration: underline;">
        FAQ :
    </span>
    <span style="display:block">
        1. How to send a message?
        </span>
        <span style="display:block">
        Ans: Type your message in the text input at the bottom and click the paper plane icon.
        </span>
        <span style="display:block">
        2. How do i delete a message?
        </span>
        <span style="display:block">
        Ans: Click on the delete icon at the bottom of the text bubble
        </span>
        <span style="display:block">
        3. What if i accidentally deleted a message?
        </span>
        <span style="display:block">
        Ans: No problem! When you delete a message, an undo button will appear.Click the undo button
        to undo the delete. Do note that undoing of message is not allowed once the chat has been reloaded.
        This means when you reload the page or when you reclick your friends profile 
        </span>
        <span style="display:block">
        4. Can i edit a message?
        </span>
        <span style="display:block">
        Ans: Yes! You just have to click the edit icon right beside the delete icon. Once you click, just
        tap the text and you will be able to edit! Press 'Confirm Edit' after you are done editing to save the changes.
        Once you save, other players will know that the message was edited.
        </span>
       </p>
    </div>`
}

//get all friends of players
function getAllfriends() {
    axios.get(`${API_URL}/api/chat/getAllFriends/${player_id}`)
        .then((result) => {
            var dataArr = [];
            for (let x = 0; x < result.data.length; x++) {
                if (result.data[x].PlayerID_Send != player_id) {
                    dataArr.push(result.data[x].PlayerID_Send);
                }
                if (result.data[x].PlayerID_Accept != player_id) {
                    dataArr.push(result.data[x].PlayerID_Accept);
                }
            }
            console.log(dataArr);
            //get chat messages betweeen player and friends. this one is for preview of last message
            dataArr.forEach((friends_id) => {
                axios.get(`${API_URL}/api/chat/getMessages/${friends_id}/${player_id}`)
                    .then((result) => {
                        var lastMessage = ''
                        if (result.data.length != 0) {
                            var lastData = result.data[result.data.length - 1]
                            if (lastData.sender_id == player_id) {
                                lastMessage = `me: ${lastData.message}`;
                            }
                            else {
                                var status = lastData.status;
                                lastMessage = lastData.message;

                            }

                        }
                        getFriendsInfo(friends_id, lastMessage, status)
                    })
                    .catch((error) => {
                        console.log(error);
                    })

            })

        })
        .catch((error) => {
            console.log(error)
        })
}

//get friends username, image
function getFriendsInfo(friends_id, lastMessage, status) {
    axios.get(`${API_URL}/api/players/getPlayerInfo/${friends_id}`)
        .then((result) => {
            const image_id = result.data.image_id;
            const player_username = result.data.player_username;
            axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                .then((response) => {
                    friendArr.push([friends_id, player_username, response.data])
                    //append to contact bar
                    friendsBar.innerHTML += `
                    <div class="contactBar" id='Friend${friends_id}'>
                        <img src="${response.data}" class="friendsProfile" id='imgFriend${friends_id}'/>
                        <div class="details" id='detailFriend${friends_id}'>
                            <p class="friendsName">${player_username}</p>
                            <p class="message" id="lastMessage${friends_id}">${lastMessage}</p>
                           
                        </div> 
                    </div>`
                    //check if message status is unread if unread have the uunread icon
                    if (status == 'unread') {
                        document.getElementById(`Friend${friends_id}`).innerHTML += `<div class="circle" id="unread${friends_id}"></div>`
                    }

                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
}
//get player info again...
function getPlayerInfo() {
    axios.get(`${API_URL}/api/players/getPlayerInfo/${player_id}`)
        .then((result) => {
            const image_id = result.data.image_id;
            const player_username = result.data.player_username;
            axios.get(`${API_URL}/api/players/getPlayerAvatar/${image_id}`)
                .then((response) => {
                    playerImagePath = response.data
                    playerBar.innerHTML =
                        `<div id="personalBar">
                        <i class="fa fa-arrow-left" id='back'></i>
                                <img src="${response.data}" id="personalProfile" />
                                <p id="personalName">${player_username}</p>
                            </div>`
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })

}
//get messages between player 1 and friend only
function getMessages(friend_id) {
    if (document.getElementById(`unread${friend_id}`) != null) {
        document.getElementById(`unread${friend_id}`).remove();
    }
    let friendImage = '';
    let friendUsername = '';
    //find friend username and image in friendArr
    for (let y = 0; y < friendArr.length; y++) {
        if (friendArr[y][0] == parseInt(friend_id)) {
            friendUsername = friendArr[y][1]
            friendImage = friendArr[y][2]
        }
    }
    //getting all the chats between player_id and friend_id
    topHeader.innerHTML = `
    <img src="${friendImage}" class="individualChatPic" />
    <p class="individualChatName">${friendUsername}</p>`
    axios.get(`${API_URL}/api/chat/getMessages/${friend_id}/${player_id}`)
        .then((result) => {
            console.log(result.data)
            if (result.data.length != 0) {
                for (let x = 0; x < result.data.length; x++) {
                    var time = result.data[x].converted_time
                    console.log(result.data[x].edit.data);
                    //check when messages are sent and group them by time
                    var messagesDate = new Date(result.data[x].time_stamp)
                    var formattedDate = messagesDate.getDate() + ' ' + months[messagesDate.getMonth()] + ' ' + messagesDate.getFullYear();
                    var idDate = messagesDate.getDate() + months[messagesDate.getMonth()] + messagesDate.getFullYear();
                    if ((checkDate(messagesDate) == false) && (formattedDate != prevDate)) {
                        chat.innerHTML += ` <p class="date" id="${idDate}">${formattedDate}</p>`
                        prevDate = formattedDate;
                    }
                    if ((checkDate(messagesDate) == true) && (formattedDate != prevDate)) {
                        chat.innerHTML += `<p class="date" id="${idDate}">today</p>`
                        prevDate = formattedDate;
                    }
                    //check if messages were edited before
                    if (parseInt(result.data[x].edit.data[0]) == 1) {
                        time = `(edited) ` + time
                    }
                    //get all messages sent by player_id and append it to html
                    if (result.data[x].sender_id == player_id) {
                        chat.innerHTML += `  
                    <div class="sender" id="sender${result.data[x].message_id}">
                    <div class="chatBubble_sender" id="chatBubble_sender${result.data[x].message_id}">
                        <p contentEditable="false" class="senderMessage" id="message_id${result.data[x].message_id}">
                            ${result.data[x].message}
                        </p>
                        <div class="bottomMessage" id="bottomMessage${result.data[x].message_id}">
                        <div id="functions${result.data[x].message_id}" class="functions">
                            <i class="fa fa-trash" id="deleteBtn${result.data[x].message_id}"></i>
                            <i class="fa fa-edit" id="editBtn${result.data[x].message_id}"></i>
                            </div>
                            <div class="messageDetails">
                                <p class="senderTimestamp" id="time${result.data[x].message_id}">${time}</p>
                                <i class="fa fa-check" id='check${result.data[x].message_id}' style="font-size:14px; color:rgb(255, 255, 255); margin-right: 2px;"></i>
                            </div>
                        </div>

                    </div>
                    <img src="${playerImagePath}" class="senderPic">
                </div>`
                        //read messages(blue tick) unread messages (white tick)
                        if (result.data[x].status == 'read') {
                            document.getElementById(`check${result.data[x].message_id}`).style.color = '#1E90FF'
                        }
                    }
                    //else the rest of the messages are sent by the friend
                    else {
                        chat.innerHTML += ` 
                        <div class="receiver">
                        <img src="${friendImage}" class="receiverPic">
                        <div class="chatBubble_receiver">
                            <p class="receiverMessage">
                            ${result.data[x].message}
                            </p>
                            <p class="receiverTimestamp">${result.data[x].converted_time}</p>
                        </div>
                    </div>`
                        axios.put(`${API_URL}/api/chat/updateStatus/${result.data[x].message_id}`)
                            .then((response) => {
                                console.log(response);
                            })
                            .catch((error) => {
                                console.log(error);
                            })

                    }
                    //show the lastest chat
                    chat.scrollTop = chat.scrollHeight;
                }
            }
            //create bottom header for players to send message
            bottomHeader.innerHTML = `
            <textarea id="textArea" rows="1">
            </textarea>
            <i class="fa fa-send-o" id='sendBtn${friend_id}'></i>`
        })
        .catch((error) => {
            console.log(error)
        })

}

//send message function
function sendMessages(friend_id) {
    var preMessage = document.getElementById('textArea').value;
    //trim unnecessary whitespaces
    var message = preMessage.trim()
    //get time sent
    var time_stamp = new Date()
    bodyData = {
        'message': message,
        'time_stamp': time_stamp,
        'last_updated': time_stamp
    }
    axios.post(`${API_URL}/api/chat/sendMessage/${player_id}/${friend_id}`, bodyData)
        .then((result) => {
            //change last message under chatOverview
            document.getElementById(`lastMessage${friend_id}`).innerHTML = `me: ${message}`
            //format time
            var time = time_stamp.getHours().toString().padStart(2, '0') + ":" + time_stamp.getMinutes().toString().padStart(2, '0') + ":" + time_stamp.getSeconds().toString().padStart(2, '0');
            //check date to see if need to put date watermark above
            var idDate = time_stamp.getDate() + months[time_stamp.getMonth()] + time_stamp.getFullYear();
            if (document.getElementById(`${idDate}`) == null) {
                chat.innerHTML += `<p class="date" id="${idDate}">today</p>`
            }
            //apppend the new message
            chat.innerHTML += ` <div class="sender" id="sender${result.data[0].insertId}">
        <div class="chatBubble_sender" id="chatBubble_sender${result.data[0].insertId}">
            <p contentEditable="false" class="senderMessage" id="message_id${result.data[0].insertId}">
                ${message}
            </p>
            <div class="bottomMessage" id="bottomMessage${result.data[0].insertId}">
            <div id="functions${result.data[0].insertId}" class="functions">
                <i class="fa fa-trash" id="deleteBtn${result.data[0].insertId}"></i>
                <i class="fa fa-edit" id="editBtn${result.data[0].insertId}"></i>
                </div>
                <div class="messageDetails">
                    <p class="senderTimestamp" id="time${result.data[0].insertId}">${time}</p>
                    <i class="fa fa-check" id='check${result.data[0].insertId}' style="font-size:14px; color:rgb(255, 255, 255); margin-right: 2px;"></i>
                </div>
            </div>

        </div>
        <img src="${playerImagePath}" class="senderPic">
    </div>`
            //empty value of textArea
            document.getElementById('textArea').value = '';
            //make the page show the message that was just sent (bottom of scroll page)
            chat.scrollTop = chat.scrollHeight;

        })
        .catch((error) => {
            console.log(error)
        })


}

//delete messages
function deleteMessages(message_id) {
    var message_id = message_id;
    console.log(message_id)
    axios.get(`${API_URL}/api/chat/getMessageFromId/${message_id}`)
        .then((response) => {
            //for undoing of delete
            //push into array because in case players delete multiple messages at one time
            messageData.push(response.data);
            axios.delete(`${API_URL}/api/chat/deleteMessages/${message_id}`)
                .then((result) => {
                    console.log(result);
                    //append warning
                    document.getElementById(`chatBubble_sender${message_id}`).innerHTML = `
            <p contentEditable="false" class="undoMessage" id="undo${message_id}">
                message will officially delete on reload
            </p>
            <div class="bottomMessage">
            <p class='undoP'>click to undo :</p>
            <i class="fa fa-undo" id="undoBtn${message_id}"></i>
            </div>
            `
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })

}

//undo delete of messages
function undoMessage(message_id) {
    console.log(messageData)
    //find message_id in messageData that matches message_id parameter
    const index = messageData.findIndex(obj => obj.message_id == message_id)
    var message_id = message_id
    //get all prev info
    var message = messageData[index].message;
    var receiver_id = messageData[index].receiver_id;
    var edit = messageData[index].edit.data[0];
    var time = messageData[index].converted_time;
    var last_update = new Date();
    console.log(edit)
    bodyData = {
        'message': message,
        'time_stamp': new Date(messageData[index].time_stamp),
        'last_updated': last_update,
        "message_id": message_id,
        'edit': edit
    }
    //re-insert deleted message
    axios.post(`${API_URL}/api/chat/sendMessage/${player_id}/${receiver_id}`, bodyData)
        .then((result) => {
            if (edit == 1) {
                time = `(edited) ` + time
            }
            console.log(result);
            //re-append
            document.getElementById(`chatBubble_sender${message_id}`).innerHTML = ` 
                <p contentEditable="false" class="senderMessage" id="message_id${message_id}">
                    ${message}
                </p>
                <div class="bottomMessage">
                <div id="functions${message_id}" class="functions">
                    <i class="fa fa-trash" id="deleteBtn${message_id}"></i>
                    <i class="fa fa-edit" id="editBtn${message_id}"></i>
                </div>
                    <div class="messageDetails">
                        <p class="senderTimestamp" id='time${message_id}'>${time}</p>
                        <i class="fa fa-check" id='check${message_id}' style="font-size:14px; color:rgb(255, 255, 255); margin-right: 2px;"></i>
                    </div>
                </div>
        `
            //remove array index
            messageData.splice(index, 1);

        })
        .catch((error) => {
            console.log(error)
        })




}

function editMessage(message_id) {
    axios.get(`${API_URL}/api/chat/getMessageFromId/${message_id}`)
        .then((response) => {
            //same as delete (this is if the player edits halfway and decides to cancel editing)
            //to retrieve pre-edit message
            messageData.push(response.data);
        })
        .catch((error) => {
            console.log(error);
            return;
        })
    //make p editable
    document.getElementById(`message_id${message_id}`).contentEditable = true;
    //append needed icons for edit
    document.getElementById(`functions${message_id}`).innerHTML = `
 <button id="doneEditing${message_id}" class="doneBtn">Confirm Edit</button>
 <button id="cancel${message_id}" class="cancelBtn">cancel</button>
`
}

//update messages
function updateMessage(message_id) {
    //again trim unnecessary whitespaces
    var message = document.getElementById(`message_id${message_id}`).innerHTML.trim()
    var time = document.getElementById(`time${message_id}`).innerHTML;
    //add edited to show its edited
    if (!time.includes('edited')) {
        time = `(edited) ` + time
    }
    const bodyData = {
        "message": message,
        "last_updated": new Date()
    }
    //update message
    axios.put(`${API_URL}/api/chat/updateMessage/${message_id}`, bodyData)
        .then((result) => {
            console.log(result);
            //append new updated message
            document.getElementById(`chatBubble_sender${message_id}`).innerHTML = ` 
                <p contentEditable="false" class="senderMessage" id="message_id${message_id}">
                    ${message}
                </p>
                <div class="bottomMessage">
                <div id="functions${message_id}" class="functions">
                    <i class="fa fa-trash" id="deleteBtn${message_id}"></i>
                    <i class="fa fa-edit" id="editBtn${message_id}"></i>
                </div>
                    <div class="messageDetails">
                        <p class="senderTimestamp" id='time${message_id}'>${time}</p>
                        <i class="fa fa-check" id='check${message_id}' style="font-size:14px; color:rgb(255, 255, 255); margin-right: 2px;"></i>
                    </div>
                </div>
        `
        })
        .catch((error) => {
            console.log(error);
        })

    //not in need anymore 
    const index = messageData.findIndex(obj => obj.message_id == message_id)
    //remove the element from message data
    messageData.splice(index, 1);


}

//cancel edit
function cancelEdit(message_id) {
    //find message_id in messageData array
    const index = messageData.findIndex(obj => obj.message_id == message_id)
    //remove contentEditable attribute
    document.getElementById(`message_id${message_id}`).contentEditable = false;
    //get message from pre-editing
    document.getElementById(`message_id${message_id}`).innerHTML = `${messageData[index].message}`
    //show the necessary functions
    document.getElementById(`functions${message_id}`).innerHTML = `
    <i class="fa fa-trash" id="deleteBtn${message_id}"></i>
    <i class="fa fa-edit" id="editBtn${message_id}"></i>
`
    //remove the element from message data
    messageData.splice(index, 1);
}

//check if messages are from today
function checkDate(date) {
    var todayDate = new Date();
    if (date.getFullYear() != todayDate.getFullYear()) {
        return false;
    }
    else if (date.getMonth() != todayDate.getMonth()) {
        return false;
    }
    else if (date.getDate() != todayDate.getDate()) {
        return false;
    }

    return true;

}

// if click on one of the divs under contactBar
document.addEventListener("click", getClick, false);

//event listener
function getClick(e) {
    var friendArr, sendArr, deleteArr, undoArr, editArr, updateArr, cancelArr;

    const clickedTarget = e.target.id
    //for when clicking on friend in contactBar
    if (clickedTarget.includes('Friend')) {
        chat.replaceChildren();
        bottomHeader.style.display = 'block';
        topHeader.style.display = "flex";
        if (document.getElementById('textArea')) {
            document.getElementById('textArea').value = null
        }
        friendArr = clickedTarget.split('Friend');
        getMessages(friendArr[1]);
    }
    //sent button for when sending messages
    if (clickedTarget.includes('sendBtn')) {
        var message = document.getElementById('textArea').value;
        if (message != '            ') {
            sendArr = clickedTarget.split('sendBtn');
            console.log(sendArr);
            sendMessages(sendArr[1]);
        }
    }
    //for deleting messages
    if (clickedTarget.includes('deleteBtn')) {
        deleteArr = clickedTarget.split('deleteBtn');
        console.log(deleteArr[1])
          //not in need anymore 
          const index = messageData.findIndex(obj => obj.message_id == deleteArr[1])
          //remove the element from message data
          messageData.splice(index, 1);
        deleteMessages(deleteArr[1]);
    }
    //for undoing delete
    if (clickedTarget.includes('undoBtn')) {
        undoArr = clickedTarget.split('undoBtn');
        console.log(undoArr);
        undoMessage(undoArr[1]);
    }
    //for editing messages
    if (clickedTarget.includes('editBtn')) {
        editArr = clickedTarget.split('editBtn');
        console.log(editArr);
        editMessage(editArr[1]);
    }
    //for when editing is done
    if (clickedTarget.includes('doneEditing')) {
        updateArr = clickedTarget.split('doneEditing');
        console.log(updateArr);

        updateMessage(updateArr[1]);
    }
    //for cancelling of edit
    if (clickedTarget.includes('cancel')) {
        cancelArr = clickedTarget.split('cancel');
        cancelEdit(cancelArr[1])
    }
    //when click on personalName or personalProfile, show instructions
    if (clickedTarget == 'personalName' || clickedTarget == 'personalProfile') {
        bottomHeader.style.display = 'none';
        topHeader.style.display = "none";
        getInstruction()
    }
    //get back to prev page before going into chat since there is no nav bar
    if (clickedTarget == 'back') {

        var previousURL = document.referrer;

        if (!previousURL.includes(`${API_URL}`)) {
            window.location.replace(`${API_URL}/index.html`);
        }
        else {
            history.back();
        }

    }
}

