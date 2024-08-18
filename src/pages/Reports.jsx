import Navbar from '@/components/Navbar'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label"
import { DollarSignIcon, ServerIcon, ChartBar, CalendarDaysIcon, CircleCheckIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar'
import { format, subMonths } from "date-fns";
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod';

const sendEmailSchema = z.object({
    email: z.string().email("Invalid email format")
})

const Reports = () => {

    const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || "https://3q04lem3jd.execute-api.us-east-1.amazonaws.com/cloudCostBoard"

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(sendEmailSchema)
    });

    const formatDate = (date) => format(date, "yyyy-MM-dd");
    const today = new Date();
    const defaultEndDate = today;
    const defaultStartDate = subMonths(today, 1);
    const username = localStorage.getItem("cloudUsername");
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(formatDate(defaultStartDate))
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [endDate, setEndDate] = useState(formatDate(defaultEndDate))
    const [email, setEmail] = useState("");
    const [groupBy, setGroupBy] = useState('SERVICE');
    const [granularity, setGranularity] = useState("DAILY")
    const [isReportGenerated, setIsReportGenerated] = useState(false);

    const generateReportMutation = useMutation({
        mutationFn: ({ startDate, endDate, username, granularity, groupBy }) => axios.post(apiGatewayUrl+"/generateReport", {
            startDate,
            endDate,
            granularity,
            username,
            groupBy
        }),
        onSuccess: (res) => {
            console.log(res)
            if (res.data.statusCode === 200) {
                setIsReportGenerated(true);
            } else {
                toast.error("Something went wrong! Please try again.")
            }
        },
        onError: (res) => {
            console.log(res)
        },
        onSettled: (res) => {
            console.log("Settled")
            setIsGeneratingReport(false)
        }
    })

    const createTopicMutation = useMutation({
        mutationFn: ({ email, username }) => axios.post(apiGatewayUrl+"/createTopic", {
            email,
            username
        }),
        onSuccess: (res) => {
            console.log(res.data)
            const data = JSON.parse(res.data.body)
            console.log(data)
            if (data.message === "Email sent successfully") {
                toast.success("Report sent successfully.")
            } else if (data.message === "Confirmation email sent successfully.") {
                alert("Oops! First confirm the subscription sent on your email.")
            }
        },
        onError: (res) => {
            console.log(res)
        },
        onSettled: (res) => {
            setIsSendingEmail(false);
        }
    })

    console.log({ email })


    const handleStartDateChange = (date) => {
        setStartDate(formatDate(date))
    }
    const handleEndDateChange = (date) => {
        setEndDate(formatDate(date))
    }
    const handleGranularityChange = (value) => {
        setGranularity(value)
    }

    const handleGroupByChange = (value) => {
        setGroupBy(value);
    };

    const generateReport = () => {
        console.log(startDate)
        setIsGeneratingReport(true)
        generateReportMutation.mutate({ startDate, endDate, granularity, username, groupBy })
    }

    const onSubmit = ({ email }) => {
        setIsSendingEmail(true)
        createTopicMutation.mutate({ email, username })
    }

    const isDateDisabled = (date) => {
        const today = new Date();
        const startOfYear1900 = new Date('1900-01-01');
        return date > today || date < startOfYear1900 || date.toDateString() === today.toDateString();
    };

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
                        <div className='flex items-center gap-4'>
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
                            <div className="flex-1">
                                <Label htmlFor="granularity">Granularity</Label>
                                <Select value={granularity} onValueChange={handleGranularityChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select granularity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DAILY">Daily</SelectItem>
                                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <Button className="w-1/4" disabled={isGeneratingReport} onClick={generateReport}>{isGeneratingReport ? "Generating...." : "Generate Report"}</Button>
                        </div>
                    </div>
                    {
                        isReportGenerated && (
                            <>
                                <hr className='my-4 border-black' />
                                <div className="flex flex-col items-center justify-center bg-background">
                                    <div className="max-w-md w-full space-y-4 p-6 ">
                                        <div className="space-y-2 text-center">
                                            <CircleCheckIcon className="size-12 text-green-500" />
                                            <h2 className="text-2xl font-bold">Report Generated</h2>
                                            <p className="text-muted-foreground">Your report has been generated successfully.</p>
                                        </div>
                                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Enter your email to receive the report</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="example@email.com"
                                                    {...register('email')}
                                                    className={`mt-1 block w-full rounded-md   ${errors.email ? 'border-red-500' : ''
                                                        }`}
                                                />
                                                {errors.email && (
                                                    <p className=" text-red-500  ">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <Button disabled={isSendingEmail} type="submit" className="w-full">
                                                {isSendingEmail ? "Sending..." : "Send"}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </main>
            </div>
        </div>
    )
}

export default Reports
