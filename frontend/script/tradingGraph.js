const API_URL = "https://monster-cat-world.onrender.com"

//Temporary Testing Data before connecting with other tables 
const PLAYERIDTEMP = localStorage.getItem('player_id');
const extraTable = document.getElementById('extraTable');
const accptedButton = document.getElementById('accptedButton');
const rejectedButton = document.getElementById('rejectedButton');
const pendingButton = document.getElementById('pendingButton');
const smallTableHeading = document.getElementById('smallTableHeading');


var statee = "accepted";
//Graph width and height 
var svgWidth = 1400;
var svgHeight = 600;

window.onload = function () { tradingReqCount(PLAYERIDTEMP) }
accptedButton.onclick = function () {
    extraTable.innerHTML = ' <img src="./images/gif/LoadingPinkBar.gif" alt="Loading...">'
    statee = "accepted";
    smallTableHeading.innerHTML = "Total Accepted Trading Graph Between Player and Friends"
    friIDArray(PLAYERIDTEMP, statee);
}
rejectedButton.onclick = function () {
    extraTable.innerHTML = ' <img src="./images/gif/LoadingPinkBar.gif" alt="Loading...">'
    statee = "rejected";
    smallTableHeading.innerHTML = "Total Rejected Trading Graph Between Player and Friends"
    friIDArray(PLAYERIDTEMP, statee);

}
pendingButton.onclick = function () {
    extraTable.innerHTML = ' <img src="./images/gif/LoadingPinkBar.gif" alt="Loading...">'
    statee = "pending";
    smallTableHeading.innerHTML = "Total Pending Trading Graph Between Player and Friends"
    friIDArray(PLAYERIDTEMP, statee);
}

