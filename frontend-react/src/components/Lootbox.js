import axios from 'axios'
import Button from './Button'
import Card from './Card';
import { useState } from 'react';
import '../css/cardCollection.css'
import LoadingScreen from './LoadingScreen';

const API_URL = 'https://monster-cat-world.onrender.com';
const player_id=window.localStorage.getItem('player_id')
export default function Lootbox(props){
    
    let img=props.card_No+'Card.jpg'
    let text='Buy '+props.card_No+' cards $'+props.price

    const [cards,setCards]=useState()//use 'cards' state for displaying bought cards
    function back(){
        window.location.reload()
    }
    function buyCards(){
        
let loading=window.document.getElementById("loading")
        loading.style.display='block'
        axios.post(API_URL+'/api/buyCards/gacha',{//this will add random cards to the database and return those cards
            "noOfCards":props.card_No,
            "playerID":player_id,
            "price":props.price
        
        })
        .then((cards)=>{//uset 'cards' state for displaying bought cards
            loading.style.display='none'
            setCards(<div id='showCards' onClick={back}>
                <h3 style={{display:'flex',justifyContent:'center',color:'white'}}>
                    You've won these cards!!!    
                </h3>
                <div style={{display:'flex',justifyContent:'center'}}>{cards.data.map(card=>{
                return(
                    <Card card={card}></Card>
                )
            })}</div></div>)
        })
        .catch((error)=>{
            alert('You do no have enough money')
            window.location.reload()
        })
    }
    return(
        <div>
            {cards}
            <img src={require("../images/lootbox/"+img)} alt=""></img>
            <Button onclick={buyCards} text={text}></Button>
            
        </div>
    )
}