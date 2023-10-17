import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pinkLoading from '../images/gif/LoadingPinkBar.gif';
import TradingSuccess from '../images/gif/TradingSuccess.gif';

function TradingSuccessTransition() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    var firstImage = (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.449)" }}>
            <img src={pinkLoading} alt='PinkLoading' style={{ width: "60%", height: "auto" }} />
        </div>
    );

    var secondImage = (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.449)" }}>
            <img src={TradingSuccess} alt='PinkLoading' style={{ width: "60%", height: "auto" }} />
        </div>
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsVisible(true);
        }, 2500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            const redirectTimeout = setTimeout(() => {
                navigate('/Rtrading');
            }, 1500);

            return () => {
                clearTimeout(redirectTimeout);
            };
        }
    }, [isVisible, navigate]);

    return <div>{isVisible ? secondImage : firstImage}</div>;
}

export default TradingSuccessTransition;
