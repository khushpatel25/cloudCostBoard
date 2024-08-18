import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartJsBarChart = ({ chartData, className }) => {

    console.log(chartData)

    const labels = chartData.map(data => data.date.slice(5, 10)); 
    const data = {
        labels,
        datasets: [
            {
                label: 'Total Cost',
                data: chartData.map(data => data.totalUsage),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    console.log({data})

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Cost Over Time',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Cost (USD)',
                },
            },
        },
    };

    return (
        <div className={className}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ChartJsBarChart;
