import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Progress, Divider } from 'antd';
import { LikeOutlined, DislikeOutlined, ForwardOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { documents } from '../../../../documentData';
import './TinderForAbstracts.css';

const { Text, Paragraph } = Typography;

const BATCH_SIZE = 5;

const TinderForAbstracts = () => {
    const [papers, setPapers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNextBatch();
    }, []);

    const loadNextBatch = () => {
        setLoading(true);
        const nextBatch = documents.slice(currentIndex, currentIndex + BATCH_SIZE);
        setPapers(prevPapers => [...prevPapers, ...nextBatch]);
        setLoading(false);
    };

    const handleDecision = (decision) => {
        console.log(`Decision for paper ${currentIndex}: ${decision}`);
        setCurrentIndex(prevIndex => prevIndex + 1);
        if (currentIndex + 1 >= papers.length - 2) {
            loadNextBatch();
        }
    };

    if (loading && papers.length === 0) {
        return <div className="loading-container">Loading...</div>;
    }

    if (currentIndex >= documents.length) {
        return <div className="no-more-papers">No more papers to review!</div>;
    }

    const currentPaper = papers[currentIndex];

    return (
        <div className="tinder-abstracts-container">
            <Card
                actions={[
                    <Button type="primary" danger icon={<DislikeOutlined />} onClick={() => handleDecision('rejected')}>Reject</Button>,
                    <Button icon={<ForwardOutlined />} onClick={() => handleDecision('skipped')}>Skip</Button>,
                    <Button type="primary" icon={<LikeOutlined />} onClick={() => handleDecision('approved')}>Approve</Button>,
                ]}
            >
                <Space direction="vertical" size="small" className="metadata-container">
                    <Text strong>{currentPaper.title}</Text>
                    <Space split={<Divider type="vertical" />}>
                        <Text type="secondary"><UserOutlined /> {currentPaper.authors}</Text>
                        <Text type="secondary"><CalendarOutlined /> {currentPaper.date}</Text>
                    </Space>
                    <Progress percent={currentPaper.relevance * 10} size="small" format={() => `Relevance: ${currentPaper.relevance}`} />
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