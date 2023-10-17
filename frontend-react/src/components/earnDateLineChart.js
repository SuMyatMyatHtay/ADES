// components/LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";

function EarndDateLineChart({ chartData, players }) {
  return (
    <div className="chart-container" style={{ height: "400px" }}>
      <Line
        data={chartData}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                afterTitle: function(tooltipItem){

                  return 'Players who played:'
                },
                beforeBody: function (tooltipItem) {
                  const dataIndex = tooltipItem[0].dataIndex;
                  const additionalInfo = players[dataIndex].additionalInfo
                  return additionalInfo
                },
                beforeLabel:function (tooltipItem) {
                  return' '
                }
              }
            },
            title: {
              display: true,
              text: "Clan Points Earned by Date",
            },
            legend: {
              display: false,
            },
          },
          scales: {

            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Clan Points Earned',
                }
            }
        },
        }}
      />
    </div>
  );
}


export default EarndDateLineChart;

