import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Hourglass } from "lucide-react";
const AllPapers = () => {
    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">All Papers</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-lg mb-4">
                        Here you will be able to see all of the papers you are working with across projects.
                    </p>
                    <div className="flex items-center justify-center text-gray-600">
                        <Hourglass className="w-5 h-5 mr-2" />
                        <span>We're working to bring this to you</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AllPapers;