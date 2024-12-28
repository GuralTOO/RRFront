// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined, ForwardOutlined } from '@ant-design/icons';
// import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';
// import { getProjectDetails } from '@/api/projectsApi';
// import { addReview } from '@/api/reviewsAPI';
// import { supabase } from '@/supabaseClient';

// const TinderForAbstracts = () => {
//     const { projectId } = useParams();
//     const navigate = useNavigate();
//     const [currentPaper, setCurrentPaper] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [projectDetails, setProjectDetails] = useState(null);

//     const fetchNextPaper = async () => {
//         try {
//             const { data: { user } } = await supabase.auth.getUser();
//             if (!user) throw new Error('No user logged in');

//             const { data, error } = await supabase.rpc('get_next_paper_for_review', {
//                 p_project_id: projectId,
//                 p_reviewer_id: user.id
//             });

//             if (error) throw error;
//             setCurrentPaper(data[0] || null);
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
//                 const [projectData] = await Promise.all([
//                     getProjectDetails(projectId),
//                     fetchNextPaper()
//                 ]);
//                 setProjectDetails(projectData);
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//         fetchData();
//     }, [projectId]);

//     const handleDecision = async (decision) => {
//         if (!currentPaper) return;

//         setLoading(true);
//         try {
//             await addReview(projectId, currentPaper.paper_id, decision, "abstract_screening");
//             await fetchNextPaper();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const reviewActions = [
//         {
//             label: "Reject",
//             icon: <DislikeOutlined />,
//             onClick: () => handleDecision('reject'),
//             variant: "destructive",
//         },
//         {
//             label: "Skip",
//             icon: <ForwardOutlined />,
//             onClick: () => handleDecision('skip'),
//             variant: "secondary",
//         },
//         {
//             label: "Accept",
//             icon: <LikeOutlined />,
//             onClick: () => handleDecision('accept'),
//             variant: "success",
//         },
//     ];

//     if (loading && !currentPaper) {
//         return <PaperReviewLayout loading={true} />;
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center gap-4 p-4">
//                 <div className="text-red-600">{error}</div>
//                 <Button onClick={() => navigate(`/projects/${projectId}`)}>
//                     <ArrowLeftOutlined className="mr-2" /> Back to Project
//                 </Button>
//             </div>
//         );
//     }

//     if (!currentPaper) {
//         return (
//             <PaperReviewLayout>
//                 <div className="text-center space-y-4">
//                     <p className="text-lg">No more papers to review!</p>
//                     <Button onClick={() => navigate(`/projects/${projectId}`)}>
//                         <ArrowLeftOutlined className="mr-2" /> Back to Project
//                     </Button>
//                 </div>
//             </PaperReviewLayout>
//         );
//     }

//     if (loading || !currentPaper || !projectDetails) {
//         return <PaperReviewLayout loading={true} />;
//     }

//     return (

//         <PaperReviewLayout>
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


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { ArrowLeftOutlined, LikeOutlined, DislikeOutlined, ForwardOutlined } from '@ant-design/icons';
// import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';
// import { getProjectDetails } from '@/api/projectsApi';
// import { addReview, generateReviewQueue } from '@/api/reviewsAPI';

// const TinderForAbstracts = () => {
//     const { projectId } = useParams();
//     const navigate = useNavigate();
//     const [paperQueue, setPaperQueue] = useState([]);
//     const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [projectDetails, setProjectDetails] = useState(null);

//     const fetchQueue = async () => {
//         try {
//             const papers = await generateReviewQueue(projectId);
//             setPaperQueue(papers);
//             setCurrentPaperIndex(0);
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
//                 const [projectData] = await Promise.all([
//                     getProjectDetails(projectId),
//                     fetchQueue()
//                 ]);
//                 setProjectDetails(projectData);
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//         fetchData();
//     }, [projectId]);

//     const handleDecision = async (decision) => {
//         if (!paperQueue[currentPaperIndex]) return;

//         if (decision === 'skip') {
//             // Just move to next paper without saving
//             setCurrentPaperIndex(prev => prev + 1);
//             return;
//         }

//         setLoading(true);
//         try {
//             await addReview(
//                 projectId, 
//                 paperQueue[currentPaperIndex].paper_id, 
//                 decision,
//                 "abstract_screening"
//             );
//             setCurrentPaperIndex(prev => prev + 1);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectPaper = (index) => {
//         setCurrentPaperIndex(index);
//     };

//     const reviewActions = [
//         {
//             label: "Reject",
//             icon: <DislikeOutlined />,
//             onClick: () => handleDecision('reject'),
//             variant: "destructive",
//         },
//         {
//             label: "Skip",
//             icon: <ForwardOutlined />,
//             onClick: () => handleDecision('skip'),
//             variant: "secondary",
//         },
//         {
//             label: "Accept",
//             icon: <LikeOutlined />,
//             onClick: () => handleDecision('accept'),
//             variant: "success",
//         },
//     ];

