import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Spin, Tag, Tooltip, Space } from 'antd';
import { ArrowLeftOutlined, FileSearchOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import './ProjectDetails.css';
import { getProjectDetails, getUserRole } from '@/api/projectsApi';
import ProjectDetailsCard from './ProjectDetailsCard';
import ConflictsTab from './ConflictsTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import CriteriaTab from './CriteriaTab';
import DocumentList from '../../../DocumentList';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        id: parseInt(projectId),
        name: 'Loading',
        papers: 1,
        keywords: null,
        progress: 0,
        researchQuestion: 'Loading'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const canEdit = (userRole === 'admin' || userRole === 'senior');

    useEffect(() => {
        async function fetchProjectDetails() {
            setIsLoading(true);
            setError(null);
            try {
                const projectDetails = await getProjectDetails(projectId);
                setProject({
                    ...projectDetails,
                    keywords: projectDetails.keywords || []
                });
                const role = await getUserRole(projectId);
                setUserRole(role);
            } catch (error) {
                console.error('Error fetching project details:', error);
                setError('Failed to load project data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjectDetails();
    }, [projectId]);

    if (isLoading) return <Spin size="large" />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="project-details-container">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/projects')}
                className="back-button"
            >
                Back to Projects
            </Button>
            <Card className="mb-8 project-details-card">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{project.name}</span>
                        <Space>
                            <Tooltip title="User Role">
                                <Tag icon={<UserOutlined />} color="blue">{userRole}</Tag>
                            </Tooltip>
                            <Link to={`/projects/${projectId}/review`}>
                                <Button icon={<FileSearchOutlined />} type="primary">Abstract Review</Button>
                            </Link>
                            <Link to={`/projects/${projectId}/fulltextreview`}>
                                <Button icon={<FileSearchOutlined />} type="primary">Full-text Review</Button>
                            </Link>

                            {
                                (userRole === 'admin' || userRole === 'senior') &&
                                <Link to={`/projects/${projectId}/conflicts`}>
                                    <Button icon={<ExclamationCircleOutlined />}
                                        type="primary">Resolve Conflicts</Button>
                                </Link>
                            }
                        </Space>
                    </CardTitle>
                </CardHeader>
                <CardContent className="card-content">
                    <Tabs defaultValue="details" className="h-full flex flex-col project-tabs">
                        <TabsList className="project-tabs-list">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="criteria">Criteria</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <div className="tab-content flex-grow overflow-auto">
                            <TabsContent value="details">
                                <ProjectDetailsCard
                                    project={project}
                                    setProject={setProject}
                                    canEdit={canEdit}
                                />
                            </TabsContent>
                            <TabsContent value="conflicts">
                                <ConflictsTab projectId={projectId} />
                            </TabsContent>
                            <TabsContent value="analytics">
                                <AnalyticsTab projectId={projectId} />
                            </TabsContent>
                            <TabsContent value="criteria">
                                <CriteriaTab projectId={projectId} />
                            </TabsContent>
                            <TabsContent value="settings">
                                <SettingsTab projectId={projectId} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <DocumentList projectId={projectId} />
        </div>
    );
};

export default ProjectDetails;


/*

gcloud functions deploy generate-criteria \
  --region=us-east1 \
  --runtime=python39 \
  --set-env-vars CORS_ORIGINS="http://localhost:5173,https://rapidreview.io" \
  --allow-unauthenticated

  */