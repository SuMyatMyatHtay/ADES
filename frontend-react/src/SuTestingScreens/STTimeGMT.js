import React, { useEffect, useState } from 'react';

const YourComponent = () => {
    const [isAfterDateTime, setIsAfterDateTime] = useState(false);
    const [currentDateTimeGMT, setCurrentDateTimeGMT] = useState('');
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const checkIfAfterDateTime = () => {
            const currentDate = new Date();
            const targetDateTime = new Date('July 19, 2023 15:00:00 GMT');
            setIsAfterDateTime(currentDate > targetDateTime);
        };

        const getCurrentDateTimeGMT = () => {
            const currentDate = new Date();
            const options = { timeZone: 'GMT' };
            const currentDateTimeGMT = currentDate.toLocaleString('en-US', options);
            setCurrentDateTimeGMT(currentDateTimeGMT);
        };

        const currentDateGMT = new Date();

        // Get the current month in GMT (0 to 11, where 0 represents January and 11 represents December)
        const currentMonthGMT = currentDateGMT.getUTCMonth();

        // Get the current year in GMT (e.g., 2023)
        const currentYearGMT = currentDateGMT.getUTCFullYear();

        console.log("Current Month (GMT):", currentMonthGMT); // Output: Current Month (GMT): 6 (July)
        console.log("Current Year (GMT):", currentYearGMT);

        getCurrentDateTimeGMT();

        checkIfAfterDateTime();

        const calculateCountdown = () => {
            const targetDateTime = new Date('July 20, 2023 18:00:00 GMT');
            const currentTime = new Date();
            const timeDifference = targetDateTime - currentTime;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setCountdown('Timer has expired');
            }
        };

        const timer = setInterval(calculateCountdown, 1000);

        return () => {
            clearInterval(timer);
        };


    }, []);

    return (
        <div style={{ color: "white" }}>
            {isAfterDateTime ? (
                <p>The current time is after 6 PM on 1st June 2023 GMT.</p>
            ) : (
                <p>The current time is before 6 PM on 1st June 2023 GMT.</p>
            )}

            <div>
                <p>Current Date and Time in GMT: {currentDateTimeGMT}</p>
            </div>

            <div>
                <p>Countdown to 20 July 2023, 6 PM GMT: {countdown}</p>
            </div>
        </div>
    );
}

export default YourComponent;