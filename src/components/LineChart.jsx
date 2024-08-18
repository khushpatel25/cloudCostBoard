import React from 'react'
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { CartesianGrid, XAxis, Line, LineChart,YAxis, Bar, BarChart } from "recharts"

const LineChartUsage = ({ chartData, className }) => {

    console.log(chartData)

    const config = chartData.reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
            if (key !== 'date' && !acc[key]) {
                acc[key] = {
                    label: key,
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                };
            }
        });
        return acc;
    }, {});

    console.log(config)

    return (
        <div className={className}>
            <ChartContainer config={config}>
                <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 12, right: 12 }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 10)}
                    />
                     <YAxis label={{ value: 'Cost (USD)', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    {Object.keys(config).map(service => (
                        <Line
                            key={service}
                            dataKey={service}
                            type="natural"
                            stroke={config[service].color}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ChartContainer>

        </div>
    )
}

export default LineChartUsage
