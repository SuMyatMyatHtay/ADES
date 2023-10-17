///////////////////////////////////////////
//IMPORTS
///////////////////////////////////////////
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import '../css/cardCollection.css'
import axios from 'axios'
import Card from '../components/Card'
import ShowCard from '../components/ShowCard';
import LoadingScreen from '../components/LoadingScreen';
import ShowMoney from '../components/ShowMoney';
///////////////////////////////////////////
//SETUP
///////////////////////////////////////////
const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = window.localStorage.getItem('player_id')


///////////////////////////////////////////
//APP
///////////////////////////////////////////

function App() {
    const [cards, setCards] = useState();//for all cards
    const [showCard, setShowCard] = useState();//to show cards as an overlay

    useEffect(() => {
        axios.post(API_URL + '/api/cardCollection/cardCollection', {//get all cards and store them in 'cards' state
            "playerID": player_id
        })
            .then((cards) => {
                setCards(cards.data.map(card => {//use '.map' method for every card
                    function show() {//this function is for showing card as an overlay so it can be sold or upgrades
                        setShowCard(<ShowCard card={card} back={back}></ShowCard>)
                    }
                    function back() {//back button for show card
                        setShowCard()
                    }
                    return (<div onClick={show}><Card card={card} key={card.card_id}></Card></div>)//use the 'Card' component for everycard 
                }))
            })
    }, [])
    return (
        <div id="cardCollectionMain">
            <LoadingScreen/>
            <NavBar/>
            <div id='cardsCollection'>
            <div style={{ justifyContent: 'center', display: 'flex' }} >

<ShowMoney />
</div>
                <div id='cards'>
                    {cards}
                </div>
                {showCard}
            </div>
            
        </div>
    );
}

export default App;

