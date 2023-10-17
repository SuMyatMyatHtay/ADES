import Card from "./Card"
import ShowMoney from "./ShowMoney"
import Button from "./Button"
import axios from "axios";

const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = window.localStorage.getItem('player_id')

export default function ShowCard(props) {//shows cards as an overlay
    function sell(){//function for sell button
        
let loading=window.document.getElementById("loading")
        loading.style.display='block'
        axios.post(API_URL+'/api/cardCollection/sellCards',{
            "cardID":props.card['card_id'],
            "playerID":player_id
        })
        .then(()=>{
            window.location.reload()
        })
    }
    function upgrade(){//function for upgrade button
        
let loading=window.document.getElementById("loading")
        loading.style.display='block'
        axios.put(API_URL+'/api/cardCollection/upgradeCards',{
            "cardID":props.card['card_id'],
            "playerID":player_id,
            "price":10
        })
        .then(()=>{
            window.location.reload()
        })
    }
    let sellText='Sell $'+props.card['price']//text for displaying card price
    return (
        <div id='show'>
            <div id="showCard">

                <ShowMoney></ShowMoney>
                <Card card={props.card}></Card>
                <div>
                <Button onclick={upgrade} text='Upgrade $10'></Button>
                <Button onclick={sell} text={sellText}></Button></div>
                <Button onclick={props.back} text='Back'></Button>
            </div>

        </div>
    )
}