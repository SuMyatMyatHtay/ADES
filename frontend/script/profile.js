
const queryParams = new URLSearchParams(window.location.search);
const player_id = localStorage.getItem('player_id');
const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemeber",
    "October",
    "November",
    "December"
]

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById('id').innerHTML = player_id
    //get player info
    axios.get(`https://monster-cat-world.onrender.com/api/players/getPlayerInfo/${player_id}`)
        .then((response) => {
            //format date joined
            var getDate = new Date(`${response.data.date_created}`);
            var month = monthArr[getDate.getMonth()];
            var year = getDate.getFullYear();
            var date = getDate.getDate().toString().padStart(2, 0)
            var formattedDate = date + " " + month + " " + year;

            //get necessary info
            document.getElementById('name').innerHTML = `${response.data.player_username}`
            document.getElementById('email').innerHTML = `${response.data.email}`
            document.getElementById('date').innerHTML = formattedDate
            document.getElementById('goldEarned').innerHTML = `$${response.data.gold}`
            //get player avatar
            axios.get(`https://monster-cat-world.onrender.com/api/players/getPlayerAvatar/${response.data.image_id}`)
                .then((result) => {
                    document.getElementById('charImage').src = result.data
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
    Promise.all(
        [
            //get player friends
            axios.get(`https://monster-cat-world.onrender.com/api/chat/getAllFriends/${player_id}`),
            //get number of clans  join by player
            axios.post(`https://monster-cat-world.onrender.com/api/clanDetails/getAllClans/${player_id}`),
            //get no of card player have
            axios.get(`https://monster-cat-world.onrender.com/api/players/getNumberOfCards/${player_id}`),
            //get total clan point
            axios.get(`https://monster-cat-world.onrender.com/api/clanDetails/totalClanPoints/${player_id}`)
        ]
    )
        .then(([friendsCount, clansCount, cardsCount, clanPoints]) => {
            //getAllFriends
            document.getElementById('no_of_friends').innerHTML = friendsCount.data.length;
            //getAllClans
            document.getElementById('no_of_clans').innerHTML = clansCount.data.length
            //getNumberOfCards
            document.getElementById('no_of_cards').innerHTML = `${cardsCount.data[0].cardsNo}`
            //totalClanPoints
            document.getElementById('clan_points_earned').innerHTML = `${clanPoints.data.total_points} pts`
        })
        .catch((error) => {
            console.log(error)
        })

});
