import React, { useState, useEffect } from 'react';
import axios from 'axios'


function App() {
    const API_URL = 'https://monster-cat-world.onrender.com'
    //create states
    const [text1, setText1] = useState('Click to pick player');
    const [text2, setText2] = useState(1);
    const [name, setName] = useState(1);

    //function here
    const buttonClicked = () => {
        setText2(prevText2 => prevText2 + 1);
        setText1(`player ${text2}`);
    };
    //using axios 
    const getName=()=>{
        axios.get(`${API_URL}/api/players/getPlayerInfo/${text2-1}`)
        .then((response) => {
            setName(response.data.player_username);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    //function version of componentDidMount 
    //runs every first render of the page
    useEffect(() => {

    }, []);

    return (
        <div>
            <p style={{ color: 'white' }}>{text1}</p>
            <button onClick={buttonClicked}>Click This</button>
            <p style={{ color: 'white' }}>{name}</p>
            <button onClick={getName}>Click For Player's Name</button>
        </div>
    );


}

export default App;