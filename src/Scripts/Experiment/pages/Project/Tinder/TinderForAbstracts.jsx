import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space, Progress, Divider, Spin, message } from 'antd';
import { LikeOutlined, DislikeOutlined, ForwardOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './TinderForAbstracts.css';
import { getProjectDetails } from '@/api/projectsApi';
import { getUnreviewedPapers } from '@/api/papersApi';
import { addReview } from '@/api/reviewsAPI';

const { Text, Paragraph, Title } = Typography;
const BATCH_SIZE = 50;

// TODO: Import or implement this function
// import { savePaperDecision } from '@/api/papersApi';

const TinderForAbstracts = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);

    const fetchPapers = async () => {
        try {
            const papersData = await getUnreviewedPapers(projectId, 'created_at', false, 1, BATCH_SIZE);
            setPapers(papersData.data);
            setCurrentIndex(0);
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
                const projectData = await getProjectDetails(projectId);
                setProjectDetails(projectData);
                await fetchPapers();
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const handleDecision = async (decision) => {
        setLoading(true);
        try {
            // TODO: Implement API call to save paper decision
            // await savePaperDecision(projectId, papers[currentIndex].paper_id, decision);
            console.log(`Decision for paper ${papers[currentIndex].paper_id}: ${decision}`);
            await addReview(projectId, papers[currentIndex].paper_id, decision);
            // Refresh the list of unreviewed papers
            await fetchPapers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && papers.length === 0) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <Text>Loading project details and papers...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Text type="danger">{error}</Text>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/projects/${projectId}`)}
                >
                    Back to Project
                </Button>
            </div>
        );
    }

    if (papers.length === 0) {
        return (
            <div className="no-more-papers">
                <Text>No more papers to review!</Text>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/projects/${projectId}`)}
                >
                    Back to Project
                </Button>
            </div>
        );
    }

    const currentPaper = papers[currentIndex];

    return (
        <div className="tinder-abstracts-container">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/projects/${projectId}`)}
                className="back-button"
            >
                Back to Project
            </Button>
            <Card
                title={
                    <Space direction="vertical" size="small">
                        <Title level={3}>{projectDetails.name}</Title>
                        <Space>
                            <QuestionCircleOutlined />
                            <Text strong>Research Question:</Text>
                        </Space>
                        <Paragraph>{projectDetails.researchQuestion}</Paragraph>
                    </Space>
                }
                actions={[
                    <Button type="primary" danger icon={<DislikeOutlined />} onClick={() => handleDecision('reject')}>Reject</Button>,
                    <Button icon={<ForwardOutlined />} onClick={() => handleDecision('skip')}>Skip</Button>,
                    <Button type="primary" icon={<LikeOutlined />} onClick={() => handleDecision('accept')}>Accept</Button>,
                ]}
            >
                <Space direction="vertical" size="small" className="metadata-container">
                    <Text strong>{currentPaper.title}</Text>
                    <Space split={<Divider type="vertical" />}>
                        <Text type="secondary"><UserOutlined /> {currentPaper.authors}</Text>
                        <Text type="secondary"><CalendarOutlined /> {currentPaper.publication_date}</Text>
                    </Space>
                    <Progress percent={currentPaper.relevancy_score * 10} size="small" format={() => `Relevance: ${currentPaper.relevancy_score}`} />
                </Space>
                <Divider />
                <Paragraph>
                    <Text strong>Abstract:</Text>
                </Paragraph>
                <Paragraph>{currentPaper.abstract}</Paragraph>
            </Card>
        </div>
    );
};

export default TinderForAbstracts;