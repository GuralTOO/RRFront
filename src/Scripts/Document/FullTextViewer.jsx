import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import PDFViewer from './pdf-viewer/PDFViewer';

const FullTextViewer = () => {
    const navigate = useNavigate();
    const { projectId, paperId } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paperDetails, setPaperDetails] = useState(null);
    const [notes, setNotes] = useState('');

    const formatAuthorName = (authorString) => {
        const [lastName, firstName] = authorString.split(',').map(part => part.trim());
        return `${firstName} ${lastName}`;
    };
    
    const formatAuthors = (authors) => {
        if (!authors) return '';
        if (Array.isArray(authors)) {
            return authors.map(author => formatAuthorName(author)).join(', ');
        }
        
        // If it's a single string containing multiple authors separated by semicolons
        return authors.split(';')
            .map(author => formatAuthorName(author.trim()))
            .join(', ');
    };

    // const [highlights, setHighlights] = useS qtate([]);
    const highlights = [
        {
          pageNumber: 1,
          x1: 100,  // top-left X
          y1: 150,  // top-left Y
          x2: 200,  // bottom-right X
          y2: 170,  // bottom-right Y
          color: "rgba(255, 0, 0, 0.2)" // translucent red
        },
        {
          pageNumber: 1,
          x1: 250,
          y1: 300,
          x2: 400,
          y2: 320,
          color: "rgba(255, 0, 0, 0.2)" // translucent red
        },
        {
            pageNumber: 1,
            x1: 100,  // top-left X
            y1: 350,  // top-left Y
            x2: 200,  // bottom-right X
            y2: 370,  // bottom-right Y
            color: "rgba(255, 0, 0, 0.2)" // translucent red
        },
        {
            pageNumber: 1,
            x1: 250,
            y1: 500,
            x2: 400,
            y2: 920,
            color: "rgba(255, 0, 0, 1)" // translucent red
        },
        {
          pageNumber: 2,
          x1: 50,
          y1: 100,
          x2: 180,
          y2: 120,
          color: "rgba(255, 0, 0, 0.2)" // translucent red
        },
        {
          pageNumber: 2,
          x1: 60,
          y1: 200,
          x2: 220,
          y2: 220, // no color specified, uses default
          color: "rgba(255, 0, 0, 0.2)" // translucent red
        },
        {
          pageNumber: 3,
          x1: 120,
          y1: 180,
          x2: 220,
          y2: 200,
          color: "rgba(128, 0, 128, 0.2)" // translucent purple
        },
        {
          pageNumber: 3,
          x1: 300,
          y1: 400,
          x2: 450,
          y2: 420,
          color: "rgba(128, 0, 128, 0.2)" // translucent purple
        },
        {
          pageNumber: 4,
          x1: 80,
          y1: 150,
          x2: 200,
          y2: 170,
          color: "rgba(128, 0, 128, 0.2)" // translucent purple
        },
        {
          pageNumber: 4,
          x1: 220,
          y1: 250,
          x2: 350,
          y2: 270,
          color: "rgba(128, 0, 128, 0.2)" // translucent purple
        }
      ];

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
                setPaperDetails(details);

                // Transform highlight data if needed
                if (details.highlights) {
                    setHighlights(details.highlights.map(h => ({
                        pageNumber: h.page_number,
                        coordinates: {
                            x1: h.start_x,
                            y1: h.start_y,
                            x2: h.end_x,
                            y2: h.end_y
                        },
                        color: h.color || '#ffeb3b'
                    })));
                }

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


    const handlePageChange = (pageNumber) => {
        console.log(`Page changed to ${pageNumber}`);
    };

    const containerRef = useRef(null);


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
                                    <div ref={containerRef} className="h-full">
                                        <PDFViewer
                                            pdfUrl={paperDetails.full_text_url}
                                            highlightData={highlights}
                                            containerWidth={containerRef.current?.clientWidth}
                                        />
                                    </div>
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
                                        <span>{formatAuthors(paperDetails?.authors)}</span>
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

export default FullTextViewer;