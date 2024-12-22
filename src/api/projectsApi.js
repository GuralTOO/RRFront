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



export const getCriteriaForProject = async (projectId) => {
    try {
      // First, get the project details to access the research question
      const projectDetails = await getProjectDetails(projectId);

      // Validate research question exists before making the request
      if (!projectDetails?.researchQuestion) {
        throw new Error('Research question is required but was not found in project details');
      }
  
      // Instead of making the API call, use hardcoded data
      const data = {
        "inclusion_criteria": [
          {
            "Population": [
              "Patients diagnosed with any of the following conditions: Heat related illness, Stroke, Transient Ischemic Attack, Sepsis, Malignant Hyperthermia, Neuroleptic Malignant Syndrome, bacterial CNS infections, viral CNS infections, fungal CNS infections, Acute intoxication, Muscle relaxant withdrawal, Head injury, or Thyroid storm.",
              "Adults (≥18 years old) or pediatric patients (if specified in the study)."
            ]
          },
          {
            "Intervention": [
              "Studies that evaluate the use of cooling interventions, including but not limited to surface cooling, endovascular cooling, evaporative cooling, or other temperature-lowering techniques."
            ]
          },
          {
            "Outcomes": [
              "Studies reporting health outcomes such as mortality, neurological recovery, organ function, length of hospital stay, or other clinically relevant outcomes related to the intervention."
            ]
          },
          {
            "Study Design": [
              "Randomized controlled trials (RCTs), cohort studies, case-control studies, or systematic reviews/meta-analyses.",
              "Published in peer-reviewed journals."
            ]
          },
          {
            "Language and Timeframe": [
              "Studies published in English.",
              "Studies published within the last 20 years (2003–2023)."
            ]
          }
        ],
        "exclusion_criteria": [
          {
            "Population": [
              "Patients without a confirmed diagnosis of any of the specified conditions.",
              "Animal studies or in vitro studies."
            ]
          },
          {
            "Intervention": [
              "Studies that do not involve cooling interventions or focus on unrelated treatments.",
              "Studies where cooling is used for conditions outside the scope of the research question (e.g., post-cardiac arrest cooling)."
            ]
          },
          {
            "Outcomes": [
              "Studies that do not report health outcomes related to cooling interventions.",
              "Studies focusing solely on surrogate markers (e.g., temperature reduction) without clinical outcomes."
            ]
          },
          {
            "Study Design": [
              "Case reports, editorials, commentaries, or opinion pieces.",
              "Studies with insufficient methodological quality or incomplete data."
            ]
          },
          {
            "Language and Timeframe": [
              "Studies not published in English.",
              "Studies published before 2003."
            ]
          }
        ]
      };
  
      // Validate the response structure
      if (!data.inclusion_criteria || !data.exclusion_criteria) {
        console.error('Invalid data structure received:', data);
        throw new Error('Invalid criteria data structure received from service');
      }
  
      return {
        inclusion_criteria: data.inclusion_criteria,
        exclusion_criteria: data.exclusion_criteria
      };
    } catch (error) {
      console.error('Error in getCriteriaForProject:', error);
      throw new Error(`Failed to generate criteria: ${error.message}`);
    }
  };

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
        //console.log('No change in value, skipping update');
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
        //console.log('Project ID:', projectId);
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
    //console.log('Fetching project users for project:', projectId);
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


// fake functions begin
// export const getNextPaperForFullTextReview = async (projectId) => {
//     // This is a sample return format matching what we need for the UI
//     const { data: folders, error: foldersError } = await supabase
//         .storage
//         .from('paper_pdfs')
//         .list();

//     console.log("Folders/files:", folders);



