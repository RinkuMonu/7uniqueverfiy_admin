import React, { useState } from 'react'
import "@/styles/dashboard.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Bar } from "recharts"
import { Button } from "@/components/ui/button"
import { Download, Calendar, Upload, ChevronDown, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useSelector } from 'react-redux'




const weeklyData = [
    { day: "Mon", thisWeek: 1850, lastWeek: 1650 },
    { day: "Tue", thisWeek: 2400, lastWeek: 2100 },
    { day: "Wed", thisWeek: 1950, lastWeek: 2200 },
    { day: "Thu", thisWeek: 2800, lastWeek: 2450 },
    { day: "Fri", thisWeek: 1650, lastWeek: 1800 },
    { day: "Sat", thisWeek: 2200, lastWeek: 1950 },
    { day: "Sun", thisWeek: 1792, lastWeek: 1176 },
]

const thisWeekTotal = weeklyData.reduce((sum, day) => sum + day.thisWeek, 0)
const lastWeekTotal = weeklyData.reduce((sum, day) => sum + day.lastWeek, 0)
const weekOverWeekChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100

const data = [
    { month: "Jan", delivered: 45, pending: 32, cancelled: 18 },
    { month: "Feb", delivered: 52, pending: 28, cancelled: 15 },
    { month: "Mar", delivered: 48, pending: 35, cancelled: 22 },
    { month: "Apr", delivered: 61, pending: 30, cancelled: 19 },
    { month: "May", delivered: 55, pending: 33, cancelled: 16 },
    { month: "Jun", delivered: 67, pending: 29, cancelled: 25 },
    { month: "Jul", delivered: 59, pending: 31, cancelled: 42 },
    { month: "Aug", delivered: 73, pending: 27, cancelled: 20 },
    { month: "Sep", delivered: 68, pending: 34, cancelled: 28 },
    { month: "Oct", delivered: 82, pending: 36, cancelled: 24 },
    { month: "Nov", delivered: 76, pending: 32, cancelled: 18 },
    { month: "Dec", delivered: 95, pending: 38, cancelled: 22 },
]

const timePeriods = ["Day", "Week", "Month", "Year"]

