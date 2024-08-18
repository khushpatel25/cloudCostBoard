import React from 'react';
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, XAxis, YAxis, Bar, BarChart, LabelList } from "recharts";

const BarChartUsage = ({ chartData, className }) => {
    // Generate a consistent color for each service
    const config = chartData.reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
            if (key !== 'date' && !acc[key]) {
                acc[key] = {
                    label: key,
                    color: "hsl(var(--chart-1))",
                };
            }
        });
        return acc;
    }, {});

    return (
        <div className={className}>
            <ChartContainer config={config}>
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ left: 12, right: 12 }}
                    // barSize={40}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(5, 10)} 
                    />
                    <YAxis label={{ value: 'Cost (USD)', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    {Object.keys(config).map(service => (
                        <Bar
                            key={service}
                            dataKey={service}
                            fill={config[service].color}
                            radius={8}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    ))}
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default BarChartUsage;