//     if (loading && paperQueue.length === 0) {
//         return <PaperReviewLayout loading={true} />;
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center gap-4 p-4">
//                 <div className="text-red-600">{error}</div>
//                 <Button onClick={() => navigate(`/projects/${projectId}`)}>
//                     <ArrowLeftOutlined className="mr-2" /> Back to Project
//                 </Button>
//             </div>
//         );
//     }

//     if (paperQueue.length === 0 || currentPaperIndex >= paperQueue.length) {
//         return (
//             <PaperReviewLayout>
//                 <div className="text-center space-y-4">
//                     <p className="text-lg">No more papers to review!</p>
//                     <Button onClick={() => navigate(`/projects/${projectId}`)}>
//                         <ArrowLeftOutlined className="mr-2" /> Back to Project
//                     </Button>
//                 </div>
//             </PaperReviewLayout>
//         );
//     }

//     return (
//         <div className="flex h-screen">
//             {/* Paper Queue Sidebar */}
//             <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
//                 <h3 className="text-lg font-semibold mb-4">Review Queue</h3>
//                 <div className="space-y-2">
//                     {paperQueue.map((paper, index) => (
//                         <div
//                             key={paper.paper_id}
//                             className={`p-2 rounded cursor-pointer ${
//                                 index === currentPaperIndex 
//                                     ? 'bg-blue-100 border-blue-500' 
//                                     : 'bg-white hover:bg-gray-50'
//                             }`}
//                             onClick={() => handleSelectPaper(index)}
//                         >
//                             <p className="font-medium truncate">{paper.title}</p>
//                             <p className="text-sm text-gray-500 truncate">
//                                 {paper.authors?.[0] || 'Unknown Author'}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 overflow-y-auto">
//                 <PaperReviewLayout>
//                     <Button
//                         onClick={() => navigate(`/projects/${projectId}`)}
//                         className="mb-4"
//                     >
//                         <ArrowLeftOutlined className="mr-2" /> Back to Project
//                     </Button>

//                     <PaperReviewCard
//                         paper={paperQueue[currentPaperIndex]}
//                         projectDetails={projectDetails}
//                         actions={reviewActions}
//                         loading={loading}
//                     />
//                 </PaperReviewLayout>
//             </div>
//         </div>
//     );
// };

// export default TinderForAbstracts;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Forward } from 'lucide-react';
import {ArrowLeftOutlined} from '@ant-design/icons';
import PaperReviewCard, { PaperReviewLayout } from '../PaperReviewCard';
import ReviewQueue from '@/Scripts/Review/ReviewQueue';
import { getProjectDetails } from '@/api/projectsApi';
import { addReview, generateReviewQueue } from '@/api/reviewsAPI';

const TinderForAbstracts = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [paperQueue, setPaperQueue] = useState([]);
    const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [decisions, setDecisions] = useState({});

    const fetchQueue = async () => {
        try {
            const papers = await generateReviewQueue(projectId);
            setPaperQueue(papers);
            setCurrentPaperIndex(0);
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
                    fetchQueue()
                ]);
                setProjectDetails(projectData);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, [projectId]);

    const handleDecision = async (decision) => {
        if (!paperQueue[currentPaperIndex]) return;

        if (decision === 'skip') {
            setCurrentPaperIndex(prev => prev + 1);
            return;
        }

        setLoading(true);
        try {
            await addReview(
                projectId, 
                paperQueue[currentPaperIndex].paper_id, 
                decision,
                "abstract_screening"
            );
            
            // Update decisions state
            setDecisions(prev => ({
                ...prev,
                [paperQueue[currentPaperIndex].paper_id]: decision
            }));
            
            setCurrentPaperIndex(prev => prev + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const reviewActions = [
        {
            label: "Reject",
            icon: <ThumbsDown className="w-4 h-4" />,
            onClick: () => handleDecision('reject'),
            variant: "destructive",
        },
        {
            label: "Skip",
            icon: <Forward className="w-4 h-4" />,
            onClick: () => handleDecision('skip'),
            variant: "secondary",
        },
        {
            label: "Accept",
            icon: <ThumbsUp className="w-4 h-4" />,
            onClick: () => handleDecision('accept'),
            variant: "success",
        },
    ];

    if (loading && paperQueue.length === 0) {
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

    if (paperQueue.length === 0 || currentPaperIndex >= paperQueue.length) {
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

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <PaperReviewLayout>
                    <PaperReviewCard
                        paper={paperQueue[currentPaperIndex]}
                        projectDetails={projectDetails}
                        actions={reviewActions}
                        loading={loading}
                    />
                </PaperReviewLayout>
            </div>

            {/* Review Queue Sidebar */}
            <ReviewQueue
                papers={paperQueue}
                currentIndex={currentPaperIndex}
                onSelectPaper={setCurrentPaperIndex}
                decisions={decisions}
            />
        </div>
    );
};

export default TinderForAbstracts;