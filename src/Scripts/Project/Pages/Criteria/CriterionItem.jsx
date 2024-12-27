import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CriteriaDialog from './CriteriaDialog';

const stringToColor = (str) => {
  const colors = [
    { bg: 'bg-blue-50', text: 'text-blue-700' },
    { bg: 'bg-green-50', text: 'text-green-700' },
    { bg: 'bg-purple-50', text: 'text-purple-700' },
    { bg: 'bg-orange-50', text: 'text-orange-700' },
    { bg: 'bg-pink-50', text: 'text-pink-700' },
    { bg: 'bg-cyan-50', text: 'text-cyan-700' },
    { bg: 'bg-indigo-50', text: 'text-indigo-700' }
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const CriterionItem = ({ criterion, onEdit, onDelete, canEdit, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const categoryColors = criterion.category ? stringToColor(criterion.category) : null;

  const handleSave = (editedCriterion) => {
    onEdit({
      ...criterion,
      text: editedCriterion.text,
      category: editedCriterion.category || null
    });
  };

  return (
    <>
      <div className="group py-4 px-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            {criterion.category && (
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${categoryColors.bg} ${categoryColors.text} rounded-full`}>
                {criterion.category}
              </span>
            )}
            <p className="text-sm text-gray-600">{criterion.text}</p>
          </div>
          {canEdit && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(criterion.id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <CriteriaDialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        initialData={{
          text: criterion.text,
          category: criterion.category || ''
        }}
        title="Edit Criterion"
        type={type}
      />
    </>
  );
};

export default CriterionItem;