//     const paper = {
//         paper_id: "05978224-a60e-4dc2-9993-c3f1a1dbcd71",
//         title: "Effect of Exercise on Cognitive Function in Older Adults",
//         authors: "Smith J, Johnson M, Williams K",
//         publication_date: "2023-06-15",
//         abstract: "Background: Aging populations face increasing cognitive decline...",
//         full_text_url: "https://ihyuiglrcitnuurezypc.supabase.co/storage/v1/object/public/paper_pdfs/05978224-a60e-4dc2-9993-c3f1a1dbcd71.pdf",
//         doi: "10.1234/sample.123",
//         keywords: ["cognitive function", "exercise", "aging"]
//     }
//     // return paper;
//     if (paper) {
//         // Get a signed URL for the PDF
//         const { data: signedUrl, error: signError } = await supabase
//             .storage
//             .from('paper_pdfs')
//             .createSignedUrl(`${paper.paper_id}.pdf`, 3600); // 1 hour expiry

//         if (signError) {

//             // log the details of the error
//             console.error('Error signing URL:', signError);
//             console.log("the target file name was:", `${paper.paper_id}.pdf`);
//             throw signError;
//         }

//         return {
//             ...paper,
//             full_text_url: signedUrl.signedUrl
//         };
//     }
//     return null;
// };

export const getNextPaperForFullTextReview = async (projectId) => {
    //console.log(`Starting getNextPaperForFullTextReview for projectId: ${projectId}`);
    try {
      //console.log('Fetching stage IDs for abstract_screening and full_text_review...');
      const { data: stageData, error: stageError } = await supabase
        .from('stages')
        .select('stage_id, stage_name')
        .in('stage_name', ['abstract_screening', 'full_text_review']);

      if (stageError) {
        console.error('Error fetching stages:', stageError);
        throw new Error('Failed to fetch stages');
      }
      //console.log('Successfully fetched stage data:', stageData);

      const abstractStageId = stageData.find(s => s.stage_name === 'abstract_screening')?.stage_id;
      const fullTextStageId = stageData.find(s => s.stage_name === 'full_text_review')?.stage_id;
      //console.log(`Found stage IDs - Abstract: ${abstractStageId}, Full Text: ${fullTextStageId}`);

      //console.log('Fetching papers with existing full text decisions...');
      const { data: fullTextPapers, error: fullTextError } = await supabase
        .from('paper_decisions')
        .select('paper_id')
        .eq('project_id', projectId)
        .eq('stage_id', fullTextStageId);
  
      if (fullTextError) {
        console.error('Error fetching full text papers:', fullTextError);
        return null;
      }
      //console.log(`Found ${fullTextPapers?.length || 0} papers with full text decisions`);
  
      //console.log('Fetching next paper for review from abstract screening...');
      const { data: paperData, error: paperError } = await supabase
        .from('paper_decisions')
        .select('paper_id')
        .eq('project_id', projectId)
        .eq('stage_id', abstractStageId)
        .eq('decision', 'accept')
        .limit(1);
  
      if (paperError) {
        console.error('Error fetching next paper:', paperError);
        return null;
      }
      //console.log(`Found ${paperData?.length || 0} papers needing review`);
  
      if (!paperData || paperData.length === 0) {
        //console.log('No papers found needing review');
        return null;
      }
  
      //console.log(`Fetching full details for paper_id: ${paperData[0].paper_id}`);
      const fullPaperDetails = await getPaperFullTextDetails(projectId, paperData[0].paper_id);
      //console.log('Successfully retrieved full paper details');
  
      const result = {
        paper_id: fullPaperDetails.paper_id,
        title: fullPaperDetails.title,
        authors: fullPaperDetails.authors,
        publication_date: fullPaperDetails.publication_date,
        abstract: fullPaperDetails.abstract,
        full_text_url: fullPaperDetails.full_text_url,
        doi: fullPaperDetails.doi
      };
      //console.log('Returning paper details:', { paper_id: result.paper_id, title: result.title });
      return result;
  
    } catch (error) {
      console.error('Error in getNextPaperForFullTextReview:', error);
      return null;
    }
  };




export const submitFullTextReview = async (reviewData) => {
    // For testing, just log the data
    // console.log('Submitted review:', {
    //     timestamp: new Date().toISOString(),
    //     ...reviewData
    // });

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));

    return true;
};

// fake functions end


