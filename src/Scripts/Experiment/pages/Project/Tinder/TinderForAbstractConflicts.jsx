import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';
import { getProjectDetails } from '@/api/projectsApi';
import { getConflictPaper, getReviews, resolveConflict } from '@/api/reviewsAPI';

const formatUTCDate = (utcDateString) => {
    if (!utcDateString) return 'Date not available';

    const date = new Date(utcDateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const TinderForAbstractConflicts = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPaper, setCurrentPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [reviewers, setReviewers] = useState([]);

    const getReviewerDetails = async (projectId, paperId) => {
        try {
            const reviewsData = await getReviews(projectId, paperId);
            return reviewsData.map(review => ({
                reviewer_id: review.reviewer_id,
                review_date: formatUTCDate(review.review_date),
                decision: review.decision
            }));
        } catch (error) {
            console.error('Error getting reviewer details:', error);
            return [];
        }
    };

    const fetchPaper = async () => {
        try {
            const paperData = await getConflictPaper();
            if (paperData) {
                setCurrentPaper(paperData);
                const reviewerData = await getReviewerDetails(projectId, paperData.paper_id);
                setReviewers(reviewerData);
            } else {
                setCurrentPaper(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addConflictResolution = async (conflict_id, decision) => {
        resolveConflict(conflict_id, decision);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [projectData, paperData] = await Promise.all([
                    getProjectDetails(projectId),
                    getConflictPaper()
                ]);

                setProjectDetails(projectData);
                setCurrentPaper(paperData);

                if (paperData) {
                    const reviewerData = await getReviewerDetails(projectId, paperData.paper_id);
                    setReviewers(reviewerData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const handleDecision = async (decision) => {
        if (!currentPaper) return;

        setLoading(true);
        try {
            await addConflictResolution(currentPaper.conflict_id, decision);
            await fetchPaper();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderReviewerInfo = (reviewers) => {
        return (
            <div className="mt-4 space-y-3 border-t pt-4">
                <h6 className="font-semibold">Previous Reviews:</h6>
                <div className="grid grid-cols-1 gap-3">
                    {reviewers && reviewers.length > 0 ? (
                        reviewers.map((reviewer, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">ID: {reviewer.reviewer_id}</p>
                                    <p className="text-sm text-gray-600">
                                        Reviewed: {reviewer.review_date}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No previous reviews found</p>
                    )}
                </div>
            </div>
        );
    };

    const reviewActions = [
        {
            label: "Reject",
            icon: <DislikeOutlined />,
            onClick: () => handleDecision('reject'),
            variant: "destructive",
        },
        {
            label: "Accept",
            icon: <LikeOutlined />,
            onClick: () => handleDecision('approve'), // Changed from 'accept' to 'approve'
            variant: "success",
        }
    ];

    if (loading) {
        return <PaperReviewLayout loading={true} />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-4">
                <div className="text-red-600">{error}</div>
                <Button
                    onClick={() => navigate(`/projects/${projectId}`)}
                >
                    <ArrowLeftOutlined className="mr-2" /> Back to Project
                </Button>
            </div>
        );
    }

    if (!currentPaper) {
        return (
            <PaperReviewLayout>
                <div className="text-center space-y-4">
                    <p className="text-lg">No papers with conflicts to review!</p>
                    <Button
                        onClick={() => navigate(`/projects/${projectId}`)}
                    >
                        <ArrowLeftOutlined className="mr-2" /> Back to Project
                    </Button>
                </div>
            </PaperReviewLayout>
        );
    }

    return (
        <PaperReviewLayout>
            <div className="mb-4 flex justify-between items-center">
                <Button
                    onClick={() => navigate(`/projects/${projectId}`)}
                >
                    <ArrowLeftOutlined className="mr-2" /> Back to Project
                </Button>
            </div>

            <PaperReviewCard
                paper={currentPaper}
                projectDetails={projectDetails}
                actions={reviewActions}
                loading={loading}
                additionalContent={renderReviewerInfo(reviewers)}
            />
        </PaperReviewLayout>
    );
};

export default TinderForAbstractConflicts;