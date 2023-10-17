
const cards=document.getElementById('cards')
const gold=document.getElementById('displayGold')
const player_id=window.localStorage.getItem('player_id')
axios.post(API_URL+'/api/cardCollection/displayGold',{
    "playerID":player_id
})
.then((response)=>{
    gold.innerHTML+=response.data[0]['gold']
})

axios.post(API_URL+'/api/cardCollection/cardCollection',{
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
    cards.innerHTML=EachCard
})

function showCardsFunction(card_id){
    window.location.assign(API_URL+'/showCards.html?card_id='+card_id)
}