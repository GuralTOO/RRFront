// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Typography, Button, Input, Progress, Modal, Tooltip, Space, Spin } from 'antd';
// import { ArrowLeftOutlined, EditOutlined, QuestionCircleOutlined, FileTextOutlined, FileSearchOutlined } from '@ant-design/icons';
// import DocumentList from '../../../DocumentList';
// import './ProjectDetails.css';
// import { editProject, getProjectDetails } from '@/api/projectsApi';

// const { Title, Paragraph } = Typography;
// const { TextArea } = Input;


// // TODO: Allow for the editing of the project. Save the changes to the API.

// const ProjectDetails = () => {
//     const { projectId } = useParams();
//     const navigate = useNavigate();

//     const [project, setProject] = useState({
//         id: parseInt(projectId),
//         name: 'Loading',
//         papers: 1,
//         description: 'Loading',
//         progress: 0,
//         researchQuestion: 'Loading'
//     });
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // when rendering the page, let's pull the project details from the API
//     useEffect(() => {
//         async function fetchProjectDetails() {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const projectDetails = await getProjectDetails(projectId);
//                 setProject(projectDetails);
//             } catch (error) {
//                 console.error('Error fetching project details:', error);
//                 setError('Failed to load project data. Please try again later.');
//             }
//             finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchProjectDetails();
//     }, [projectId]);


//     const [editing, setEditing] = useState(null);
//     const [editValue, setEditValue] = useState('');
//     const [isModalVisible, setIsModalVisible] = useState(false);

//     const handleEdit = (field, value) => {
//         setEditing(field);
//         setEditValue(value);
//     };

//     const handleSave = () => {
//         if (editing === 'researchQuestion') {
//             setIsModalVisible(true);
//         } else {
//             // make an API call to save the changes
//             editProject(projectId, editing, editValue);
//             // update the local state
//             setProject(prev => ({ ...prev, [editing]: editValue }));
//             setEditing(null);
//         }
//     };

//     const handleCancel = () => {
//         setEditing(null);
//     };

//     const handleModalOk = () => {
//         // make an API call to save the changes
//         editProject(projectId, 'researchQuestion', editValue);
//         // update the local state
//         setProject(prev => ({ ...prev, researchQuestion: editValue }));
//         setEditing(null);
//         setIsModalVisible(false);
//     };

//     const handleModalCancel = () => {
//         setIsModalVisible(false);
//     };

//     const renderEditableField = (field, value, icon) => (
//         <div className="editable-field">
//             {editing === field ? (
//                 <Space direction="vertical" style={{ width: '100%' }}>
//                     <TextArea
//                         value={editValue}
//                         onChange={(e) => setEditValue(e.target.value)}
//                         autoSize={{ minRows: 2, maxRows: 4 }}
//                     />
//                     <Space>
//                         <Button onClick={handleSave} type="primary">Save</Button>
//                         <Button onClick={handleCancel}>Cancel</Button>
//                     </Space>
//                 </Space>
//             ) : (
//                 <Space direction="vertical" style={{ width: '100%' }}>
//                     <Space align="start">
//                         {icon}
//                         <Paragraph>{value}</Paragraph>
//                     </Space>
//                     <Button icon={<EditOutlined />} onClick={() => handleEdit(field, value)} type="link">
//                         Edit
//                     </Button>
//                 </Space>
//             )}
//         </div>
//     );

//     if (isLoading) return <Spin size="large" />;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="project-details-container">
//             <Button
//                 icon={<ArrowLeftOutlined />}
//                 onClick={() => navigate('/projects')}
//                 className="back-button"
//             >
//                 Back to Projects
//             </Button>
//             <Card
//                 title={
//                     <Space align="center" size="large">
//                         <Title level={2} style={{ margin: 0 }}>
//                             {editing === 'name' ? (
//                                 <Input
//                                     value={editValue}
//                                     onChange={(e) => setEditValue(e.target.value)}
//                                     onPressEnter={handleSave}
//                                     onBlur={handleSave}
//                                 />
//                             ) : (
//                                 project.name
//                             )}
//                         </Title>
//                         {editing !== 'name' && (
//                             <Button icon={<EditOutlined />} onClick={() => handleEdit('name', project.name)} type="text" />
//                         )}
//                     </Space>
//                 }
//                 extra={
//                     <Space>
//                         <Tooltip title="Project Progress">
//                             <Progress type="circle" percent={project.progress} size={80} />
//                         </Tooltip>
//                         <Button
//                             icon={<FileSearchOutlined />}
//                             onClick={() => navigate(`/projects/${projectId}/review`)}
//                             type="primary"
//                         >
//                             Review Papers
//                         </Button>
//                     </Space>}
//             >
//                 <Space direction="vertical" size="large" style={{ width: '100%' }}>
//                     {renderEditableField('researchQuestion', project.researchQuestion, <QuestionCircleOutlined />)}
//                     {renderEditableField('description', project.description, <FileTextOutlined />)}
//                     <Paragraph>
//                         <strong>Number of Papers:</strong> {project.papers}
//                     </Paragraph>
//                 </Space>
//             </Card>

//             <Title level={3} className="affiliated-papers-title">Unreviewed Papers</Title>
//             <DocumentList projectId={projectId} />

//             <Modal
//                 title="Confirm Research Question Change"
//                 open={isModalVisible}
//                 onOk={handleModalOk}
//                 onCancel={handleModalCancel}
//             >
//                 <p>Are you sure you want to change the research question? This will cause all relevancy scores associated with papers to be recomputed.</p>
//             </Modal>
//         </div>
//     );
// };

// export default ProjectDetails;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Progress, Modal, Tooltip, Space, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, QuestionCircleOutlined, FileSearchOutlined, TagsOutlined } from '@ant-design/icons';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "antd";
import DocumentList from '../../../DocumentList';
import './ProjectDetails.css';
import { editProject, getProjectDetails } from '@/api/projectsApi';

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

    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalField, setModalField] = useState('');

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
        setEditing(field);
        setEditValue(field === 'keywords' ? (value || []).join(', ') : value);
    };

    const handleSave = () => {
        if (editing === 'researchQuestion' || editing === 'keywords') {
            setModalField(editing);
            setIsModalVisible(true);
        } else {
            saveChanges();
        }
    };

    const saveChanges = () => {
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
                            placeholder={`Enter ${field}`}
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
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(field, value)} type="link">
                        Edit
                    </Button>
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
                        <Tooltip title="Project Progress">
                            <Progress type="circle" percent={project.progress} size={80} />
                        </Tooltip>
                        <Button
                            icon={<FileSearchOutlined />}
                            onClick={() => navigate(`/projects/${projectId}/review`)}
                            type="primary"
                        >
                            Review Papers
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {renderEditableField('researchQuestion', project.researchQuestion, <QuestionCircleOutlined />)}
                    {renderEditableField('keywords', project.keywords, <TagsOutlined />)}
                    <Paragraph>
                        <strong>Number of Papers:</strong> {project.papers}
                    </Paragraph>
                </Space>
            </Card>

            <DocumentList projectId={projectId} />

            <Modal
                title={`Confirm ${modalField === 'researchQuestion' ? 'Research Question' : 'Keywords'} Change`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Are you sure you want to change the {modalField === 'researchQuestion' ? 'research question' : 'keywords'}? This will cause all relevancy scores associated with papers to be recomputed.</p>
            </Modal>
        </div>
    );
};

export default ProjectDetails;