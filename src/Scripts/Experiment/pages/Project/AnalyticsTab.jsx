import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, AlertTriangle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getProjectAnalytics } from '@/api/analyticsApi';

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

    if (loading) {
        return <div>Loading analytics...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
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