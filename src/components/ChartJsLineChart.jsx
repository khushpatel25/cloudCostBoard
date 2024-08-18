import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ChartJsLineChart = ({ chartData, className,groupByValue }) => {
    const labels = chartData.map(data => data.date.slice(5, 10));

    const serviceNames = Object.keys(chartData[0]).filter(key => key !== 'date');
    console.log({ serviceNames })

    const predefinedColors = [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
        '#FFC4E1', '#C4C4FF', '#C4FFC4', '#FFE1BA', '#BAFFC4',
        '#FFBABA', '#FFDFDF', '#FFFFE1', '#E1FFC4', '#C4E1FF',
        '#FFCCE1', '#E1C4FF', '#E1FFDF', '#FFE1C4', '#C4FFD7'
    ];

    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const getColor = (index) => {
        if (index < predefinedColors.length) {
            return predefinedColors[index];
        } else {
            return getRandomColor();
        }
    };

    const datasets = serviceNames.map((service, index) => {
        const color = getColor(index)
        return {
            label: service,
            data: chartData.map(data => data[service]),
            borderColor: color,
            backgroundColor: color,
            fill: false,
            tension: 0.1,
        };
    });

    const data = {
        labels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${groupByValue} Cost Over Time`,
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
            <Line data={data} options={options} />
        </div>
    );
};

export default ChartJsLineChart;
