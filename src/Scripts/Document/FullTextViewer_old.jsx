import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { getPaperFullTextDetails } from '../../api/projectsApi';
import { debounce } from 'lodash';
import EnhancedNotes from './EnhancedNotes';
import PDFUploader from '../Experiment/pages/Project/FullText/PDFUploader'
import {getPaperNotes, savePaperNotes} from '../../api/papersApi';
import PageHeader from '../Project/components/PageHeader';

const FullTextViewer_old = () => {
    const navigate = useNavigate();
    const { projectId, paperId } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paperDetails, setPaperDetails] = useState(null);
    const [notes, setNotes] = useState('');


    // Create debounced save function
    const debouncedSave = useCallback(
        debounce(async (newNotes) => {
            try {
                await savePaperNotes(projectId, paperId, newNotes);
                toast({
                    title: "Saved",
                    description: "Notes updated",
                    duration: 1000
                });
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to save notes.",
                });
            }
        }, 1000),
        [projectId, paperId]
    );

    useEffect(() => {
        const loadPaperDetails = async () => {
            setLoading(true);
            try {
                const details = await getPaperFullTextDetails(projectId, paperId);
                console.log("Full text URL:", details.full_text_url); // Add this log
                setPaperDetails(details);

                const noteData = await getPaperNotes(projectId, paperId);
                setNotes(noteData?.content || '');

            } catch (err) {
                setError(err.message);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load paper details.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadPaperDetails();
    }, [projectId, paperId]);


    return (
        <div className="h-screen max-h-screen flex flex-col">
            {/* Header */}
            <PageHeader 
                icon={BookOpen}
                title="Paper Reader"
            >
                <Button
                    onClick={() => navigate(`/p/${projectId}/papers`)}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Papers
                </Button>
            </PageHeader>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={60}>
                        <ScrollArea className="h-full">
                            <div className="h-full">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-red-600">{error}</p>
                                    </div>
                                ) : paperDetails?.full_text_url ? (
                                    <iframe
                                        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
                                            paperDetails.full_text_url.replace(/[\r\n\t]/g, '')
                                        )}`}
                                        className="w-full h-full border-0"
                                        title="PDF Viewer"
                                        onError={(e) => {
                                            console.error("PDF iframe load error:", e);
                                        }}
                                    />
                                ) : (
                                    <PDFUploader 
                                        projectId={projectId}
                                        paperId={paperId}
                                        onUploadComplete={async () => {
                                            try {
                                                // Reload the paper details to get the new PDF URL
                                                const details = await getPaperFullTextDetails(projectId, paperId);
                                                setPaperDetails(details);
                                                toast({
                                                    title: "Upload Complete",
                                                    description: "PDF has been uploaded successfully.",
                                                });
                                            } catch (err) {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Error",
                                                    description: "Failed to reload paper details.",
                                                });
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </ScrollArea>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Details Panel */}
                    <ResizablePanel defaultSize={40}>
                        {/* <div className="h-full flex flex-col"> */}
                        <ScrollArea className="h-full">
                            {/* <div className="p-6 flex flex-col h-full"> */}
                            <div className="p-6">
                                {/* Paper Details */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-medium text-gray-900">
                                        {paperDetails?.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
                                        <div className="flex items-center gap-1">
                                            <UserOutlined className="h-4 w-4" />
                                            <span>{paperDetails?.authors}</span>
                                        </div>
                                        <div className="h-3 w-px bg-gray-300 mx-2" />
                                        <div className="flex items-center gap-1">
                                            <CalendarOutlined className="h-4 w-4" />
                                            <span>{paperDetails?.publication_date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Abstract</h3>
                                    <div className="text-sm text-gray-700 bg-gray-50/50 p-4 rounded-sm">
                                        {paperDetails?.abstract}
                                    </div>
                                </div>

                                {/* Separator */}
                                <div className="border-t border-gray-200 mb-8" />

                                {/* Notes - Takes remaining space */}
                                <div className="mb-6">
                                <EnhancedNotes
                                        notes={notes}
                                        onNotesChange={(newNotes) => {
                                            setNotes(newNotes);
                                            debouncedSave(newNotes);
                                        }}
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default FullTextViewer_old;