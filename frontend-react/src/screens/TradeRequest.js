import React from 'react'; // Import React from 'react' instead of importing Component

import 'bootstrap/dist/css/bootstrap.css';

import PendingTradeReqBadge from '../images/PeadingTradingReqBadge.png'
import '../css/allFriends.css';
import TradeReqArea from '../components/TR_Component'
import NavBar from '../components/NavBar'

const API_URL = 'https://monster-cat-world.onrender.com';

const FriReqScreen = () => {
    return (
        <div >
            <NavBar />
            <div className="Main" style={{ overflow: 'scroll', height: '100vh', padding: "0px 0px 100px 0px" }}>
                <style>
                    {`
        .Main::-webkit-scrollbar {
            width: 0;
            height: 0; 
        }
        
        `}
                </style>
                <div className='imgDiv'>
                    <img src={PendingTradeReqBadge} alt="Friends Badge" />
                </div>
                <TradeReqArea />

            </div>
        </div>
    )
}

export default FriReqScreen; 