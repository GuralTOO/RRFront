import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Check, X, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getCriteriaForProject, createCriterion, updateCriterion, deleteCriterion, getUserProjectRole, generateCriteria } from '../../../../api/criteriaApi';

const stringToColor = (str) => {
    // List of pleasing, muted colors
    const colors = [
        { bg: 'bg-blue-100', text: 'text-blue-700' },
        { bg: 'bg-green-100', text: 'text-green-700' },
        { bg: 'bg-purple-100', text: 'text-purple-700' },
        { bg: 'bg-orange-100', text: 'text-orange-700' },
        { bg: 'bg-pink-100', text: 'text-pink-700' },
        { bg: 'bg-cyan-100', text: 'text-cyan-700' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700' }
    ];
    
    // Create a simple hash of the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to select a color
    return colors[Math.abs(hash) % colors.length];
};

const CriteriaItem = ({ criterion, onEdit, onDelete, canEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(criterion.text);
    const [editedCategory, setEditedCategory] = useState(criterion.category || '');
    const inputRef = useRef(null);
    
    const categoryColors = criterion.category ? stringToColor(criterion.category) : null;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        onEdit({
            ...criterion,
            text: editedText,
            category: editedCategory || null
        });
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedText(criterion.text);
            setEditedCategory(criterion.category || '');
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-start gap-3 py-3">
                <div className="flex-shrink-0">
                    <input
                        type="text"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="px-2 py-1 text-xs w-24 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Category"
                    />
                </div>
                <div className="flex-1 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-sm text-gray-600 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-700"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditedText(criterion.text);
                            setEditedCategory(criterion.category || '');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-start gap-3 py-3">
            {criterion.category && (
                <span className={`inline-flex px-2 py-1 text-xs font-medium ${categoryColors.bg} ${categoryColors.text} rounded-full whitespace-nowrap`}>
                    {criterion.category}
                </span>
            )}
            <p className="flex-1 text-sm text-gray-600">{criterion.text}</p>
            {canEdit && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(criterion.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};


const CriteriaSection = ({ title, criteria, type, onAdd, onEdit, onDelete, canEdit }) => {
    // Flatten the criteria array
    const flattenedCriteria = criteria.reduce((acc, categoryGroup) => {
        return [...acc, ...categoryGroup.items];
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                {canEdit && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onAdd(type)}
                        className="text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Criterion
                    </Button>
                )}
            </div>
            <div className="bg-white rounded-lg divide-y divide-gray-100">
                {flattenedCriteria.map((item) => (
                    <CriteriaItem
                        key={item.id}
                        criterion={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        canEdit={canEdit}
                    />
                ))}
            </div>
        </div>
    );
};


const CriteriaTab = ({ projectId }) => {
    const [criteria, setCriteria] = useState({ inclusion: [], exclusion: [] });
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    const fetchCriteria = async () => {
        try {
            const criteriaData = await getCriteriaForProject(projectId);
            setCriteria(criteriaData);
        } catch (err) {
            console.error('Error fetching criteria:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                // Fetch user role and criteria in parallel
                const [role, criteriaData] = await Promise.all([
                    getUserProjectRole(projectId),
                    getCriteriaForProject(projectId)
                ]);

                setUserRole(role);
                setCriteria(criteriaData);
            } catch (err) {
                console.error('Error initializing data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [projectId]);

    const handleGenerateCriteria = async () => {
        try {
            setGenerating(true);
            await generateCriteria(projectId);
            await fetchCriteria(); // Refresh the criteria after generation
        } catch (err) {
            console.error('Error generating criteria:', err);
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    const canEdit = userRole === 'senior' || userRole === 'admin';

    const handleAdd = (type) => {
        setSelectedCriterion(null);
        setIsEditing(true);
    };

    const handleDelete = async (criterionId) => {
        try {
            await deleteCriterion(criterionId);
            // Refresh criteria data
            const updatedCriteria = await getCriteriaForProject(projectId);
            setCriteria(updatedCriteria);
        } catch (err) {
            console.error('Error deleting criterion:', err);
            // You might want to show an error message to the user here
        }
    };

    const handleEdit = async (criterion) => {
        try {
            await updateCriterion(criterion.id, {
                criteria_text: criterion.text,
                category: criterion.category,
                is_inclusion: criterion.is_inclusion
            });
            const updatedCriteria = await getCriteriaForProject(projectId);
            setCriteria(updatedCriteria);
        } catch (err) {
            console.error('Error updating criterion:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Criteria</h1>
                {canEdit && (
                    <Button
                        variant="default"
                        onClick={handleGenerateCriteria}
                        disabled={generating}
                        className="text-sm"
                    >
                        <Wand2 className="h-4 w-4 mr-2" />
                        {generating ? 'Generating...' : 'Generate Criteria'}
                    </Button>
                )}
            </div>
            <CriteriaSection
                title="Inclusion Criteria"
                criteria={criteria.inclusion_criteria}
                type="inclusion"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
            />
            <CriteriaSection
                title="Exclusion Criteria"
                criteria={criteria.exclusion_criteria}
                type="exclusion"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEdit}
            />
        </div>
    );

};

export default CriteriaTab;