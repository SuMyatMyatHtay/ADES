import React from 'react'; // Import React from 'react' instead of importing Component

import 'bootstrap/dist/css/bootstrap.css';
import SPComponent from '../components/SP_Component';
import SearchBG from '../images/SearchBG.jpg'
import NavBar from '../components/NavBar'


import '../css/allFriends.css';

import AFBG from '../images/FriendBg.jpg'


const API_URL = 'https://monster-cat-world.onrender.com';

class SearchPlayerScreen extends React.Component {
    constructor() {
        super();

    }



    render() {
        return (
            <div >
                <NavBar />
                <div className="Main" style={{ overflow: 'scroll', height: '100vh', backgroundImage: `url(${AFBG})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>

                    <style>
                        {`
        .Main::-webkit-scrollbar {
            width: 0;
            height: 0; 
        }
        
        `}
                    </style>

                    <div className='imgDiv'>
                        <img src={require('../images/SearchPlayerBadge.png')} alt='SearchPlayerBadge' style={{ width: "700px" }} />
                    </div>
                    <div style={{ paddingBottom: "150px" }}>
                        <SPComponent />
                    </div>

                </div>
            </div>
        )
    }
}

export default SearchPlayerScreen;

