import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Input, Progress, Modal, Tooltip, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, QuestionCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import DocumentList from '../../../DocumentList';
import './ProjectDetails.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        id: parseInt(projectId),
        name: 'Project A',
        papers: 1500,
        description: 'AI Ethics Research',
        progress: 75,
        researchQuestion: 'What are the ethical implications of AI in healthcare?'
    });

    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleEdit = (field, value) => {
        setEditing(field);
        setEditValue(value);
    };

    const handleSave = () => {
        if (editing === 'researchQuestion') {
            setIsModalVisible(true);
        } else {
            setProject(prev => ({ ...prev, [editing]: editValue }));
            setEditing(null);
        }
    };

    const handleCancel = () => {
        setEditing(null);
    };

    const handleModalOk = () => {
        setProject(prev => ({ ...prev, researchQuestion: editValue }));
        setEditing(null);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const renderEditableField = (field, value, icon) => (
        <div className="editable-field">
            {editing === field ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                    <Space>
                        <Button onClick={handleSave} type="primary">Save</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </Space>
                </Space>
            ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space align="start">
                        {icon}
                        <Paragraph>{value}</Paragraph>
                    </Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(field, value)} type="link">
                        Edit
                    </Button>
                </Space>
            )}
        </div>
    );

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
                    <Tooltip title="Project Progress">
                        <Progress type="circle" percent={project.progress} width={80} />
                    </Tooltip>
                }
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {renderEditableField('researchQuestion', project.researchQuestion, <QuestionCircleOutlined />)}
                    {renderEditableField('description', project.description, <FileTextOutlined />)}
                    <Paragraph>
                        <strong>Number of Papers:</strong> {project.papers}
                    </Paragraph>
                </Space>
            </Card>

            <Title level={3} className="affiliated-papers-title">Affiliated Papers</Title>
            <DocumentList />

            <Modal
                title="Confirm Research Question Change"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Are you sure you want to change the research question? This will cause all relevancy scores associated with papers to be recomputed.</p>
            </Modal>
        </div>
    );
};

export default ProjectDetails;