export const getPaperFullTextDetails = async (projectId, paperId) => {
    try {
        // First get the paper details with the join to project_papers
        const { data: paperData, error: paperError } = await supabase
            .from('project_papers')
            .select(`
                comments,
                relevancy_score,
                papers (
                    paper_id,
                    title,
                    abstract,
                    authors,
                    publication_date,
                    keywords,
                    doi
                )
            `)
            .eq('paper_id', paperId)
            .eq('project_id', projectId)
            .maybeSingle();

        if (paperError) {
            throw new Error(`Database error: ${paperError.message}`);
        }

        if (!paperData || !paperData.papers) {
            throw new Error('Paper not found in database');
        }

        // Get the signed URL from our edge function
        const { data: urlData, error: urlError } = await supabase.functions.invoke('get-pdf-url', {
            body: {
                paperId,
                projectId
            }
        });

        //console.log("Edge function response:", { urlData, urlError });

        if (urlError) {
          console.error("Edge function error:", urlError);
          // Don't throw here, just continue without the URL
        }

        // Combine the database data with the URL (if available)
        const paper = {
            paper_id: paperData.papers.paper_id,
            title: paperData.papers.title,
            authors: Array.isArray(paperData.papers.authors) ? paperData.papers.authors.join(', ') : paperData.papers.authors,
            publication_date: paperData.papers.publication_date,
            abstract: paperData.papers.abstract,
            comments: paperData.comments || '',
            full_text_url: urlData?.url || null,
            doi: paperData.papers.doi,
            project_id: projectId,
            relevancy_score: paperData.relevancy_score,
            has_pdf: Boolean(urlData?.url) // Add flag to indicate if PDF is available
        };
        //console.log("Paper info: ", paper);
        return paper;
    } catch (error) {
        console.error('Error fetching paper details:', error);
        throw error;
    }
};

export const uploadPaperPDF = async (projectId, paperId, file) => {
  try {
    // Validate file type and size
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    // Maximum file size (20MB)
    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 20MB');
    }

    // Convert file to base64
    const base64File = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });

    // Call the edge function to upload the PDF
    const { data, error } = await supabase.functions.invoke('upload-paper-pdf-gc', {
      body: {
        projectId,
        paperId,
        fileContent: base64File
      }
    });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};


/*


# Grant the service account access to the bucket
gcloud storage buckets add-iam-policy-binding gs://full-text-pdfs \
    --member="serviceAccount:supabase-pdf-access@exp001-429822.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"


# Create and download the key file
gcloud iam service-accounts keys create supabase-pdf-access-key.json \
    --iam-account=supabase-pdf-access@exp001-429822.iam.gserviceaccount.com

# Using Supabase CLI
supabase secrets set GOOGLE_CLOUD_PROJECT_ID="exp001-429822"

# Give supabase access to the storage bucket to read the files
supabase secrets set GCS_PDF_READER_CREDENTIALS="$(cat supabase-pdf-access-key.json)"



"https://storage.googleapis.com/full-text-pdfs/6b7b7f65-6eaf-4e05-a127-a75d9181b830/16ae6214-7f3c-4776-86d0-c0cced1296d1?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=supabase-pdf-access%40exp001-429822.iam.gserviceaccount.com%2F20241206%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241206T171618Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=7a509e0bab5783813a53e1d8a832b839d521b3d5dd999b472ab9307d5dd0b580ed1f0b7540900c400d2cb397e5208ad54f8434ceda163eab11195a84fdb0a46f6c6db90393255790c20252d80e631af44f3569ce6a231ce5ed64ec0f3223549bad22481d412a9a79b54a94f3376a1ab59e201174048ccfa9ebc50faa2050377c70c1f87ef2728dfbf88e3d14932c78fc304de6057eabef479bfcd04dc15ff060214caca7272f9a85e3273ed697b88ee2289e4145bab023588bbcb3bd71a7c03db3e2861253e059abbb4b9967a0865bb41107998fb52bbfbd39ce934373aee2a3d4f013b706c93020f6b0cf0397d356aea44a66db60da01491018ff010ec10911"

*/