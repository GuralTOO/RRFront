import { supabase } from '../supabaseClient';

export async function getUserProjects() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No user logged in');

    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
      project_id,
      name,
      research_question,
      created_at,
      user_projects!inner(role)
    `)
        .eq('user_projects.user_id', user.id)
        .order('created_at', { ascending: false });

    if (projectsError) throw projectsError;

    // Fetch paper counts for each project
    const paperCounts = await Promise.all(projects.map(async (project) => {
        const { count, error: countError } = await supabase
            .from('project_papers')
            .select('paper_id', { count: 'exact' })
            .eq('project_id', project.project_id);

        if (countError) throw countError;

        return { project_id: project.project_id, count };
    }));

    // Combine project data with paper counts
    return projects.map(project => {
        const paperCount = paperCounts.find(pc => pc.project_id === project.project_id)?.count || 0;
        return {
            id: project.project_id,
            name: project.name,
            researchQuestion: project.research_question,
            papers: paperCount,
            role: project.user_projects[0].role,
            progress: 0 // Placeholder, calculate this based on your logic
        };
    });
}


export async function createNewProject(projectName, researchQuestion) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No user logged in');

    // Start a transaction
    const { data, error } = await supabase.rpc('create_project_and_assign_admin', {
        p_name: projectName,
        p_research_question: researchQuestion,
        p_user_id: user.id
    });

    if (error) throw error;

    return data;
}


export async function getProjectDetails(projectId) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('No user logged in');

    // Fetch project details
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
      project_id,
      name,
      research_question,
      created_at,
      keywords,
      user_projects!inner(role)
    `)
        .eq('project_id', projectId);

    if (projectsError) throw projectsError;

    // Fetch paper counts for the project
    const { count, error: countError } = await supabase
        .from('project_papers')
        .select('paper_id', { count: 'exact' })
        .eq('project_id', projectId);

    if (countError) throw countError;

    return {
        id: projects[0].project_id,
        name: projects[0].name,
        researchQuestion: projects[0].research_question,
        keywords: projects[0].keywords,
        papers: count,
        role: projects[0].user_projects[0].role,
        progress: 0 // Placeholder, calculate this based on your logic
    };
}



// Edit project API
const VALID_FIELDS = ['name', 'research_question', 'keywords'];
const FIELD_MAP = {
    researchQuestion: 'research_question',
    // Add more mappings as needed
};

export async function editProject(projectId, field, value) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    // Check if the project exists and if the user has permission to edit it
    const { data: userProject, error: userProjectError } = await supabase
        .from('user_projects')
        .select('role, projects!inner(*)') // Join with projects table
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single();

    if (userProjectError) throw new Error(`Error checking project: ${userProjectError.message}`);
    if (!userProject) throw new Error('Project not found or user does not have access');
    if (userProject.role !== 'admin') throw new Error('User does not have permission to edit this project');

    // Validate and map the field
    const dbField = FIELD_MAP[field] || field;
    if (!VALID_FIELDS.includes(dbField)) {
        throw new Error(`Invalid field: ${field}`);
    }

    // Check if the new value is different from the current value
    if (userProject.projects[dbField] === value) {
        console.log('No change in value, skipping update');
        return userProject.projects; // Return current project data
    }

    // Update the project
    const { data, error } = await supabase
        .from('projects')
        .update({ [dbField]: value })
        .eq('project_id', projectId)
        .select()

    if (error) throw new Error(`Error updating project: ${error.message}`);
    if (!data || data.length === 0) {
        console.error('Update did not affect any rows');
        console.log('Project ID:', projectId);
        throw new Error('Project could not be updated. This might be due to permissions or the project no longer existing.');
    }

    return data[0]; // Return the updated project data
}