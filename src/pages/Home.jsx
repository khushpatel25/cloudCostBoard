import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { format, subMonths } from "date-fns";
import { DollarSignIcon, ServerIcon, ChartBar, CalendarDaysIcon, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useTotalCostStore } from '@/store/totalCost';
import CostCard from '@/components/CostCard';
import { useMutation } from '@tanstack/react-query';
import LineChartUsage from '@/components/LineChart';
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarChart from '@/components/BarChart';
import BarChartUsage from '@/components/BarChart';
import ChartJsBarChart from '@/components/ChartJsBarChart';
import ChartJsLineChart from '@/components/ChartJsLineChart';

const Home = () => {

  const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || "https://3q04lem3jd.execute-api.us-east-1.amazonaws.com/cloudCostBoard"

  const formatDate = (date) => format(date, "yyyy-MM-dd");
  const today = new Date();
  const defaultEndDate = today;
  const defaultStartDate = subMonths(today, 1);
  const username = localStorage.getItem("cloudUsername");
  const [costData, setCostData] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [chartTotalUsageData, setChartTotalUsageData] = useState(0);
  const [chartDataByService, setChartDataByService] = useState([]);
  const [costByService, setCostByService] = useState([]);
  const [currentMonthCost, setCurrentMonthCost] = useState(0);
  const [lastMonthCost, setLastMonthCost] = useState(0);
  const [nextMonthCost, setNextMonthCost] = useState(0);
  const [groupByValue, setGroupByValue] = useState("SERVICE")
  const [startDate, setStartDate] = useState(formatDate(defaultStartDate))
  const [endDate, setEndDate] = useState(formatDate(defaultEndDate))
  const [groupBy, setGroupBy] = useState('SERVICE');
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const navigate = useNavigate();


  const handleStartDateChange = (date) => {
    setStartDate(formatDate(date))
  }
  const handleEndDateChange = (date) => {
    setEndDate(formatDate(date))
  }
  const handleGroupByChange = (value) => {
    setGroupBy(value);
  };

  const applyFilter = () => {
    setIsApplyingFilter(true)
    console.log(startDate)
    getCostDataMutation.mutate({ startDate, endDate, groupBy, username })
  }


  const calculatePercentageChange = (current, previous) => {
    console.log(current, previous)
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMonthPercentageChange = calculatePercentageChange(Number(currentMonthCost), Number(lastMonthCost));
  console.log(currentMonthCost, lastMonthCost)
  const nextMonthPercentageChange = calculatePercentageChange(Number(nextMonthCost), Number(currentMonthCost));

  const getCostDataMutation = useMutation({
    mutationFn: ({ startDate, endDate, groupBy, username }) => axios.post(apiGatewayUrl + "/getCostData", {
      startDate,
      endDate,
      username,
      groupBy
    }),
    onSuccess: (res) => {
      console.log(res)
      setNextMonthCost(res.data.nextMonthUsage)
      setCurrentMonthCost(res.data.currentMonthData)
      setLastMonthCost(res.data.lastMonthData)
      setCostData(res.data.usageData)
      const grpBy = res.data.usageData.GroupDefinitions[0].Key
      console.log(grpBy)
      setGroupByValue(grpBy);
    },
    onError: (res) => {
      console.log(res);
    },
    onSettled: (res) => {
      setIsApplyingFilter(false)
    }
  })

  console.log(costData)

  const getTotalCost = useCallback(() => {
    if (!costData?.ResultsByTime) return 0;

    const cost = costData.ResultsByTime.reduce((acc, period) => {
      period.Groups.forEach(group => {
        console.log(group.Metrics.UnblendedCost)
        const amount = parseFloat(group.Metrics.UnblendedCost.Amount);
        if (amount >= 0) {
          acc += amount;
        }
      });
      return acc;
    }, 0);

    setTotalCost(cost)

  }, [costData])


  const getChartTotalUsageData = useCallback(() => {
    if (!costData?.ResultsByTime) return [];

    const totalUsageData = costData.ResultsByTime.map(period => {
      const totalUsage = period.Groups.reduce((sum, group) => {
        const amount = parseFloat(group.Metrics.UnblendedCost.Amount);
        return sum + (amount > 0 ? amount : 0);
      }, 0);
      return {
        date: period.TimePeriod.Start,
        totalUsage,
      };
    });
    setChartTotalUsageData(totalUsageData)
  }, [costData])


  const getChartDataByService = useCallback(() => {
    if (!costData?.ResultsByTime) return [];

    const labels = costData.ResultsByTime.map(period => period.TimePeriod.Start);
    console.log(labels)

    const serviceData = {};
    costData.ResultsByTime.forEach(period => {
      period.Groups.forEach(group => {
        const service = group.Keys[0];
        const amount = parseFloat(group.Metrics.UnblendedCost.Amount);
        if (amount > 0) {
          if (!serviceData[service]) {
            serviceData[service] = {};
          }
          serviceData[service][period.TimePeriod.Start] = amount;
        }

      });
    });

    const chartData = labels.map(date => {
      const entry = { date };
      for (const service in serviceData) {
        entry[service] = serviceData[service][date] || 0;
      }
      return entry;
    });

    console.log(chartData)
    setChartDataByService(chartData)
  }, [costData])


  const getCostByService = useCallback(() => {
    if (!costData?.ResultsByTime) return [];

    const costsByService = {};

    costData.ResultsByTime.forEach(period => {
      period.Groups.forEach(group => {
        console.log(group)
        const service = group.Keys[0];
        const amount = parseFloat(group.Metrics.UnblendedCost.Amount);

        if (amount > 0) {
          if (costsByService[service]) {
            costsByService[service] += amount;
          } else {
            costsByService[service] = amount;
          }
        }
      });
    });

    console.log(costsByService)

    const costsArray = Object.entries(costsByService).map(([service, cost]) => ({ service, cost }));
    setCostByService(costsArray)
  }, [costData])

  const isDateDisabled = (date) => {
    const today = new Date();
    const startOfYear1900 = new Date('1900-01-01');
    return date > today || date < startOfYear1900 || date.toDateString() === today.toDateString();
  };


  useEffect(() => {
    getTotalCost()
    getChartDataByService()
    getChartTotalUsageData()
    getCostByService();
  }, [costData])


  useEffect(() => {
    console.log("Hello")
    getCostDataMutation.mutate({ startDate, endDate, groupBy, username })
  }, [])

  console.log({ costByService })
  console.log(costByService.length)

  if (!username) {
    navigate('/connect')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-4 p-4 bg-background rounded-lg shadow-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      {startDate ? startDate : "Select start date"}
                      <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      disabled={isDateDisabled}
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      {endDate ? endDate : "Select end date"}
                      <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      disabled={isDateDisabled}
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="group-by">Group By</Label>
                <Select value={groupBy} onValueChange={handleGroupByChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="REGION">Region</SelectItem>
                    <SelectItem value="LINKED_ACCOUNT">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button className="w-1/4" disabled={isApplyingFilter} onClick={applyFilter}>{isApplyingFilter ? "Applying..." : "Apply Filter"}</Button>
            </div>
          </div>
          <div>
            {!costData
              ? <div className='flex justify-center text-2xl mt-3 font-bold'>Loading....</div>
              : <div>
                <div className='text-2xl font-bold ml-2 mb-4'>Cost Summary</div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$ {totalCost.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <div className='flex my-4  justify-between gap-2'>
                  <Card className="flex-auto">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Last Month Cost</CardTitle>
                      <DollarSignIcon className="h-4 w-4  text-muted-foreground " />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$ {Number(lastMonthCost).toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card className="flex-auto">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Current Month Cost</CardTitle>
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$ {Number(currentMonthCost).toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground flex justify-start items-center gap-1">
                        {currentMonthPercentageChange >= 0 ? (
                          <span className="text-green-500 flex items-center">
                            <ArrowUp className="mr-1" /> +{currentMonthPercentageChange.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <ArrowDown className="mr-1" /> {currentMonthPercentageChange.toFixed(2)}%
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          compared to last month
                        </p>
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="flex-auto  ">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Next Month Forecast Cost</CardTitle>
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent >
                      <div className="text-2xl font-bold">$ {Number(nextMonthCost).toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground flex justify-start items-center gap-1">
                        {nextMonthPercentageChange >= 0 ? (
                          <span className="text-green-500 flex items-center">
                            <ArrowUp className="mr-1" /> +{nextMonthPercentageChange.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <ArrowDown className="mr-1" /> {nextMonthPercentageChange.toFixed(2)}%
                          </span>
                        )}
                        <p className='text-xs text-muted-foreground'>
                          compared to current cost
                        </p>
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="mb-3">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost Over Time</CardTitle>
                    <ChartBar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {chartTotalUsageData?.length > 0 && (
                      <ChartJsBarChart className="aspect-[9/4]" chartData={chartTotalUsageData} />
                    )}
                  </CardContent>
                </Card>
                {groupByValue === "SERVICE" && (
                  <div className='text-2xl font-bold ml-2 mb-4'>Cost By Services</div>
                )}
                {groupByValue === "REGION" && (
                  <div className='text-2xl font-bold ml-2 mb-4'>Cost By Regions</div>
                )}
                {groupByValue === "LINKED_ACCOUNT" && (
                  <div className='text-2xl font-bold ml-2 mb-4'>Cost By Linked Accounts</div>
                )}
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {costByService?.length > 0 ? (
                      <CostCard serviceCosts={costByService} />
                    ) : (
                      <div>No {groupByValue}</div>
                    )}
                  </div>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        {groupByValue === "SERVICE" && (
                          <CardTitle className="text-sm font-medium">Service Cost Over Time</CardTitle>
                        )}
                        {groupByValue === "REGION" && (
                          <CardTitle className="text-sm font-medium">Region Cost Over Time</CardTitle>
                        )}
                        {groupByValue === "LINKED_ACCOUNT" && (
                          <CardTitle className="text-sm font-medium">Linked Account Cost Over Time</CardTitle>
                        )}
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        {chartDataByService?.length > 0 && (
                          <ChartJsLineChart className="aspect-[9/4]" chartData={chartDataByService} groupByValue={groupByValue} />
                        )
                        }
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            }
          </div>

        </main>
      </div>
    </div>
  );
};

export default Home