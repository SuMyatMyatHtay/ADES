

const showCards=document.getElementById('showCards')
const upgrade=document.getElementById('upgrade')
const sell=document.getElementById('sell')
const urlParams = new URLSearchParams(window.location.search);
const card_id=urlParams.get('card_id')
const player_id=window.localStorage.getItem("player_id")
const gold=document.getElementById('displayGold')
axios.get(API_URL+'/api/cardCollection/showCardPrice/'+card_id)
.then((price)=>{
    sell.innerHTML+=`<i class="bi-cash-coin" style="color: gold;"></i> `+price.data
})
axios.post(API_URL+'/api/cardCollection/displayGold',{
    "playerID":player_id
})
.then((response)=>{
    gold.innerHTML+=response.data[0]['gold']
})
axios.post(API_URL+'/api/cardCollection/showCard/'+card_id,{
    "playerID":player_id
})
.then((response)=>{
    let EachCard=``
    response.data.forEach(element => {
        EachCard+=`
        
        <div class="cards" onclick="showCardsFunction(${element['card_id']})">
            <p>${element['creature_name']}<p>
            
            <img class="cards" src="../images/cards/${element['card_image']}"></img>
            <p>Hit Poinst: ${element['hit_points']}|
            Level: ${element['creature_level']}</p>
            
            `
        element['attack'].forEach(element=>{
            EachCard+=`
            <div class='attack_name'>${element['attack_name']}</div>
            <div class='attack_damage'>Damage ${element['attack_damage']}</div>`
        })
        EachCard+=`
        </div>
        `
    });
    showCards.innerHTML=EachCard
})
.catch((error)=>{
    if (error.response['status']==404){
        alert('You don\'t have this card!')
        window.location.assign(API_URL+'/cardCollection.html')
    }
    else console.log(error);
})

upgrade.onclick=function(){
    axios.put(API_URL+'/api/cardCollection/upgradeCards',{
        "cardID":card_id,
        "playerID":player_id,
        "price":10
    })
    .then(()=>{
        window.location.reload()
    })
}

sell.onclick=function(){
    axios.post(API_URL+'/api/cardCollection/sellCards',{
        "cardID":card_id,
        "playerID":player_id
    })
    .then(()=>{
        window.location.assign(API_URL+'/cardCollection.html')
    })
}