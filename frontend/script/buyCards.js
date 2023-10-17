
const lootboxes=document.getElementById('lootboxes');
const lootbox2=document.getElementById('lootbox2');
const lootbox3=document.getElementById('lootbox3');
const lootbox4=document.getElementById('lootbox4');
const showCards=document.getElementById('showCards')
const player_id=window.localStorage.getItem('player_id')
const gold=document.getElementById('displayGold')
axios.post(API_URL+'/api/cardCollection/displayGold',{
    "playerID":player_id
})
.then((response)=>{
    gold.innerHTML+=response.data[0]['gold']
})

lootbox2.onclick=function(){
    axios.post(API_URL+'/api/buyCards/gacha',{
        "noOfCards":1,
        "playerID":player_id,
        "price":10
    
    })
    .then((response)=>{
        let EachCard=``
    response.data.forEach(element => {
        EachCard+=`
        
        <div class="cards">
            <p>${element['creature_name']}<p>
            
            <img class="cards" src="../images/cards/${element['card_image']}"></img>
            <p>Hit Poinst: ${element['hit_points']}|
            Level: ${element['creature_level']}</p>
            
            `
        element['attack'].forEach(element=>{
            EachCard+=`
            <div class='attack_name'>${element['attack_name']}</div>
            <div class='attack_damage'>Damage${element['attack_damage']}</div>`
        })
        EachCard+=`
        </div>
        `
    });
    showCards.innerHTML+=EachCard
    showCards.style.display='flex'
    })
    .catch((error)=>{
        console.log("error:", error);
    })
}
lootbox3.onclick=function(){
    axios.post(API_URL+'/api/buyCards/gacha',{
        "noOfCards":3,
        "playerID":player_id,
        "price":25
    
    })
    .then((response)=>{
        let EachCard=``
    response.data.forEach(element => {
        EachCard+=`
        
        <div class="cards">
            <p>${element['creature_name']}<p>
            
            <img class="cards" src="../images/cards/${element['card_image']}"></img>
            <p>Hit Poinst: ${element['hit_points']}|
            Level: ${element['creature_level']}</p>
            
            `
        element['attack'].forEach(element=>{
            EachCard+=`
            <div class='attack_name'>${element['attack_name']}</div>
            <div class='attack_damage'>Damage${element['attack_damage']}</div>`
        })
        EachCard+=`
        </div>
        `
    });
    showCards.innerHTML+=EachCard
    showCards.style.display='flex'
    })
    .catch((error)=>{
        if(error.code=='ERR_BAD_REQUEST'){
            alert("Not enough gold")
        }
        else{
            console.log("error: "+error);
        }
    })
}
lootbox4.onclick=function(){
    axios.post(API_URL+'/api/buyCards/gacha',{
        "noOfCards":5,
        "playerID":player_id,
        "price":45
    
    })
    .then((response)=>{
        let EachCard=``
    response.data.forEach(element => {
        EachCard+=`
        
        <div class="cards">
            <p>${element['creature_name']}<p>
            
            <img class="cards" src="../images/cards/${element['card_image']}"></img>
            <p>Hit Poinst: ${element['hit_points']}|
            Level: ${element['creature_level']}</p>
            
            `
        element['attack'].forEach(element=>{
            EachCard+=`
            <div class='attack_name'>${element['attack_name']}</div>
            <div class='attack_damage'>Damage${element['attack_damage']}</div>`
        })
        EachCard+=`
        </div>
        `
    });
    showCards.innerHTML+=EachCard
    showCards.style.display='flex'
    })
    .catch((error)=>{
        if(error.code=='ERR_BAD_REQUEST'){
            alert("Not enough gold")
        }
        else{
            console.log("error: "+error);
        }
    })
}

showCards.onclick=function(){
    window.location.reload()
}
