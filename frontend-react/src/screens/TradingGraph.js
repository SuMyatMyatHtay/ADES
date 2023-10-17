import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from "react";
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';
import TGComponent from '../components/TG_Component'
import NavBar from '../components/NavBar'
const API_URL = 'https://monster-cat-world.onrender.com';
const playerID = localStorage.getItem('player_id');

//var statee = "accepted";
var svgWidth = 1400;
var svgHeight = 600;

const TGScreen = () => {

    const [graphCheck, setGraphCheck] = useState(true);

    useEffect(() => {
        tradingReqCount(playerID);
    }, []);

    const tradingReqCount = (playerID) => {
        axios.post(API_URL + '/api/tradingRoute/tradingReqCount/' + playerID)
            .then((response) => {
                friIDArray(playerID);
                console.log(response);
                console.log(response.data);
                if (response.data.length === 0) {
                    setGraphCheck(false);
                    var nochartHTML = document.getElementById("nochart");
                    nochartHTML.innerHTML = 'No Trade chart is provided as there is no trade request yet.';
                } else {
                    let data = [];
                    let monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "Oct", "Nov", "Dec"];
                    if (response.data.length === 1) {
                        svgWidth = 600;
                        svgHeight = 400;
                    } else if (response.data.length <= 3) {
                        svgWidth = 800;
                        svgHeight = 400;
                    } else if (response.data.length <= 8) {
                        svgWidth = 1100;
                        svgHeight = 400;
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        var tempData = { label: monthNames[response.data[i].month - 1], accepted: response.data[i].accepted_count, rejected: response.data[i].rejected_count, pending: response.data[i].pending_count };
                        data.push(tempData);
                    }
                    graph(data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const friIDArray = (playerID) => {
        axios.get(API_URL + '/api/tradingRoute/friIDArray/' + playerID)
            .then((response) => {
                console.log(response);
                console.log(response.data);
                response.data.unshift(playerID);
                //statistics2(response.data, statee);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const graph = (data) => {
        var margin = { top: 20, right: 20, bottom: 40, left: 40 };
        var chartWidth = svgWidth - margin.left - margin.right;
        var chartHeight = svgHeight - margin.top - margin.bottom;

        var svg = d3.select("#chart")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var chart = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleBand()
            .range([0, chartWidth])
            .padding(0.35)
            .domain(data.map(function (d) { return d.label; }));

        var yScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return Math.max(d.accepted, d.rejected, d.pending); })]);

        var acceptedBars = chart.selectAll(".accepted-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("style", "fill: rgb(0, 255, 42)") // Corrected inline style syntax
            .attr("x", function (d) { return xScale(d.label); })
            .attr("y", function (d) { return yScale(d.accepted); })
            .attr("width", xScale.bandwidth() / 3)
            .attr("height", function (d) { return chartHeight - yScale(d.accepted); });

        var rejectedBars = chart.selectAll(".rejected-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("style", "fill: rgb(255, 0, 0)") // Corrected inline style syntax
            .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 3; })
            .attr("y", function (d) { return yScale(d.rejected); })
            .attr("width", xScale.bandwidth() / 3)
            .attr("height", function (d) { return chartHeight - yScale(d.rejected); });

        var pendingBars = chart.selectAll(".pending-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("style", "fill: rgb(255, 234, 0)") // Corrected inline style syntax
            .attr("x", function (d) { return xScale(d.label) + (2 * xScale.bandwidth() / 3); })
            .attr("y", function (d) { return yScale(d.pending); })
            .attr("width", xScale.bandwidth() / 3)
            .attr("height", function (d) { return chartHeight - yScale(d.pending); });

        chart.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("className", "label")
            .text(function (d) { return d.accepted; })
            .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 6; })
            .attr("y", function (d) { return yScale(d.accepted) - 5; })
            .attr("text-anchor", "middle");

        chart.selectAll(".rejected-label")
            .data(data)
            .enter()
            .append("text")
            .attr("className", "rejected-label")
            .text(function (d) { return d.rejected; })
            .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 2; })
            .attr("y", function (d) { return yScale(d.rejected) - 5; })
            .attr("text-anchor", "middle");

        chart.selectAll(".pending-label")
            .data(data)
            .enter()
            .append("text")
            .attr("className", "pending-label")
            .text(function (d) { return d.pending; })
            .attr("x", function (d) { return xScale(d.label) + (5 * xScale.bandwidth() / 6); })
            .attr("y", function (d) { return yScale(d.pending) - 5; })
            .attr("text-anchor", "middle");

        chart.append("line")
            .attr("className", "x-axis-line")
            .attr("x1", 0)
            .attr("y1", chartHeight)
            .attr("x2", chartWidth)
            .attr("y2", chartHeight)
            .style("stroke", "black")
            .style("stroke-width", 1);

        chart.selectAll(".x-axis-label")
            .data(data)
            .enter()
            .append("text")
            .attr("className", "x-axis-label")
            .text(function (d) { return d.label; })
            .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 2; })
            .attr("y", chartHeight + 20)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "hanging");

        chart.append("g")
            .attr("className", "y-axis")
            .call(d3.axisLeft(yScale));

        chart.append("text")
            .attr("className", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            .attr("y", -margin.left + 10)
            .attr("text-anchor", "middle")
            .text("Number of Requests");
    };



    return (
        <div >
            <NavBar />
            <div className="Main" style={{ overflow: 'scroll', height: '100vh' }}>
                <style>
                    {`
        .Main::-webkit-scrollbar {
            width: 0;
            height: 0; 
        }
        
        `}
                </style>
                <div className='imgDiv'>
                    <img src={require('../images/TradingStatistics.png')} alt='SearchPlayerBadge' style={{ width: "500px" }} />
                </div>
                <div id="chartContainer">
                    <div style={{ display: "flex", justifyContent: "center", margin: " 50px" }}>
                        <div style={{ backgroundColor: "white", padding: "20px" }}>
                            <svg id="chart"></svg>
                        </div>

                    </div>
                    <div className={graphCheck ? "" : "d-none"} style={{ textAlign: "center" }}>
                        <img src={require('../images/graphLabel.png')} alt='Graph Table' style={{ width: "50%" }} />
                    </div>
                </div>

                <h3 id="nochart" style={{ color: "red", textAlign: "center" }}></h3>

                <TGComponent />


            </div >
        </div>

    )
}

export default TGScreen; 