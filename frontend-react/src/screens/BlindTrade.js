import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios'; // Import axios
import Countdown from '../images/SuCountdownBG.jpg'
import 'bootstrap/dist/css/bootstrap.css';

const playerID = localStorage.getItem('player_id')

var REACT_URL = 'https://monster-cat-world.onrender.com';

const API_URL = 'https://monster-cat-world.onrender.com';

const YourComponent = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    //State 1 => potal is closed 
    //State 2 => You can now bet 
    //State 3 => Analysing for error clearing 
    //State 4 => Collecting card 
    const [state, setState] = useState(0);
    const [stageDescription, setStageDescription] = useState("")
    const [isAfterDateTime, setIsAfterDateTime] = useState(false);
    const [isAfterDateTime1, setIsAfterDateTime1] = useState(false);
    const [isAfterDateTime2, setIsAfterDateTime2] = useState(false);
    const [isAfterDateTime3, setIsAfterDateTime3] = useState(false);
    const [countdown, setCountdown] = useState([]);
    const [BTbutton, setBTButton] = useState([]);

    const [clicked, setClicked] = useState(false);
    const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDateGMT = new Date();
    //if u want legit current, need to +1 
    const currentMonthGMT = currentDateGMT.getUTCMonth();
    const currentYearGMT = currentDateGMT.getUTCFullYear();

    const bettingStartDate = new Date(`${Months[currentMonthGMT]} 1, ${currentYearGMT} 18:00:00 GMT`);
    const bettingEndDate = new Date(`${Months[currentMonthGMT]} 18, ${currentYearGMT} 18:00:00 GMT`);
    const ResultDate = new Date(`${Months[currentMonthGMT]} 20, ${currentYearGMT} 15:00:00 GMT`);
    const CollectDate = new Date(`${Months[currentMonthGMT]} 28, ${currentYearGMT} 18:00:00 GMT`);

    const togglePopup = () => {
        console.log('popup screen yay');
        setIsPopupOpen(!isPopupOpen);
        if (isPopupOpen == true) {
            window.location.href = '/RBiddingResult'
        }

    };

    useEffect(() => {
        //console.log(bettingEndDate, 'bedate');

        const checkIfAfterDateTime = () => {
            const currentDate = new Date();
            const targetDateTime = bettingStartDate;
            setIsAfterDateTime(currentDate < targetDateTime);
        };

        const checkIfAfterDateTime1 = () => {
            const currentDate = new Date();
            const targetDateTime = bettingEndDate;
            setIsAfterDateTime1(currentDate < targetDateTime);
        };

        const checkIfAfterDateTime2 = () => {
            const currentDate = new Date();
            const targetDateTime = ResultDate;
            setIsAfterDateTime2(currentDate < targetDateTime);
        };

        const checkIfAfterDateTime3 = () => {
            const currentDate = new Date();
            const targetDateTime = CollectDate;
            setIsAfterDateTime3(currentDate < targetDateTime);
        };


        checkIfAfterDateTime();
        checkIfAfterDateTime1();
        checkIfAfterDateTime2();
        checkIfAfterDateTime3();

        //Portal is not open yet 
        if (isAfterDateTime && isAfterDateTime1 && isAfterDateTime2) {
            setState(1);
            setStageDescription(`The portal will be opened on 1st ${Months[currentMonthGMT]} 6pm`);
            setBTButton([<button
                className="text-center position-absolute bottom-0 start-50 translate-middle-x"
                style={{ fontSize: "20px", marginBottom: "30px" }}
                onClick={() => { BTResult() }}
            >
                Seee the previous month &#9654;
            </button>])
        }

        //Portal is now open. Can start bidding already 
        else if (!isAfterDateTime && isAfterDateTime1 && isAfterDateTime2) {
            setState(2);
            setStageDescription(`The portal is now open.You can bid until 18th ${Months[currentMonthGMT]} 6pm`)
            setBTButton([<button
                className="text-center position-absolute bottom-0 start-50 translate-middle-x"
                style={{ fontSize: "20px", marginBottom: "30px" }}
                onClick={() => { biddingNavigate() }} disabled={clicked}
            >
                Go To Bidding Room &#9654;
            </button>])
        }

        //The results are not out yet. Waiting for result right now 
        else if (!isAfterDateTime && !isAfterDateTime1 && isAfterDateTime2) {
            setState(3)
            setStageDescription(`Hold on tight. The result will be out in 20th ${Months[currentMonthGMT]} 6pm`)
            setBTButton([<button
                className="text-center position-absolute bottom-0 start-50 translate-middle-x"
                style={{ fontSize: "20px", marginBottom: "30px" }}
            >
                The result gonna out soon
            </button>])
        }

        //Results are out now
        else if (!isAfterDateTime && !isAfterDateTime1 && !isAfterDateTime2) {
            setState(4)
            setStageDescription(`Please collect your cards before 28th ${Months[currentMonthGMT]}. `)
            setBTButton([<button
                className="text-center position-absolute bottom-0 start-50 translate-middle-x"
                style={{ fontSize: "20px", marginBottom: "30px" }}
                onClick={() => { resultsOut() }}
            >
                Results are out now. Collect your card &#9654;
            </button>])
        }


        const calculateCountdown = () => {
            let targetDateTime, currentTime;

            if (isAfterDateTime) {
                targetDateTime = bettingStartDate;
                currentTime = new Date();
            } else if (isAfterDateTime1) {
                targetDateTime = bettingEndDate;
                currentTime = new Date();
            } else if (isAfterDateTime2) {
                targetDateTime = ResultDate;
                currentTime = new Date();
            } else if (isAfterDateTime3) {
                targetDateTime = CollectDate;
                currentTime = new Date();
            }

            const timeDifference = targetDateTime - currentTime;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

                setCountdown([days, hours, minutes, seconds]);
            } else {
                setCountdown('Timer has expired');
            }
        };

        const timer = setInterval(calculateCountdown, 1000);

        return () => {
            clearInterval(timer);
        };




    }, [isAfterDateTime, isAfterDateTime1, isAfterDateTime2, isAfterDateTime3]);

    const biddingNavigate = () => {
        if (!clicked) {
            axios.post(`${REACT_URL}/api/blackRoomRoute/check/${(playerID)} `, {
                "month": currentMonthGMT,
                "year": currentYearGMT
            })
                .then((response) => {
                    setClicked(true);
                    console.log(response.data.length)
                    if (response.data.length == 0) {
                        window.location.href = '/RFirstTimeEntryB'
                    }
                    else {
                        window.location.href = '/RBiddingRoom'
                    }
                })



        }

    }
    const BTResult = () => {
        window.location.href = '/RBiddingResult'
    }

    const resultsOut = () => {
        axios.post(`${REACT_URL}/api/blackRoomRoute/check/${(playerID)}`, {
            "month": currentMonthGMT,
            "year": currentYearGMT
        })
            .then((response) => {
                console.log(response.data);
                setClicked(true);
                // console.log(response.data.length)
                if (response.data.length == 0) {
                    console.log("Bitch you never enter when the portal is opened.")
                    togglePopup();
                    // window.location.href = '/RFirstTimeEntryB'
                }
                else if (response.data[0].collectCheck == 0) {

                    window.location.href = '/RCollectECard'
                }
                else {
                    window.location.href = '/RBiddingResult'
                }
            })

    }

    const navigateTo = () => {
        window.location.href = '/Rtrading'
    }

    const backButtonStyle = {
        position: 'absolute', // Position the button relative to the container
        top: '20px', // Distance from the top (adjust as needed)
        left: '20px', // Distance from the left (adjust as needed)
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
            {isPopupOpen && (
                <div className="popup-overlay" style={{ zIndex: 9999 }}>
                    <style>
                        {`
    .popup - overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100 %;
    background - color: rgba(0, 0, 0, 0.7);
    display: flex;
    align - items: center;
    justify - content: center;
    z - index: 9999; /* Add this line to set the z-index value */
}
  
    .popup {
    background - color: #fff;
    padding: 20px;
    border - radius: 5px;
    box - shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
  
    .popup - content {
    text - align: center;
}
  
    .popup h2 {
    margin - top: 0;
}
  
    .popup button {
    margin - top: 10px;
}
`}
                    </style>

                    <div className="popup">
                        <div className="popup-content" style={{ width: "300px" }}>
                            <h2>Bidding Result</h2>
                            <p>You do not receive any card as you never enter into the portal in time. </p>
                            <button onClick={togglePopup}>Next</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='Main' style={{ color: 'white', overflow: 'scroll', height: '100vh', backgroundColor: "black", padding: '80px 0px' }}>

                {
                    /* 
                    <div className={isAfterDateTime && isAfterDateTime1 && isAfterDateTime2 ? '' : 'd-none'} style={{ backgroundColor: 'red' }}>
                        <h4>The portal will be opened on 10th July 6pm</h4>
                        <h2>
                            Countdown for the portal. Bidding starts in:{' '}
                            {countdown[0]} days : {countdown[1]} hours : {countdown[2]} minutes :{' '}
                            {countdown[3]} seconds
                        </h2>
                    </div>
        
                    <div className={!isAfterDateTime && isAfterDateTime1 && isAfterDateTime2 ? '' : 'd-none'} style={{ backgroundColor: 'red' }}>
                        <h4>The portal is now open. You can bid until 20th July 6pm</h4>
                        <h2>
                            Countdown for the portal. Bidding starts in:{' '}
                            {countdown[0]} days : {countdown[1]} hours : {countdown[2]} minutes :{' '}
                            {countdown[3]} seconds
                        </h2>
                    </div>
        
                    <div className={!isAfterDateTime && !isAfterDateTime1 && isAfterDateTime2 ? '' : 'd-none'} style={{ backgroundColor: 'red' }}>
                        <h4>Hold on tight. The result will be out in 22th July 6pm</h4>
                        <h2>
                            Countdown for the portal. Bidding starts in:{' '}
                            {countdown[0]} days : {countdown[1]} hours : {countdown[2]} minutes :{' '}
                            {countdown[3]} seconds
                        </h2>
                    </div> 
                    */
                }

                <button style={backButtonStyle} onClick={() => { navigateTo() }}> Back </button>
                <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                        backgroundImage: `url(${Countdown})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "80%",
                        height: "600px",
                        margin: "0 auto",
                        position: "relative"
                    }}
                >
                    <h1 className="text-center" style={{ fontSize: "70px", padding: "0px 0px 2px 90px", letterSpacing: "15px" }}>
                        {countdown[0]} &nbsp; {countdown[1]} &nbsp; {countdown[2]} &nbsp; {countdown[3]}
                    </h1>
                    <h4
                        className="text-center position-absolute top-0 start-50 translate-middle-x"
                        style={{ fontSize: "40px", marginTop: "20px" }}
                    >
                        {stageDescription}
                    </h4>
                    {BTbutton}
                </div>




            </div >
        </div>
    );
}

export default YourComponent;