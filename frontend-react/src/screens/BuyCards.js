///////////////////////////////////////////
//IMPORTS
///////////////////////////////////////////

import LoadingScreen from "../components/LoadingScreen";
import Lootbox from "../components/Lootbox";
import NavBar from "../components/NavBar";
import ShowMoney from "../components/ShowMoney";
import '../css/buyCards.css'

///////////////////////////////////////////
//SETUP
///////////////////////////////////////////


const API_URL = 'https://monster-cat-world.onrender.com';
const player_id = window.localStorage.getItem('player_id')


///////////////////////////////////////////
//APP
///////////////////////////////////////////
export default function App() {
    return (
        <div>
            <NavBar/>
            <LoadingScreen/>
            <div id="BuyCards">
                <div style={{ justifyContent: 'center', display: 'flex' }} >

                    <ShowMoney />
                </div>
                <div id="lootboxes">
                    <Lootbox card_No={1} price={10}></Lootbox>
                    <Lootbox card_No={3} price={25}></Lootbox>
                    <Lootbox card_No={5} price={40}></Lootbox>
                </div></div>
                
        </div>
    )
}