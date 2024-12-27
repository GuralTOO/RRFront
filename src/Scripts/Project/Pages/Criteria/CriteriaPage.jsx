import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Wand2, ListFilter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CriteriaControls from './CriteriaControls';
import CriterionItem from './CriterionItem';
import CriteriaDialog from './CriteriaDialog';
import {
  getCriteriaForProject,
  createCriterion,
  updateCriterion,
  deleteCriterion,
  getUserProjectRole,
  generateCriteria
} from '../../../../api/criteriaApi';

import PageHeader from '../../components/PageHeader';

const CriteriaList = ({ title, criteria, type, onAdd, onEdit, onDelete, canEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Get unique categories
  const categories = ['all', ...new Set(criteria.map(group => group.category))];

  // Filter criteria based on search and category
  const filteredCriteria = criteria.reduce((acc, categoryGroup) => {
    const filteredItems = categoryGroup.items.filter(item => 
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || categoryGroup.category === selectedCategory)
    );
    return filteredItems.length > 0 ? [...acc, ...filteredItems] : acc;
  }, []);

  const handleAdd = (newCriterion) => {
    onAdd({ ...newCriterion, type });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {canEdit && (
          <Button 
            variant="outline"
            onClick={() => setIsAddingNew(true)}
            className="text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        )}
      </div>

      <CriteriaControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <CriteriaDialog
        open={isAddingNew}
        onClose={() => setIsAddingNew(false)}
        onSave={handleAdd}
        title={`Add ${title.slice(0, -9)} Criterion`}
        type={type}
      />

      <div className="bg-white rounded-lg divide-y divide-gray-100">
        {filteredCriteria.map((item) => (
          <CriterionItem
            key={item.id}
            criterion={item}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={canEdit}
          />
        ))}
        {filteredCriteria.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No criteria found matching your search
          </div>
        )}
      </div>
    </div>
  );
};

const CriteriaPage = () => {
  const { projectId } = useParams();
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
      await fetchCriteria();
    } catch (err) {
      console.error('Error generating criteria:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAdd = async (newCriterion) => {
    try {
      await createCriterion(projectId, {
        project_id: projectId,
        criteria_text: newCriterion.text,
        category: newCriterion.category,
        is_inclusion: newCriterion.type === 'inclusion'
      });
      await fetchCriteria();
    } catch (err) {
      console.error('Error adding criterion:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (criterionId) => {
    try {
      await deleteCriterion(criterionId);
      await fetchCriteria();
    } catch (err) {
      console.error('Error deleting criterion:', err);
      setError(err.message);
    }
  };

  const handleEdit = async (criterion) => {
    try {
      await updateCriterion(criterion.id, {
        criteria_text: criterion.text,
        category: criterion.category,
        is_inclusion: criterion.is_inclusion
      });
      await fetchCriteria();
    } catch (err) {
      console.error('Error updating criterion:', err);
      setError(err.message);
    }
  };

  const canEdit = userRole === 'senior' || userRole === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6">
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        icon={ListFilter}
        title="Selection Criteria"
      >
        {canEdit && (
          <Button
            onClick={handleGenerateCriteria}
            disabled={generating}
            size="sm"
            className="gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate Criteria'}
          </Button>
        )}
      </PageHeader>

      <div className="flex-1 px-6 py-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <CriteriaList
              title="Inclusion Criteria"
              criteria={criteria.inclusion_criteria}
              type="inclusion"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canEdit}
            />
            <CriteriaList
              title="Exclusion Criteria"
              criteria={criteria.exclusion_criteria}
              type="exclusion"
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriteriaPage;