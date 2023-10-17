import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProfileComponent from '../components/profile_component'
import '../css/profile.css';

const PLAYERIDTEMP = localStorage.getItem('player_id');
const FRIENDIDTEMP = localStorage.getItem('FriendID');
const TEMPID = localStorage.getItem('tempID');

const Profile = () => {

    // useEffect(() => {
    //     localStorage.setItem('tempID', PLAYERIDTEMP);
    //     localStorage.setItem('player_id', FRIENDIDTEMP);
    // }, [])

    const backButton = () => {
        localStorage.setItem('player_id', TEMPID);
        localStorage.removeItem('tempID');
        window.history.back();
    }

    const backButtonStyle = {
        margin: "10px",
        padding: "3px 25px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '3px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '20px',
        fontWeight: 'bold',
    };


    return (

        <div>
            <button style={backButtonStyle} onClick={() => { backButton() }}> Back </button>
            <div id="profileBG">

                <ProfileComponent />
            </div>
        </div>
    )

}

export default Profile; 