function tradingReqCount(playerID) {
    axios.post(API_URL + '/api/tradingRoute/tradingReqCount/' + playerID)
        .then((response) => {
            friIDArray(playerID);
            console.log(response)
            console.log(response.data);
            //console.log(response.data.length)
            if (response.data.length == 0) {
                var nochartHTML = document.getElementById("nochart");
                nochartHTML.innerHTML = 'No trade request yet'
            }
            else {
                let data = [];
                let monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "Oct", "Nov", "Dec"]
                if (response.data.length == 1) {
                    svgWidth = 600;
                    svgHeight = 400;
                }
                else if (response.data.length <= 3) {
                    svgWidth = 800;
                    svgHeight = 400;
                }
                else if (response.data.length <= 8) {
                    svgWidth = 1100;
                    svgHeight = 400;
                }
                for (var i = 0; i < response.data.length; i++) {
                    var tempData = { label: monthNames[response.data[i].month - 1], accepted: response.data[i].accepted_count, rejected: response.data[i].rejected_count, pending: response.data[i].pending_count }
                    data.push(tempData);
                }

                graph(data);
                //console.log(data)
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}

function graph(data) {
    // Set up SVG dimensions
    //var svgWidth = 1400;
    //var svgHeight = 600;
    var margin = { top: 20, right: 20, bottom: 40, left: 40 };
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("#chart")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Create a group for the chart
    var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    var xScale = d3.scaleBand()
        .range([0, chartWidth])
        .padding(0.35)
        .domain(data.map(function (d) { return d.label; }));

    var yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(data, function (d) { return Math.max(d.accepted, d.rejected, d.pending); })]);

    // Create bars for "Accepted"
    var acceptedBars = chart.selectAll(".accepted-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar accepted-bar")
        .attr("x", function (d) { return xScale(d.label); })
        .attr("y", function (d) { return yScale(d.accepted); })
        .attr("width", xScale.bandwidth() / 3)
        .attr("height", function (d) { return chartHeight - yScale(d.accepted); });

    // Create bars for "Rejected"
    var rejectedBars = chart.selectAll(".rejected-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar rejected-bar")
        .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 3; })
        .attr("y", function (d) { return yScale(d.rejected); })
        .attr("width", xScale.bandwidth() / 3)
        .attr("height", function (d) { return chartHeight - yScale(d.rejected); });

    // Create bars for "Pending"
    var pendingBars = chart.selectAll(".pending-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar pending-bar")
        .attr("x", function (d) { return xScale(d.label) + (2 * xScale.bandwidth() / 3); })
        .attr("y", function (d) { return yScale(d.pending); })
        .attr("width", xScale.bandwidth() / 3)
        .attr("height", function (d) { return chartHeight - yScale(d.pending); });

    // Add labels to accepted bars
    chart.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function (d) { return d.accepted; })
        .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 6; })
        .attr("y", function (d) { return yScale(d.accepted) - 5; })
        .attr("text-anchor", "middle");

    // Add labels to rejected bars
    chart.selectAll(".rejected-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "rejected-label")
        .text(function (d) { return d.rejected; })
        .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 2; })
        .attr("y", function (d) { return yScale(d.rejected) - 5; })
        .attr("text-anchor", "middle");

    // Add labels to pending bars
    chart.selectAll(".pending-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "pending-label")
        .text(function (d) { return d.pending; })
        .attr("x", function (d) { return xScale(d.label) + (5 * xScale.bandwidth() / 6); })
        .attr("y", function (d) { return yScale(d.pending) - 5; })
        .attr("text-anchor", "middle");

    // Add x-axis line
    chart.append("line")
        .attr("class", "x-axis-line")
        .attr("x1", 0)
        .attr("y1", chartHeight)
        .attr("x2", chartWidth)
        .attr("y2", chartHeight)
        .style("stroke", "black")
        .style("stroke-width", 1);

    // Add x-axis labels
    chart.selectAll(".x-axis-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "x-axis-label")
        .text(function (d) { return d.label; })
        .attr("x", function (d) { return xScale(d.label) + xScale.bandwidth() / 2; })
        .attr("y", chartHeight + 20)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    chart.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .text("Number of Requests");

}

function friIDArray(playerID) {
    axios.get(API_URL + '/api/tradingRoute/friIDArray/' + playerID)
        .then((response) => {
            console.log(response)
            console.log(response.data);
            response.data.unshift(playerID);
            statistics2(response.data, statee);
        })
        .catch((error) => {
            console.log(error);
        })
}

function statistics2(friArray, statee) {
    axios.post(API_URL + '/api/tradingRoute/statistics2', {
        "friArray": friArray,
        "statee": statee
    })

        .then((response) => {
            var tempTable = ``;
            console.log(response)
            console.log(response.data);
            tempTable += ` 
            <table class="table table-bordered" style="color: white; background-color: rgba(0, 0, 0, 0.556);">
                <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                    </tr>
                </thead>
                <tbody>
            `
            for (var i = 0; i < response.data.length; i++) {
                if (i == response.data.length - 1) {
                    tempTable += `
                    <tr>
                        <td>${response.data[i][0]["player_username"]}</td>
                        <td>${response.data[i][0]["AcceptedNum"]}</td>
                    </tr>
                    </tbody>
                    </table>
                `
                }
                else {
                    tempTable += `
                    <tr>
                        <td>${response.data[i][0]["player_username"]}</td>
                        <td>${response.data[i][0]["AcceptedNum"]}</td>
                    </tr>
                `
                }
            }

            extraTable.innerHTML = tempTable;

        })
        .catch((error) => {
            console.log(error);
        })
}

/*
// Sample data
var data = [
    { label: "A", accepted: 10, rejected: 5, pending: 3 },
    { label: "B", accepted: 8, rejected: 3, pending: 2 },
    { label: "C", accepted: 12, rejected: 7, pending: 4 },
    { label: "D", accepted: 6, rejected: 4, pending: 1 },
    { label: "E", accepted: 9, rejected: 2, pending: 5 },
    { label: "F", accepted: 9, rejected: 2, pending: 5 }
];
*/