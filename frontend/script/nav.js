
const API_URL = 'https://monster-cat-world.onrender.com'
const gameName = document.getElementById("gameName");
const clanNav = document.getElementById("clanNav");
const cardNav = document.getElementById("cardNav");
const friendNav = document.getElementById("friendNav");
const clanCaretDown = document.getElementById('clanCaretDown')
const cardCaretDown = document.getElementById('cardCaretDown')
const friendCaretDown = document.getElementById('friendCaretDown')
const navul = document.getElementById('navul');

gameName.onclick = () => { window.location.assign(`${API_URL}/index.html`) }

function checkUnauthorisedAccess() {
    //try to get token
    let token = localStorage.getItem('token');
    //let's verify the token
    var headersConfig = {
        'authorisation': "Bearer " + token
    }
    axios.post(`${API_URL}/verifyToken`, "", { headers: headersConfig })
        .then((response) => {
            navul.style.position = 'static';
            navul.innerHTML = `<li><a href="${API_URL}/battleScene/index.html" id="battleNav">Battle</a></li>
    <li id="clanNav" >Clans<i class="fa fa-caret-down" id="clanCaretDown"></i></li>
    <li id="cardNav" >Cards<i class="fa fa-caret-down" id="cardCaretDown"></i></li>
    <li id="friendNav" >Friends <i class="fa fa-caret-down" id="friendCaretDown"></i></li>
    <li ><a href="${API_URL}/profile.html">Profile</a></li>
    <li id="signOut">Sign Out</li>
    `

        })
        .catch((error) => {
            console.log(error)
            navul.style.position = 'relative'
            navul.style.right = '-370px'
            navul.innerHTML = `<li><a href="${API_URL}/login.html">Login</a></li>
    <li><a href="${API_URL}/signup.html">Sign Up</a></li>`
            if (window.location.href != `${API_URL}/login.html` && window.location.href != `${API_URL}/index.html` && window.location.href != `${API_URL}/signup.html` && window.location.href != `${API_URL}/forgetPassword.html`) {
                window.location.assign(`${API_URL}/index.html`)
            }
        })

}

function clanClick() {
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    clanSubNav.style.display = "block";
    cardSubNav.style.display = "none";
    friendSubNav.style.display = "none";
}

function cardClick() {
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    cardSubNav.style.display = "block";
    clanSubNav.style.display = "none";
    friendSubNav.style.display = "none";

}

function friendClick() {
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    friendSubNav.style.display = "block";
    clanSubNav.style.display = "none";
    cardSubNav.style.display = "none";
}


document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById('subNav').innerHTML += `
    <div id="clanSubNav" class="subNav">
            <ul>
                <li><a href="${API_URL}/Clan.html">All Clans</a></li>
                <li><a href="${API_URL}/createClan.html">Create Clan</a></li>
                <li><a href="${API_URL}/clanRequest.html">Clan Request</a></li>
                <li><a href="${API_URL}/listOfClan.html">Mini Game</a></li>
                <li><a href="${API_URL}/leaderBoard.html">LeaderBoard</a></li>
            </ul>
        </div>

        <div id="cardSubNav" class="subNav">
            <ul>
                <li><a href="${API_URL}/cardCollection.html">Card Collection</a></li>
                <li><a href="${API_URL}/buyCards.html">Buy Cards</a></li>
            </ul>
        </div>

        <div id="friendSubNav" class="subNav">
            <ul>
            <li><a href="${API_URL}/searchPlayer.html">Search Players</a></li>
                <li><a href="${API_URL}/allFriends.html">View Friends</a></li>
                <li><a href="${API_URL}/friendRequest.html">Friends Request</a></li>
                <li><a href="${API_URL}/getAllTradingRequest.html">Trading Request</a></li>
                <li><a href="${API_URL}/tradingGraph.html">Trading Data</a></li>
                <li><a href="${API_URL}/chatMessages.html">Chat</a></li>
            </ul>
        </div>
   `

    const subNavs = document.getElementsByClassName("subNav");
    for (let x = 0; x < subNavs.length; x++) {
        subNavs[x].style.display = "none";
    }
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    clanSubNav.addEventListener('mouseleave', () => {
        clanSubNav.style.display = "none";
    })
    cardSubNav.addEventListener('mouseleave', () => {
        cardSubNav.style.display = "none";
    })
    friendSubNav.addEventListener('mouseleave', () => {
        friendSubNav.style.display = "none";
    })
    checkUnauthorisedAccess();


});



document.addEventListener('click', function (e) {
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    if (e.target.id != "clanNav" && e.target.id != "clanCaretDown") {
        clanSubNav.style.display = "none";
    }
    if (e.target.id != "cardNav" && e.target.id != "cardCaretDown") {
        cardSubNav.style.display = "none";
    }
    if (e.target.id != "friendNav" && e.target.id != "friendCaretDown") {
        friendSubNav.style.display = "none";
    }
    if (e.target.id == "clanNav") {
        clanClick();
    }
    if (e.target.id == "cardNav") {
        cardClick();
    }
    if (e.target.id == "friendNav") {
        friendClick();
    }
    if (e.target.id == "clanCaretDown") {
        clanClick();
    }
    if (e.target.id == "cardCaretDown") {
        cardClick();
    }
    if (e.target.id == "friendCaretDown") {
        friendClick();
    }
    if (e.target.id == "signOut") {
        localStorage.clear();
        checkUnauthorisedAccess();
        if (document.getElementById('login') != null) {
            document.getElementById('login').disabled = false;
        }
        if (document.getElementById('submitSignOut') != null) {
            document.getElementById('submitSignOut').disabled = false;
        }
    }


})

document.addEventListener('mouseover', function (e) {
    const clanSubNav = document.getElementById('clanSubNav')
    const cardSubNav = document.getElementById('cardSubNav')
    const friendSubNav = document.getElementById('friendSubNav')
    if (e.target.id == "clanNav") {
        clanSubNav.style.display = "block";
        cardSubNav.style.display = "none";
        friendSubNav.style.display = "none";


    }

    else if (e.target.id == "cardNav") {
        cardSubNav.style.display = "block";
        clanSubNav.style.display = "none";
        friendSubNav.style.display = "none";
    }

    else if (e.target.id == "friendNav") {
        friendSubNav.style.display = "block";
        clanSubNav.style.display = "none";
        cardSubNav.style.display = "none";

    }

    else if (e.target.id == "battleNav") {
        friendSubNav.style.display = "none";
        clanSubNav.style.display = "none";
        cardSubNav.style.display = "none";
    }

    else if (e.target.id == "chatNav") {
        friendSubNav.style.display = "none";
        clanSubNav.style.display = "none";
        cardSubNav.style.display = "none";
    }




})
