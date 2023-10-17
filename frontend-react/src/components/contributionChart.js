import { Bar } from "react-chartjs-2";
import React from "react";

const ContributionGraph = ({ chartData }) => {
  
    
    return (
        <div>
            <Bar
                data={chartData}
                options={

                    {
                        plugins: {
                            title: {
                                display: true,
                                text: `Clan Members Contribution (minigames+rps) `,

                            },
                            legend: {
                                display: false
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
};

export default ContributionGraph;
