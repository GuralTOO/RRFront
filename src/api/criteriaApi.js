// criteriaAPI.js
import { supabase } from '../supabaseClient';


export async function generateCriteria(projectId){

    const { data, error } = await supabase.functions.invoke('generate-criteria', {
        body: {
            project_id: projectId
        }
    });

    if (error) {
        console.error('Error calling calculate_relevancy_score:', error);
        throw error;
    }

    console.log("edge function response: ", data);
    return data;

}

export async function getUserProjectRole(projectId) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    // Get user's role in the project
    const { data, error } = await supabase
        .from('user_projects')
        .select('role')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single();

    if (error) throw error;
    return data?.role;
}

// Fetch criteria for a specific project
export async function getCriteriaForProject(projectId) {

    const { data: criteria, error } = await supabase
        .from('project_criteria')
        .select('*')
        .eq('project_id', projectId);
    
    if (error) throw error;

    // Transform the data into the expected format with grouped categories
    return {
        inclusion_criteria: groupCriteriaByCategory(criteria.filter(c => c.is_inclusion)),
        exclusion_criteria: groupCriteriaByCategory(criteria.filter(c => !c.is_inclusion))
    };
}

// Helper function to group criteria by category
function groupCriteriaByCategory(criteria) {
    const categorizedCriteria = criteria.reduce((acc, criterion) => {
        const category = criterion.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            id: criterion.criteria_id,
            text: criterion.criteria_text,
            category: criterion.category
        });
        return acc;
    }, {});

    return Object.entries(categorizedCriteria).map(([category, items]) => ({
        category,
        items
    }));
}

// Create a new criterion
export async function createCriterion(projectId, criterionData) {
    const { data, error } = await supabase
        .from('project_criteria')
        .insert([{
            project_id: projectId,
            ...criterionData
        }])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

// Update an existing criterion
export async function updateCriterion(criterionId, criterionData) {
    const { data, error } = await supabase
        .from('project_criteria')
        .update(criterionData)
        .eq('criteria_id', criterionId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

// Delete a criterion
export async function deleteCriterion(criterionId) {
    const { error } = await supabase
        .from('project_criteria')
        .delete()
        .eq('criteria_id', criterionId);
    
    if (error) throw error;
    return true;
}