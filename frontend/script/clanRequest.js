
const player_id=window.localStorage.getItem('player_id')
const searchResult=document.getElementById("searchResult")
const searchButton=document.getElementById("search")
const search=document.getElementById("searchClan")

searchButton.onclick=function(){
    searchResult.innerHTML=``
    axios.get(API_URL+'/api/clanRequest/searchClan/'+search.value)
    .then((response)=>{
        for (let index = 0; index < response.data.length; index++) {
            searchResult.innerHTML+=`
            <div class="d-flex flex-row flex-wrap align-self-center justify-content-center" >Join Clan "${response.data[index]["ClanName"]}"<button onclick="joinClan(${response.data[index]["ClanID"]},${player_id})">Join</button></div>`
        }
    })
}

function joinClan(clan_id,player_id){
    axios.post(API_URL+'/api/clanRequest/joinClan',{
        "clan_id":clan_id,
        "player_id":player_id
    })
    .then(()=>{
        alert('Joined clan')
    })
    .catch((error)=>{
        if(error['request'].status==404){
            alert("You cannot join more than 4 clans!!")
        }
        else if(error['request'].status==403){
            alert("You are already in the clan")
        }
        else{
            console.log(error);
        }
    })
}