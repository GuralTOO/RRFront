// import React, { useState } from 'react';
// import { Space, Button, Input, Tag, Typography } from 'antd';
// import { EditOutlined, QuestionCircleOutlined, TagsOutlined } from '@ant-design/icons';
// import { Textarea } from "@/components/ui/textarea";
// import { editProject } from '@/api/projectsApi';

// const { Title, Paragraph } = Typography;

// const ProjectDetailsCard = ({ project, setProject, isAdmin }) => {
//     const [editing, setEditing] = useState(null);
//     const [editValue, setEditValue] = useState('');

//     const handleEdit = (field, value) => {
//         if (!isAdmin) return;
//         setEditing(field);
//         setEditValue(field === 'keywords' ? (value || []).join(', ') : value);
//     };

//     const handleSave = async () => {
//         if (!isAdmin) return;
//         const newValue = editing === 'keywords' ? editValue.split(',').map(k => k.trim()).filter(k => k !== '') : editValue;
//         try {
//             await editProject(project.id, editing, newValue);
//             setProject(prev => ({ ...prev, [editing]: newValue }));
//             setEditing(null);
//         } catch (error) {
//             console.error('Error saving changes:', error);
//             // Handle error (e.g., show an error message to the user)
//         }
//     };

//     const handleCancel = () => {
//         setEditing(null);
//     };

//     const renderEditableField = (field, value, icon) => (
//         <div className="editable-field">
//             {editing === field ? (
//                 <Space direction="vertical" style={{ width: '100%' }}>
//                     {field === 'keywords' ? (
//                         <Input
//                             value={editValue}
//                             onChange={(e) => setEditValue(e.target.value)}
//                             placeholder="Enter keywords separated by commas"
//                         />
//                     ) : (
//                         <Textarea
//                             value={editValue}
//                             onChange={(e) => setEditValue(e.target.value)}
//                             placeholder={`Enter ${field}`}
//                             rows={4}
//                         />
//                     )}
//                     <Space>
//                         <Button onClick={handleSave} type="primary">Save</Button>
//                         <Button onClick={handleCancel}>Cancel</Button>
//                     </Space>
//                 </Space>
//             ) : (
//                 <Space direction="vertical" style={{ width: '100%' }}>
//                     <Space align="start">
//                         {icon}
//                         {field === 'keywords' ? (
//                             <div>
//                                 {(value || []).map((keyword, index) => (
//                                     <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>{keyword}</Tag>
//                                 ))}
//                                 {(value || []).length === 0 && <Paragraph type="secondary">No keywords set</Paragraph>}
//                             </div>
//                         ) : (
//                             <Paragraph>{value}</Paragraph>
//                         )}
//                     </Space>
//                     {isAdmin && (
//                         <Button icon={<EditOutlined />} onClick={() => handleEdit(field, value)} type="link">
//                             Edit
//                         </Button>
//                     )}
//                 </Space>
//             )}
//         </div>
//     );

//     return (
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//             {renderEditableField('researchQuestion', project.researchQuestion, <QuestionCircleOutlined />)}
//             {renderEditableField('keywords', project.keywords, <TagsOutlined />)}
//             <Paragraph>
//                 <strong>Number of Papers:</strong> {project.papers}
//             </Paragraph>
//         </Space>
//     );
// };

// export default ProjectDetailsCard;


import React, { useState } from 'react';
import { Button, Input, Tag, Space, Typography } from 'antd';
import { EditOutlined, QuestionCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Textarea } from "@/components/ui/textarea";
import { editProject } from '@/api/projectsApi';

const { Paragraph } = Typography;

const ProjectDetailsCard = ({ project, setProject, isAdmin }) => {
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEdit = (field, value) => {
        if (!isAdmin) return;
        setEditing(field);
        setEditValue(field === 'keywords' ? (value || []).join(', ') : value);
    };

    const handleSave = async () => {
        if (!isAdmin) return;
        const newValue = editing === 'keywords' ? editValue.split(',').map(k => k.trim()).filter(k => k !== '') : editValue;
        try {
            await editProject(project.id, editing, newValue);
            setProject(prev => ({ ...prev, [editing]: newValue }));
            setEditing(null);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleCancel = () => {
        setEditing(null);
    };

    const renderEditableField = (field, value, icon, label) => (
        <div className="rounded-lg bg-gray-50 p-4 space-y-2 w-full">
            <div className="flex items-center gap-2 font-medium text-lg">
                {icon}
                <span>{label}</span>
            </div>
            <div className="pl-6">
                {editing === field ? (
                    <div className="space-y-4 w-full">
                        {field === 'keywords' ? (
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="Enter keywords separated by commas"
                                className="w-full"
                            />
                        ) : (
                            <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder={`Enter ${field}`}
                                rows={4}
                                className="w-full"
                            />
                        )}
                        <div className="space-x-2">
                            <Button onClick={handleSave} type="primary">Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 w-full">
                        {field === 'keywords' ? (
                            <div className="flex flex-wrap gap-2">
                                {(value || []).map((keyword, index) => (
                                    <Tag key={index} color="blue">{keyword}</Tag>
                                ))}
                                {(value || []).length === 0 &&
                                    <span className="text-gray-500">No keywords set</span>
                                }
                            </div>
                        ) : (
                            <p className="text-gray-700">{value}</p>
                        )}
                        {isAdmin && (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(field, value)}
                                type="link"
                                className="pl-0"
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 w-full">
            {renderEditableField(
                'researchQuestion',
                project.researchQuestion,
                <QuestionCircleOutlined />,
                'Research Question'
            )}
            {renderEditableField(
                'keywords',
                project.keywords,
                <TagsOutlined />,
                'Keywords'
            )}
            <Paragraph>
                <strong>Number of Papers:</strong> {project.papers}
            </Paragraph>
        </div>
    );
};

export default ProjectDetailsCard;