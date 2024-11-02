import { date } from 'zod';
import { supabase } from '../supabaseClient';
import { massUpdateRelevancyScores } from './papersApi';

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
            date: new Date(project.created_at).toLocaleDateString(),
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
    if (userProject.role !== 'admin' && userProject.role !== 'senior') throw new Error('User does not have permission to edit this project');

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

    // if the updated fields are keywords or research_question, we have to trigger the mass relevancy score update function to update the relevancy scores of all papers in the project
    if (dbField === 'keywords' || dbField === 'research_question') {
        await massUpdateRelevancyScores(projectId);
    }

    if (!data || data.length === 0) {
        console.error('Update did not affect any rows');
        console.log('Project ID:', projectId);
        throw new Error('Project could not be updated. This might be due to permissions or the project no longer existing.');
    }

    return data[0]; // Return the updated project data
}

export async function getUserRole(projectId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { data: userProject, error: userProjectError } = await supabase
        .from('user_projects')
        .select('role')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single();

    if (userProjectError) throw new Error(`Error checking project: ${userProjectError.message}`);
    if (!userProject) throw new Error('Project not found or user does not have access');

    return userProject.role;
}

export async function inviteUserToProject(projectId, email, role) {
    // Check the profiles table to retrieve the user_id associated with the email
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();


    if (profilesError) throw new Error(`Error checking profiles: ${profilesError.message}`);
    if (!profiles) throw new Error('User not found');

    const user_id = profiles.id;

    const { data: existingUser, error: existingUserError } = await supabase
        .from('user_projects')
        .select('role')
        .eq('user_id', user_id)
        .eq('project_id', projectId)
        .maybeSingle();

    if (existingUserError) {
        throw new Error(`Error checking existing user: ${existingUserError.message}`);
    }

    if (existingUser) {
        throw new Error('User is already a member of the project');
    }
    // Add the user to the project
    const { data, error } = await supabase
        .from('user_projects')
        .insert([{ user_id, project_id: projectId, role }]);

    if (error) throw new Error(`Error inviting user: ${error.message}`);
    if (!data || data.length === 0) throw new Error('User could not be invited');

    return data[0];
}

export async function fetchProjectUsers(projectId) {
    console.log('Fetching project users for project:', projectId);
    const { data, error } = await supabase
        .from('user_projects')
        .select(`
        user_id,
        role,
        created_at,
        profiles!inner (
          username
        )
      `)
        .eq('project_id', projectId)
        .order('created_at');

    if (error) {
        console.error('Error fetching project users:', error);
        throw new Error('Failed to fetch project users');
    }

    return data.map((user, index) => ({
        id: index + 1, // Use an integer as the id
        email: user.profiles.username, // username is actually email in your case
        role: user.role,
        joinedAt: user.created_at
    }));
}


// TODO: FIX THE FUNCTIONs BELOW, change them to real ones. For now, they return fake data.
// In /api/projectsApi.ts

export const getExclusionCriteria = async (projectId) => {
    // Normally this would fetch from the database, but for testing:
    return [
        {
            criteria_id: "ec1",
            project_id: projectId,
            criterion_text: "Wrong study population (e.g., non-human subjects)"
        },
        {
            criteria_id: "ec2",
            project_id: projectId,
            criterion_text: "Incorrect study design (e.g., not a randomized controlled trial)"
        },
        {
            criteria_id: "ec3",
            project_id: projectId,
            criterion_text: "Insufficient data reported"
        },
        {
            criteria_id: "ec4",
            project_id: projectId,
            criterion_text: "Publication type not eligible (e.g., conference abstract)"
        }
    ];
};

export const getNextPaperForFullTextReview = async (projectId) => {
    // This is a sample return format matching what we need for the UI
    const { data: folders, error: foldersError } = await supabase
        .storage
        .from('paper_pdfs')
        .list();

    console.log("Folders/files:", folders);



    const paper = {
        paper_id: "05978224-a60e-4dc2-9993-c3f1a1dbcd71",
        title: "Effect of Exercise on Cognitive Function in Older Adults",
        authors: "Smith J, Johnson M, Williams K",
        publication_date: "2023-06-15",
        abstract: "Background: Aging populations face increasing cognitive decline...",
        full_text_url: "https://ihyuiglrcitnuurezypc.supabase.co/storage/v1/object/public/paper_pdfs/05978224-a60e-4dc2-9993-c3f1a1dbcd71.pdf",
        doi: "10.1234/sample.123",
        keywords: ["cognitive function", "exercise", "aging"]
    }
    // return paper;
    if (paper) {
        // Get a signed URL for the PDF
        const { data: signedUrl, error: signError } = await supabase
            .storage
            .from('paper_pdfs')
            .createSignedUrl(`${paper.paper_id}.pdf`, 3600); // 1 hour expiry

        if (signError) {

            // log the details of the error
            console.error('Error signing URL:', signError);
            console.log("the target file name was:", `${paper.paper_id}.pdf`);
            throw signError;
        }

        return {
            ...paper,
            full_text_url: signedUrl.signedUrl
        };
    }
    return null;
};

export const submitFullTextReview = async (reviewData) => {
    // For testing, just log the data
    console.log('Submitted review:', {
        timestamp: new Date().toISOString(),
        ...reviewData
    });

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));

    return true;
};