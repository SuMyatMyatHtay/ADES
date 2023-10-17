import React from 'react';
import NavBar from '../components/NavBar';
import ProfileComponent from '../components/profile_component'
import '../css/profile.css';

class Profile extends React.Component {


    render() {
        return (

            <div>
                <NavBar />
                <div id="profileBG">
                <ProfileComponent />
                </div>
            </div>
        )
    }

}

export default Profile