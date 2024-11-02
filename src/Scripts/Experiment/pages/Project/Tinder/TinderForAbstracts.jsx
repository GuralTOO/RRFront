import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined, ForwardOutlined } from '@ant-design/icons';
import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';
import { getProjectDetails } from '@/api/projectsApi';
import { addReview } from '@/api/reviewsAPI';
import { supabase } from '@/supabaseClient';

const TinderForAbstracts = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [currentPaper, setCurrentPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);

    const fetchNextPaper = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { data, error } = await supabase.rpc('get_next_paper_for_review', {
                p_project_id: projectId,
                p_reviewer_id: user.id
            });

            if (error) throw error;
            setCurrentPaper(data[0] || null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [projectData] = await Promise.all([
                    getProjectDetails(projectId),
                    fetchNextPaper()
                ]);
                setProjectDetails(projectData);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, [projectId]);

    const handleDecision = async (decision) => {
        if (!currentPaper) return;

        setLoading(true);
        try {
            await addReview(projectId, currentPaper.paper_id, decision);
            await fetchNextPaper();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const reviewActions = [
        {
            label: "Reject",
            icon: <DislikeOutlined />,
            onClick: () => handleDecision('reject'),
            variant: "destructive",
        },
        {
            label: "Skip",
            icon: <ForwardOutlined />,
            onClick: () => handleDecision('skip'),
            variant: "secondary",
        },
        {
            label: "Accept",
            icon: <LikeOutlined />,
            onClick: () => handleDecision('accept'),
            variant: "success",
        },
    ];

    if (loading && !currentPaper) {
        return <PaperReviewLayout loading={true} />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-4">
                <div className="text-red-600">{error}</div>
                <Button onClick={() => navigate(`/projects/${projectId}`)}>
                    <ArrowLeftOutlined className="mr-2" /> Back to Project
                </Button>
            </div>
        );
    }

    if (!currentPaper) {
        return (
            <PaperReviewLayout>
                <div className="text-center space-y-4">
                    <p className="text-lg">No more papers to review!</p>
                    <Button onClick={() => navigate(`/projects/${projectId}`)}>
                        <ArrowLeftOutlined className="mr-2" /> Back to Project
                    </Button>
                </div>
            </PaperReviewLayout>
        );
    }

    if (loading || !currentPaper || !projectDetails) {
        return <PaperReviewLayout loading={true} />;
    }

    return (

        <PaperReviewLayout>
            <Button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="mb-4"
            >
                <ArrowLeftOutlined className="mr-2" /> Back to Project
            </Button>

            <PaperReviewCard
                paper={currentPaper}
                projectDetails={projectDetails}
                actions={reviewActions}
                loading={loading}
            />
        </PaperReviewLayout>
    );
};

export default TinderForAbstracts;