function Dashboard() {
    const [sortBy, setSortBy] = useState("Date")
    const [selectedPeriod, setSelectedPeriod] = useState("Day")
    const {admin}=useSelector(state=>state?.admin)
    console.log("dfgfdsdfgfdf",admin);
    
    return (
        <>
            <div className='bg-gray-50 p-2 md:p-6'>
                <div className="lg:flex items-center justify-between ">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back, {admin?.name}</h1>
                        <p className="text-gray-500 mt-1">{"Let's dive in and get things done."}</p>
                    </div>

                    <div className="md:flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600 py-2 md:py-0">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">May, 01 2024 to May, 30 2024</span>
                        </div>

                      
                    </div>
                </div>
                <div className="row grid grid-cols-12 py-4 gap-3">
                    <div className='col-span-12 lg:col-span-3'>
                        <div className="bg-white shadow-sm border rounded-lg p-4 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total wallet</p>
                                    <h2 className="text-2xl font-semibold text-gray-900">{admin?.wallet?.mode?.production}</h2>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">
                                        Total wallet

                                    </a>
                                </div>
                                <div className="bg-indigo-100 brandorange-bg-light p-3 rounded-full">
                                    <span className="avatar avatar-md  brandorange-text avatar-rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-green-500 mt-2">↑ 0.29%</p>
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-3 '>
                        <div className="bg-white shadow-sm border rounded-lg p-4 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Transaction</p>
                                   <h2 className="text-2xl font-semibold text-gray-900">
  {admin?.serviceUsage?.length || 0}
</h2>

                                    <a href="#" className="text-sm text-indigo-600 hover:underline">
                                        View all Transaction
                                    </a>
                                </div>
                                <div className="bg-indigo-100 brandorange-bg-light p-3 rounded-full">
                                    <span className="avatar avatar-md  brandorange-text avatar-rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-green-500 mt-2">↑ 0.29%</p>
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-3 '>
                        <div className="bg-white shadow-sm border rounded-lg p-4 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">My API</p>
                                    <h2 className="text-2xl font-semibold text-gray-900">
  {admin?.services?.length || 0}
</h2>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">
                                        View all API
                                    </a>
                                </div>
                                <div className="bg-indigo-100 brandorange-bg-light p-3 rounded-full">
                                    <span className="avatar avatar-md  brandorange-text avatar-rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-green-500 mt-2">↑ 0.29%</p>
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-3 '>
                        <div className="bg-white shadow-sm border rounded-lg p-4 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Sales</p>
                                    <h2 className="text-2xl font-semibold text-gray-900">32,981</h2>
                                    <a href="#" className="text-sm text-indigo-600 hover:underline">
                                        View all sales
                                    </a>
                                </div>
                                <div className="bg-indigo-100 brandorange-bg-light p-3 rounded-full">
                                    <span className="avatar avatar-md  brandorange-text avatar-rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-green-500 mt-2">↑ 0.29%</p>
                        </div>
                    </div>

                </div>


                <div className='grid  grid-cols-12 gap-3'>
                    <div className=' col-span-12 lg:col-span-4 '>
                        <div className=" bg-white ">
                            <div className="max-w-4xl mx-auto">
                              <div className='border-b-2 border-gray-100'>
                                 
                                    <div className="flex items-center justify-between p-4">
                                    <h1 className="text-xl font-semibold text-gray-700">Visitors Report</h1>
                                    <Button variant="outline" className="bg-white text-gray-400  border-none">
                                        <span>Sort By</span>
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>
                                
                              </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                                    <Card className="bg-gray-100 border-none">
                                        <CardContent className="p-2 ">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">This Week</p>
                                                <p className="text-3xl font-bold text-gray-900">{thisWeekTotal.toLocaleString()}</p>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-green-500 font-medium">0.64%</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gray-100 border-none">
                                        <CardContent className="p-2">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">Last Week</p>
                                                <p className="text-3xl font-bold text-gray-900">{lastWeekTotal.toLocaleString()}</p>
                                                <div className="flex items-center gap-1">
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                    <span className="text-sm text-red-500 font-medium">5.31%</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="bg-white border-none">
                                    <CardContent className="px-6">
                                        <div className="h-60 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart
                                                    data={weeklyData}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 20,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                                    <Bar dataKey="thisWeek" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="lastWeek"
                                                        stroke="#ef4444"
                                                        strokeWidth={2}
                                                        strokeDasharray="5 5"
                                                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 ">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                                <span className="text-sm text-gray-600">This Week</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="text-sm text-gray-600">Last Week</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div className=' col-span-12 lg:col-span-8'>
                        <div className=" bg-white">
                           <div className='border-b-2 border-gray-100 '>
                             <div className="lg:flex items-center justify-between p-2 md:p-4">
                                <h1 className="text-2xl font-semibold text-gray-900 ">Order Statistics</h1>
                                <div className="md:flex items-center gap-4">

                                    <Button variant="outline" className="bg-grey200  text-gray-700 border-gray-300 mt-2 md:mt-0">
                                        <span>Export</span>
                                        <Download className="w-4 h-1 ml-2" />
                                    </Button>
                                </div>
                            </div>
                           </div>

                            <div className="p-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-sm text-gray-600">Delivered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span className="text-sm text-gray-600">Pending</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-600">Cancelled</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                        <Line
                                            type="monotone"
                                            dataKey="delivered"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={false}
                                            fill="#3b82f6"
                                            fillOpacity={0.1}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="pending"
                                            stroke="#eab308"
                                            strokeWidth={2}
                                            dot={false}
                                            fill="#eab308"
                                            fillOpacity={0.1}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="cancelled"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={false}
                                            fill="#ef4444"
                                            fillOpacity={0.1}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>



                </div>
            </div>
        </>
    )
}

export default Dashboard