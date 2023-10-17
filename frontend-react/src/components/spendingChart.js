import { Bar } from "react-chartjs-2";
import React from "react";

const SpendingChart = ({ chartData, totalPoints }) => {
    return (
        <div>
            <Bar
                data={chartData}
                options={

                    {
                        plugins: {
                            title: {
                                display: true,
                                text: `Clan Members Spendings (Hive Shop) `,

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
                                    text: 'Clan Points Spent',
                                }
                            }
                        }

                    }}
            />
        </div>
    );
};

export default SpendingChart;
