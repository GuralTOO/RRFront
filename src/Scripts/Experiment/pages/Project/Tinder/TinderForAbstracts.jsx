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


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Button, Typography, Space, Progress, Divider, Spin, message } from 'antd';
// import { LikeOutlined, DislikeOutlined, ForwardOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import './TinderForAbstracts.css';
// import { getProjectDetails } from '@/api/projectsApi';
// import { getUnreviewedPapers } from '@/api/papersApi';
// import { addReview } from '@/api/reviewsAPI';
// import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';

// const { Text } = Typography;
// const BATCH_SIZE = 1;


// const TinderForAbstracts = () => {
//     const { projectId } = useParams();
//     const navigate = useNavigate();
//     const [papers, setPapers] = useState([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [projectDetails, setProjectDetails] = useState(null);

//     const fetchPapers = async () => {
//         try {
//             const papersData = await getUnreviewedPapers(projectId, 'created_at', false, 1, BATCH_SIZE);
//             setPapers(papersData.data);
//             setCurrentIndex(0);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const projectData = await getProjectDetails(projectId);
//                 setProjectDetails(projectData);
//                 await fetchPapers();
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [projectId]);

//     const handleDecision = async (decision) => {
//         setLoading(true);
//         try {
//             // TODO: Implement API call to save paper decision
//             // await savePaperDecision(projectId, papers[currentIndex].paper_id, decision);
//             console.log(`Decision for paper ${papers[currentIndex].paper_id}: ${decision}`);
//             await addReview(projectId, papers[currentIndex].paper_id, decision);
//             // Refresh the list of unreviewed papers
//             await fetchPapers();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading && papers.length === 0) {
//         return (
//             <div className="loading-container">
//                 <Spin size="large" />
//                 <Text>Loading project details and papers...</Text>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="error-container">
//                 <Text type="danger">{error}</Text>
//                 <Button
//                     icon={<ArrowLeftOutlined />}
//                     onClick={() => navigate(`/projects/${projectId}`)}
//                 >
//                     Back to Project
//                 </Button>
//             </div>
//         );
//     }

//     const reviewActions = [
//         {
//             label: "Reject",
//             icon: <DislikeOutlined />,
//             onClick: () => handleDecision('reject'),
//             variant: "destructive",  // This will make it red
//         },
//         {
//             label: "Skip",
//             icon: <ForwardOutlined />,
//             onClick: () => handleDecision('skip'),
//             variant: "secondary",    // This will make it gray
//         },
//         {
//             label: "Accept",
//             icon: <LikeOutlined />,
//             onClick: () => handleDecision('accept'),
//             variant: "success",      // This will make it green
//         },
//     ];

//     if (papers.length === 0) {
//         return (
//             <PaperReviewLayout>
//                 <div className="text-center space-y-4">
//                     <p className="text-lg">No more papers to review!</p>
//                     <Button
//                         onClick={() => navigate(`/projects/${projectId}`)}
//                     >
//                         <ArrowLeftOutlined className="mr-2" /> Back to Project
//                     </Button>
//                 </div>
//             </PaperReviewLayout>
//         );
//     }

//     const currentPaper = papers[currentIndex];



//     return (
//         <PaperReviewLayout loading={loading && papers.length === 0}>
//             <Button
//                 onClick={() => navigate(`/projects/${projectId}`)}
//                 className="mb-4"
//             >
//                 <ArrowLeftOutlined className="mr-2" /> Back to Project
//             </Button>

//             <PaperReviewCard
//                 paper={currentPaper}
//                 projectDetails={projectDetails}
//                 actions={reviewActions}
//                 loading={loading}
//             />
//         </PaperReviewLayout>
//     );
// };

// export default TinderForAbstracts;


/*


    // if (papers.length === 0) {
    //     return (
    //         <div className="no-more-papers">
    //             <Text>No more papers to review!</Text>
    //             <Button
    //                 icon={<ArrowLeftOutlined />}
    //                 onClick={() => navigate(`/projects/${projectId}`)}
    //             >
    //                 Back to Project
    //             </Button>
    //         </div>
    //     );
    // }


        // return (
    //     <div className="tinder-abstracts-container">
    //         <Button
    //             icon={<ArrowLeftOutlined />}
    //             onClick={() => navigate(`/projects/${projectId}`)}
    //             className="back-button"
    //         >
    //             Back to Project
    //         </Button>
    //         <Card
    //             title={
    //                 <Space direction="vertical" size="small">
    //                     <Title level={3}>{projectDetails.name}</Title>
    //                     <Space>
    //                         <QuestionCircleOutlined />
    //                         <Text strong>Research Question:</Text>
    //                     </Space>
    //                     <Paragraph>{projectDetails.researchQuestion}</Paragraph>
    //                 </Space>
    //             }
    //             actions={[
    //                 <Button type="primary" danger icon={<DislikeOutlined />} onClick={() => handleDecision('reject')}>Reject</Button>,
    //                 <Button icon={<ForwardOutlined />} onClick={() => handleDecision('skip')}>Skip</Button>,
    //                 <Button type="primary" icon={<LikeOutlined />} onClick={() => handleDecision('accept')}>Accept</Button>,
    //             ]}
    //         >
    //             <Space direction="vertical" size="small" className="metadata-container">
    //                 <Text strong>{currentPaper.title}</Text>
    //                 <Space split={<Divider type="vertical" />}>
    //                     <Text type="secondary"><UserOutlined /> {currentPaper.authors}</Text>
    //                     <Text type="secondary"><CalendarOutlined /> {currentPaper.publication_date}</Text>
    //                 </Space>
    //                 <Progress percent={currentPaper.relevancy_score * 10} size="small" format={() => `Relevance: ${currentPaper.relevancy_score}`} />
    //             </Space>
    //             <Divider />
    //             <Paragraph>
    //                 <Text strong>Abstract:</Text>
    //             </Paragraph>
    //             <Paragraph>{currentPaper.abstract}</Paragraph>
    //         </Card>
    //     </div>
    // );

    */