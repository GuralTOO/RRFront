import React, { useState, useEffect } from 'react';
import { Card, Avatar, Progress, Row, Col, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, createNewProject } from '../../../api/projectsApi';
import CreateProjectModal from './Project/CreateProjectModal';
import './AllProjects.css';

const { Meta } = Card;
const { Title } = Typography;

const AllProjects = () => {
    const navigate = useNavigate();
    const [projectsData, setProjectsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const projects = await getUserProjects();
                setProjectsData(projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const handleCardClick = (projectId) => {
        navigate(`/p/${projectId}`);
    };

    const handleCreateProject = (projectName) => {
        // Here you would typically make an API call to create the project
        // For now, we'll just add it to the local state
        createNewProject(projectName, "What is the meaning of life?");
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    if (loading) return <div>Loading projects...</div>;

    return (
        <div className="projects-container">
            <Title level={2} className="page-title">Active Projects</Title>
            <CreateProjectModal onCreateProject={handleCreateProject} />
            <Row gutter={[24, 24]}>
                {projectsData.map((project) => (
                    <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                        <Card
                            hoverable
                            className="project-card"
                            onClick={() => handleCardClick(project.id)}
                            cover={
                                <div className="card-cover">
                                    <CalendarOutlined style={{ fontSize: '24px', color: '#fff' }} />
                                    <span className="project-date">{project.date}</span>
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
                                description={
                                    <Tooltip title={project.researchQuestion}>
                                        {truncateText(project.researchQuestion, 80)}
                                    </Tooltip>
                                }
                            />
                            <div className="card-details">
                                <p>Papers: {project.papers}</p>
                                <p>Role: {project.role}</p>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AllProjects;