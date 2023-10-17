import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

const API_URL = 'https://monster-cat-world.onrender.com';
const playerID = localStorage.getItem('player_id');

var tableRow = [];
//var statee = "accepted";

const TGComponent = () => {
    const [TGList, setTGList] = useState([]);
    const [TGLoaded, setTGLoaded] = useState(false);

    const [ChartHeading, setChartHeading] = useState("Accepted");
    const [ChartTable, setChartTable] = useState("");

    useEffect(() => {
        friIDArray(playerID, ChartHeading);
    }, []);

    const tableButtonCLick = (stateCheck) => {
        setTGLoaded(false);
        friIDArray(playerID, stateCheck); // Pass the stateCheck as an argument
    };

    const friIDArray = (playerID, stateCheck) => {
        axios
            .get(API_URL + '/api/tradingRoute/friIDArray/' + playerID)
            .then((response) => {
                console.log(response);
                console.log(response.data);
                response.data.unshift(playerID);
                setChartHeading(stateCheck); // Update the ChartHeading state
                statistics2(response.data, stateCheck);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const statistics2 = (friArray, statee) => {
        axios.post(API_URL + '/api/tradingRoute/statistics2', {
            "friArray": friArray,
            "statee": statee
        })

            .then((response) => {
                tableRow = [];
                // var tempTable = ``;
                console.log(response)
                console.log(response.data);
                for (var i = 0; i < response.data.length; i++) {
                    // if (i == response.data.length - 1) {
                    tableRow.push(
                        <tr>
                            <td style={{ backgroundColor: "rgba(0, 0, 0, 0.556)", color: "white", borderColor: "gold" }}>{response.data[i][0]["player_username"]}</td>
                            <td style={{ backgroundColor: "rgba(0, 0, 0, 0.556)", color: "white", borderColor: "gold" }}>{response.data[i][0]["AcceptedNum"]}</td>
                        </tr>
                    )

                }

                setChartTable(tableRow);
                setTGLoaded(true);

            })
            .catch((error) => {
                console.log(error);
            })
    }

    const textStyle = {
        color: "gold",
        fontWeight: "bold",
        fontSize: "28px",
        margin: "15px 10px",
        padding: '10px 0px 30px 0px'
    }

    const buttonStyle = {
        margin: "5px 15px",
        padding: "6px 20px",
        backgroundColor: 'black', // Set the background color of the button
        color: 'gold', // Set the text color of the button
        border: '2px solid gold', // Add a border to the button (adjust as needed)
        borderRadius: '30px', // Add rounded corners to the button (adjust as needed)
        fontSize: '18px',
        fontWeight: 'bold',
    };

    return (
        <div id="extraGraph" style={{ textAlign: "center", border: "2px solid red", backgroundColor: "rgba(0, 0, 0, 0.7)", margin: "100px", padding: "15px 100px 30px 100px " }}>
            <h3 id="smallTableHeading" style={textStyle}>Total {ChartHeading} Trading Graph Between Player and Friends</h3>


            <table class="table table-bordered" style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.556)", borderColor: "gold" }}>
                <thead>
                    <tr>
                        <th style={{ width: "50%", backgroundColor: "rgba(0, 0, 0, 0.556)", color: "white", borderColor: "gold" }}>Name</th>
                        <th style={{ width: "50%", backgroundColor: "rgba(0, 0, 0, 0.556)", color: "white", borderColor: "gold" }}>Number of {ChartHeading} Requests</th>
                    </tr>
                </thead>
                <tbody style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.556)" }}>
                    {TGLoaded ? ChartTable : <div className="container" style={{ backgroundColor: "rgba(0, 0, 0, 0.556)" }}>
                        <img src={require("../images/gif/LoadingPinkBar.gif")} alt="Loading..." style={{ backgroundColor: "rgba(0, 0, 0, 0.556)", textAlign: 'center' }} />
                    </div>}

                </tbody>
            </table>

            <div style={{ textAlign: "center", paddingTop: "30px" }}>
                <button id="accptedButton" style={buttonStyle} className="custom-button" onClick={() => tableButtonCLick("Accepted")} >Accepted Trading Request</button>
                <button id="rejectedButton" style={buttonStyle} className="custom-button" onClick={() => tableButtonCLick("Rejected")} >Rejected Trading Request</button>
                <button id="pendingButton" style={buttonStyle} className="custom-button" onClick={() => tableButtonCLick("Pending")} >Pending Trading Request</button>
            </div>

        </div >
    );
};

export default TGComponent;
