import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RFriTradeTransition = () => {
    const { number } = useParams();
    localStorage.setItem('FriendID', number);
    window.location.href = '/Rtrading'

    // useEffect(() => {
    //     console.log(number); // Print the number from the URL
    // }, [number]);



    return (
        <div>
            {number}
            {/* JSX for rendering the component */}
        </div>
    );
}

export default RFriTradeTransition;
