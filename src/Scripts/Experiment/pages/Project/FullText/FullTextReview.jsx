import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useToast } from "@/hooks/use-toast";
import { getProjectDetails, getNextPaperForFullTextReview, getExclusionCriteria } from '@/api/projectsApi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PDFUploader from './PDFUploader';


const FullTextReview = () => {
    const { projectId } = useParams();

    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [projectDetails, setProjectDetails] = useState(null);
    const [currentPaper, setCurrentPaper] = useState(null);
    const [exclusionCriteria, setExclusionCriteria] = useState([]);
    const [selectedCriterion, setSelectedCriterion] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load all required data in parallel
            const [projectData, paperData, criteriaData] = await Promise.all([
                getProjectDetails(projectId),
                getNextPaperForFullTextReview(projectId),
                getExclusionCriteria(projectId)
            ]);

            setProjectDetails(projectData);
            setCurrentPaper(paperData);
            setExclusionCriteria(criteriaData);

            if (!paperData) {
                toast({
                    title: "Review Complete",
                    description: "No more papers to review in the full-text stage.",
                });
                navigate(`/projects/${projectId}`);
            }
        } catch (err) {
            setError(err.message);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load review data. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (decision) => {
        if (decision === 'exclude' && !selectedCriterion) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select an exclusion reason before excluding the paper.",
            });
            return;
        }

        setSubmitting(true);
        try {
            await submitFullTextReview({
                projectId,
                paperId: currentPaper.paper_id,
                decision,
                exclusionCriterionId: selectedCriterion,
                notes,
                stage: 'full_text'
            });

            // Reset form state
            setSelectedCriterion(null);
            setNotes('');

            // Load next paper
            const nextPaper = await getNextPaperForFullTextReview(projectId);

            if (nextPaper) {
                setCurrentPaper(nextPaper);
                toast({
                    title: "Review Submitted",
                    description: "Moving to next paper.",
                });
            } else {
                toast({
                    title: "Review Complete",
                    description: "No more papers to review in the full-text stage.",
                });
                navigate(`/projects/${projectId}`);
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit review. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={() => navigate(`/projects/${projectId}`)}>
                    Back to Project
                </Button>
            </div>
        );
    }

    return (
        <div className="h-screen max-h-screen overflow-hidden">
            <Button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="mb-4"
            >
                <ArrowLeftOutlined className="mr-2" /> Back to Project
            </Button>

            <ResizablePanelGroup direction="horizontal">
                {/* PDF Viewer Panel */}
                <ResizablePanel defaultSize={60}>
                    <ScrollArea className="h-screen">
                        <div className="p-4 h-full">
                            {currentPaper?.has_pdf ? (
                                <iframe
                                    src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(currentPaper.full_text_url)}`}
                                    className="w-full h-full min-h-screen border-0"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <PDFUploader
                                    projectId={projectId}
                                    paperId={currentPaper?.paper_id}
                                    onUploadComplete={() => {
                                        // Reload the current paper data to get the new PDF URL
                                        loadData();
                                        toast({
                                            title: "Upload Complete",
                                            description: "PDF has been uploaded successfully.",
                                        });
                                    }}
                                />
                            )}
                        </div>
                    </ScrollArea>
                </ResizablePanel>

                <ResizableHandle />

                {/* Review Panel */}
                <ResizablePanel defaultSize={40}>
                    <ScrollArea className="h-screen">
                        <div className="p-6 space-y-6">
                            {/* Paper Details Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{currentPaper?.title}</CardTitle>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
                                        <div className="flex items-center gap-1">
                                            <UserOutlined className="h-4 w-4" />
                                            <span>{currentPaper?.authors}</span>
                                        </div>
                                        <div className="h-3 w-px bg-gray-300 mx-2" />
                                        <div className="flex items-center gap-1">
                                            <CalendarOutlined className="h-4 w-4" />
                                            <span>{currentPaper?.publication_date}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Research Question Reference */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Research Question</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700">{projectDetails?.researchQuestion}</p>
                                </CardContent>
                            </Card>

                            {/* Exclusion Criteria */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Exclusion Criteria</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={selectedCriterion}
                                        onValueChange={setSelectedCriterion}
                                        className="space-y-3"
                                    >
                                        {exclusionCriteria.map((criterion) => (
                                            <div key={criterion.criteria_id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={criterion.criteria_id} id={criterion.criteria_id} />
                                                <Label htmlFor={criterion.criteria_id}>{criterion.criterion_text}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any additional notes..."
                                        className="min-h-[100px]"
                                    />
                                </CardContent>
                            </Card>

                            {/* Decision Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleSubmit('exclude')}
                                    disabled={submitting}
                                >
                                    Exclude
                                </Button>
                                <Button
                                    variant="default"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleSubmit('include')}
                                    disabled={submitting}
                                >
                                    Include
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default FullTextReview;







/*
BIG Todos:

- fix the helper functions and make them real
- give the full-text review its own url address instead of kidnapping the url of abstract reviews
- automate the population of the bucket with the papers that we have the full-text for. This should happen automatically when a positive decision is made on the paper in the abstract screening stage.

*/