import React, { useState } from 'react';
import { Button, Input, Tag, Space, Typography } from 'antd';
import { EditOutlined, QuestionCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const { Paragraph } = Typography;

const ProjectDetailsCard = ({ project, setProject, canEdit }) => {
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const handleEdit = (field, value) => {
        if (!canEdit) return;
        setEditing(field);
        setEditValue(field === 'keywords' ? (value || []).join(', ') : value);
    };

    const handleSaveConfirmed = async () => {
        const newValue = editing === 'keywords' ? editValue.split(',').map(k => k.trim()).filter(k => k !== '') : editValue;
        try {
            await editProject(project.id, editing, newValue);
            setProject(prev => ({ ...prev, [editing]: newValue }));
            setEditing(null);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
        setShowSaveDialog(false);
    };

    const handleSave = () => {
        setShowSaveDialog(true);
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
                        {canEdit && (
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

            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Saving these changes will trigger a recalculation of relevancy scores for all papers in this project. This process may take some time. Do you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowSaveDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveConfirmed}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectDetailsCard;