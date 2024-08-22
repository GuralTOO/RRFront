import React from 'react';
import { Card, Avatar, Progress, Row, Col, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AllProjects.css';

const { Meta } = Card;
const { Title } = Typography;

const AllProjects = () => {
    const navigate = useNavigate();

    const projectsData = [
        { id: 0, name: 'Project A', papers: 1500, description: 'AI Ethics Research', progress: 75 },
        { id: 1, name: 'Project B', papers: 2300, description: 'Quantum Computing Advancements', progress: 60 },
        { id: 2, name: 'Project C', papers: 800, description: 'Climate Change Impact Studies', progress: 40 },
        { id: 3, name: 'Project D', papers: 3100, description: 'Neuroscience and Consciousness', progress: 90 },
    ];

    const handleCardClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    return (
        <div className="projects-container">
            <Title level={2} className="page-title">Active Projects</Title>
            <Row gutter={[24, 24]}>
                {projectsData.map((project) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                        <Card
                            hoverable
                            className="project-card"
                            onClick={() => handleCardClick(project.id)}
                            cover={
                                <div className="card-cover">
                                    <Progress type="circle" percent={project.progress} width={80} />
                                </div>
                            }
                            actions={[
                                <BarChartOutlined key="stats" />,
                                <EditOutlined key="edit" />,
                                <DeleteOutlined key="delete" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/identicon/svg?seed=${project.name}`} />}
                                title={project.name}
                                description={project.description}
                            />
                            <div className="card-details">
                                <p>Papers: {project.papers}</p>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AllProjects;