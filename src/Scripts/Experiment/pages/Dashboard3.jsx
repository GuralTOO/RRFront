import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Dashboard3 = () => {
    const [dateWindow, setDateWindow] = useState('6m');
    const [projectOffset, setProjectOffset] = useState(0);
    const [hoveredBar, setHoveredBar] = useState(null);

    // Mock data for projects and papers
    const allProjectsData = [
        { name: 'Project A', accepted: 8, undecided: 5, rejected: 2 },
        { name: 'Project B', accepted: 12, undecided: 8, rejected: 3 },
        { name: 'Project C', accepted: 5, undecided: 2, rejected: 1 },
        { name: 'Project D', accepted: 20, undecided: 7, rejected: 4 },
        { name: 'Project E', accepted: 10, undecided: 6, rejected: 3 },
        { name: 'Project F', accepted: 15, undecided: 9, rejected: 3 },
        // Add more projects as needed
    ];

    const projectsData = allProjectsData.slice(projectOffset, projectOffset + 4);

    const collaborationData = [
        { name: 'Solo', value: 30 },
        { name: 'Small Team', value: 45 },
        { name: 'Large Team', value: 25 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const totalProjects = allProjectsData.length;
    const totalPapers = allProjectsData.reduce((sum, project) =>
        sum + project.accepted + project.undecided + project.rejected, 0);
    const avgPapersPerProject = (totalPapers / totalProjects).toFixed(2);

    // Mock data for paper reviews
    const reviewsData = {
        '1m': [
            { month: 'Week 1', reviews: 2 },
            { month: 'Week 2', reviews: 3 },
            { month: 'Week 3', reviews: 1 },
            { month: 'Week 4', reviews: 4 },
        ],
        '6m': [
            { month: 'Jan', reviews: 5 },
            { month: 'Feb', reviews: 8 },
            { month: 'Mar', reviews: 12 },
            { month: 'Apr', reviews: 10 },
            { month: 'May', reviews: 15 },
            { month: 'Jun', reviews: 20 },
        ],
        '1y': [
            { month: 'Jan', reviews: 5 },
            { month: 'Feb', reviews: 8 },
            { month: 'Mar', reviews: 12 },
            { month: 'Apr', reviews: 10 },
            { month: 'May', reviews: 15 },
            { month: 'Jun', reviews: 20 },
            { month: 'Jul', reviews: 18 },
            { month: 'Aug', reviews: 22 },
            { month: 'Sep', reviews: 25 },
            { month: 'Oct', reviews: 30 },
            { month: 'Nov', reviews: 28 },
            { month: 'Dec', reviews: 35 },
        ],
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum, entry) => sum + entry.value, 0);
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-bold">{label}</p>
                    <p>Total: {total}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 bg-white min-h-screen text-gray-800">
            <motion.h1
                className="text-3xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Research Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Total Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{totalProjects}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Total Papers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{totalPapers}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Avg Papers/Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{avgPapersPerProject}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold">Papers per Project</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setProjectOffset(Math.max(0, projectOffset - 1))}
                                    disabled={projectOffset === 0}
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setProjectOffset(Math.min(allProjectsData.length - 4, projectOffset + 1))}
                                    disabled={projectOffset >= allProjectsData.length - 4}
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectsData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="rejected" stackId="a" fill="#FF8042" /> {/* Vibrant Orange */}
                                    <Bar dataKey="undecided" stackId="a" fill="#FFBB28" /> {/* Bright Blue */}
                                    <Bar dataKey="accepted" stackId="a" fill="#00C49F" /> {/* Vibrant Green */}                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Collaboration Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={collaborationData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {collaborationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="md:col-span-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold">Paper Reviews Trend</CardTitle>
                            <Select value={dateWindow} onValueChange={setDateWindow}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1m">Last Month</SelectItem>
                                    <SelectItem value="6m">Last 6 Months</SelectItem>
                                    <SelectItem value="1y">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reviewsData[dateWindow]}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    {/* <Line type="monotone" dataKey="reviews" stroke="#10B981" strokeWidth={2} /> */}
                                    <Line type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard3;