import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText, User, Clock } from 'lucide-react';
import { fetchProjectImports, downloadImportFile } from '@/api/importsApi';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ImportCard = ({ importRecord }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadImportFile(importRecord.file_bucket, importRecord.file_path);
        } catch (error) {
            console.error('Download failed:', error);
        }
        setDownloading(false);
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid gap-4">
                    {/* Header with date and user info */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(importRecord.created_at), 'MMM d, yyyy HH:mm:ss')} UTC
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                {importRecord.user.avatar_url ? (
                                    <img src={importRecord.user.avatar_url} alt="user" />
                                ) : (
                                    <AvatarFallback>
                                        {getInitials(importRecord.user.first_name, importRecord.user.last_name)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <span className="text-sm">
                                {importRecord.user.first_name} {importRecord.user.last_name}
                            </span>
                        </div>
                    </div>

                    {/* File info */}
                    <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        {importRecord.file_path.split('/').pop()}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Papers</p>
                            <p className="text-2xl font-semibold">{importRecord.paper_total}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">New Papers</p>
                            <p className="text-2xl font-semibold text-green-600">{importRecord.paper_new}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Duplicates</p>
                            <p className="text-2xl font-semibold text-yellow-600">{importRecord.deduplication_total}</p>
                        </div>
                    </div>

                    {/* Duplicate breakdown */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                            <span>File-level duplicates: </span>
                            <span className="font-medium">{importRecord.deduplication_file}</span>
                        </div>
                        <div>
                            <span>Project-level duplicates: </span>
                            <span className="font-medium">{importRecord.deduplication_project}</span>
                        </div>
                    </div>

                    {/* Download button */}
                    <div className="flex justify-end">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            {downloading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            Download File
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ImportHistory = ({ projectId }) => {
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImports = async () => {
            setLoading(true);
            const { data, error } = await fetchProjectImports(projectId);
            
            if (error) {
                setError(error);
            } else {
                setImports(data);
            }
            
            setLoading(false);
        };

        loadImports();
    }, [projectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="my-4">
                <AlertDescription>
                    Error loading import history: {error}
                </AlertDescription>
            </Alert>
        );
    }

    if (!imports.length) {
        return (
            <div className="text-center p-8 text-gray-500">
                No import history available for this project.
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {imports.map((importRecord) => (
                <ImportCard 
                    key={importRecord.id} 
                    importRecord={importRecord}
                />
            ))}
        </div>
    );
};

export default ImportHistory;