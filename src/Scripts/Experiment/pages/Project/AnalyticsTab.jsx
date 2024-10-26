// import React from 'react';
// import { Download, BarChart3, Users, Clock, ArrowUpDown } from 'lucide-react';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const AnalyticsTab = ({ projectId }) => {
//     const handleExport = () => {
//         // TODO: Implement export functionality
//         console.log('Exporting reviews for project:', projectId);
//     };

//     // Mock data for statistics
//     const stats = [
//         {
//             title: "Total Papers",
//             value: "247",
//             description: "Papers in review pool",
//             icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />
//         },
//         {
//             title: "Active Reviewers",
//             value: "8",
//             description: "Currently participating",
//             icon: <Users className="h-4 w-4 text-muted-foreground" />
//         },
//         {
//             title: "Average Review Time",
//             value: "2.4 min",
//             description: "Per paper",
//             icon: <Clock className="h-4 w-4 text-muted-foreground" />
//         },
//         {
//             title: "Pending Conflicts",
//             value: "12",
//             description: "Needs resolution",
//             icon: <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
//         }
//     ];

//     return (
//         <div className="space-y-6">
//             {/* Export Section */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Export Data</CardTitle>
//                     <CardDescription>Download project reviews and analytics</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Button
//                         onClick={handleExport}
//                         className="gap-2"
//                     >
//                         <Download className="h-4 w-4" />
//                         Export Reviews
//                     </Button>
//                 </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 {stats.map((stat, index) => (
//                     <Card key={index}>
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium">
//                                 {stat.title}
//                             </CardTitle>
//                             {stat.icon}
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-2xl font-bold">{stat.value}</div>
//                             <p className="text-xs text-muted-foreground">
//                                 {stat.description}
//                             </p>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>

//             {/* Progress Overview */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Review Progress</CardTitle>
//                     <CardDescription>Overall project completion status</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="space-y-4">
//                         {/* Progress bars */}
//                         <div>
//                             <div className="flex items-center justify-between text-sm mb-2">
//                                 <span>Papers Reviewed</span>
//                                 <span className="text-muted-foreground">65%</span>
//                             </div>
//                             <div className="h-2 bg-secondary rounded-full">
//                                 <div
//                                     className="h-full bg-primary rounded-full"
//                                     style={{ width: '65%' }}
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <div className="flex items-center justify-between text-sm mb-2">
//                                 <span>Conflicts Resolved</span>
//                                 <span className="text-muted-foreground">40%</span>
//                             </div>
//                             <div className="h-2 bg-secondary rounded-full">
//                                 <div
//                                     className="h-full bg-primary rounded-full"
//                                     style={{ width: '40%' }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default AnalyticsTab;



import React, { useState, useEffect } from 'react';
import { Download, BarChart3, Users, Clock, AlertTriangle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProjectAnalytics, exportProjectData } from '@/api/analyticsApi';

const AnalyticsTab = ({ projectId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analytics, setAnalytics] = useState({
        totalPapers: 0,
        activeReviewers: 0,
        avgReviewTime: 0,
        pendingConflicts: 0,
        reviewProgress: 0,
        conflictResolution: 0,
        reviewedPapers: 0,
        totalConflicts: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, [projectId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getProjectAnalytics(projectId);
            setAnalytics(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const data = await exportProjectData(projectId);

            // Convert data to CSV or desired format
            const csvContent = "data:text/csv;charset=utf-8," +
                // Add your CSV formatting logic here
                data.map(row => Object.values(row).join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `project-${projectId}-export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error exporting data:', err);
            // Handle error (show notification, etc.)
        }
    };

    if (loading) {
        return <div>Loading analytics...</div>; // Consider using a proper loading spinner
    }

    if (error) {
        return <div>Error: {error}</div>; // Consider using a proper error component
    }

    return (
        <div className="space-y-6">
            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download project reviews and analytics</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleExport}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export Reviews
                    </Button>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalPapers}</div>
                        <p className="text-xs text-muted-foreground">Papers in review pool</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.activeReviewers}</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Papers Reviewed</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.reviewedPapers}</div>
                        <p className="text-xs text-muted-foreground">Total reviews completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Conflicts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.pendingConflicts}</div>
                        <p className="text-xs text-muted-foreground">Needs resolution</p>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Review Progress</CardTitle>
                    <CardDescription>Overall project completion status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span>Papers Reviewed</span>
                                <span className="text-muted-foreground">{analytics.reviewProgress}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${analytics.reviewProgress}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span>Conflicts Resolved</span>
                                <span className="text-muted-foreground">{analytics.conflictResolution}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${analytics.conflictResolution}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsTab;