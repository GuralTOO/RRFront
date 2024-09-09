import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Button, Progress, Modal, Tooltip, Space, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, QuestionCircleOutlined, FileSearchOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "antd";
import DocumentList from '../../../DocumentList';
import './ProjectDetails.css';
import InviteUserModal from './InviteUserModal';
import { editProject, getProjectDetails, getUserRole, inviteUserToProject } from '@/api/projectsApi';

const { Title, Paragraph, Text } = Typography;

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

    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalField, setModalField] = useState('');

    const isAdmin = userRole === 'admin';

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

    const handleEdit = (field, value) => {
        if (!isAdmin) return;
        setEditing(field);
        setEditValue(field === 'keywords' ? (value || []).join(', ') : value);
    };

    const handleSave = () => {
        if (!isAdmin) return;
        if (editing === 'researchQuestion' || editing === 'keywords') {
            setModalField(editing);
            setIsModalVisible(true);
        } else {
            saveChanges();
        }
    };

    const saveChanges = () => {
        if (!isAdmin) return;
        const newValue = editing === 'keywords' ? editValue.split(',').map(k => k.trim()).filter(k => k !== '') : editValue;
        editProject(projectId, editing, newValue);
        setProject(prev => ({ ...prev, [editing]: newValue }));
        setEditing(null);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setEditing(null);
    };

    const handleModalOk = () => {
        saveChanges();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleInviteUser = async ({ email, role }) => {
        try {
            console.log('Inviting user:', email, role);
            await inviteUserToProject(projectId, email, role);
            // You might want to show a success message here
        } catch (error) {
            console.error('Error inviting user:', error);
            alert('Error inviting user: ' + error.message);
        }
    };

    // allert or toast to display error message
    const alert = (message) => {
        alert(message);
    }



    const renderEditableField = (field, value, icon) => (
        <div className="editable-field">
            {editing === field ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    {field === 'keywords' ? (
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Enter keywords separated by commas"
                        />
                    ) : (
                        <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder={`Enter ${field} `}
                            rows={4}
                        />
                    )}
                    <Space>
                        <Button onClick={handleSave} type="primary">Save</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </Space>
                </Space>
            ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space align="start">
                        {icon}
                        {field === 'keywords' ? (
                            <div>
                                {(value || []).map((keyword, index) => (
                                    <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>{keyword}</Tag>
                                ))}
                                {(value || []).length === 0 && <Text type="secondary">No keywords set</Text>}
                            </div>
                        ) : (
                            <Paragraph>{value}</Paragraph>
                        )}
                    </Space>
                    {isAdmin && (
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(field, value)} type="link">
                            Edit
                        </Button>
                    )}
                </Space>
            )}
        </div>
    );

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
            <Card
                title={
                    <Space align="center" size="large">
                        <Title level={2} style={{ margin: 0 }}>
                            {editing === 'name' ? (
                                <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onPressEnter={handleSave}
                                    onBlur={handleSave}
                                />
                            ) : (
                                project.name
                            )}
                        </Title>
                        {editing !== 'name' && (
                            <Button icon={<EditOutlined />} onClick={() => handleEdit('name', project.name)} type="text" />
                        )}
                    </Space>
                }
                extra={
                    <Space>
                        <Tooltip title="User Role">
                            <Tag icon={<UserOutlined />} color="blue">{userRole}</Tag>
                        </Tooltip>
                        <Tooltip title="Project Progress">
                            <Progress type="circle" percent={project.progress} size={80} />
                        </Tooltip>
                        <Link to={`/projects/${projectId}/review`}>
                            <Button icon={<FileSearchOutlined />} type="primary">Review Papers</Button>
                        </Link>
                    </Space >
                }
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {renderEditableField('researchQuestion', project.researchQuestion, <QuestionCircleOutlined />)}
                    {renderEditableField('keywords', project.keywords, <TagsOutlined />)}
                    <Paragraph>
                        <strong>Number of Papers:</strong> {project.papers}
                    </Paragraph>
                    {isAdmin && <InviteUserModal onInviteUser={handleInviteUser} />}
                </Space>
            </Card >

            <DocumentList projectId={projectId} />

            <Modal
                title={`Confirm ${modalField === 'researchQuestion' ? 'Research Question' : 'Keywords'} Change`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Are you sure you want to change the {modalField === 'researchQuestion' ? 'research question' : 'keywords'}? This will cause all relevancy scores associated with papers to be recomputed.</p>
            </Modal>
        </div >
    );
};

export default ProjectDetails;