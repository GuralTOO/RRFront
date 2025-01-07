import { supabase } from "@/supabaseClient";


export async function getPaperDetails(paperId) {
    const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('paper_id', paperId)
        .single();
    if (error) {
        console.error('Error fetching paper:', error);
        throw error;
    }

    return data;
}

export async function getUnreviewedPapers(projectId, orderBy = 'created_at', ascending = true, page = 1, pageSize = 50) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');


    // console.log("Getting unreviewed papers for project", projectId);
    // console.log("Order by:", orderBy, ascending ? 'ASC' : 'DESC');
    // Validate orderBy to prevent SQL injection
    const validOrderColumns = ['created_at', 'title', 'relevancy_score', 'publication_date'];
    if (!validOrderColumns.includes(orderBy)) {
        // console.log("Received invalid order column: ", orderBy);
        throw new Error('Invalid order column');
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('project_papers')
        .select(`
        papers!inner(
        paper_id,
        title,
        abstract,
        authors,
        publication_date,
        full_text_url
      ),
      relevancy_score,
      created_at
    `, { count: 'exact' })
        .eq('project_id', projectId);

    // Handle ordering
    if (orderBy === 'title' || orderBy === 'publication_date') {
        // For title and publication_date, we need t order by the column in the papers table
        query = query.order(`papers(${orderBy})`, { ascending: ascending });
    }
    else {
        // For other columns, we can order directly
        query = query.order(orderBy, { ascending: ascending });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data: allPapers, error: papersError, count } = await query;

    if (papersError) throw papersError;

    // Step 2: Fetch the paper IDs that the user has already reviewed
    const { data: reviewedPapers, error: reviewError } = await supabase
        .from('paper_reviews')
        .select('paper_id')
        .eq('reviewer_id', user.id)
        .eq('project_id', projectId);

    if (reviewError) throw reviewError;

    const reviewedPaperIds = new Set(reviewedPapers.map(review => review.paper_id));

    // Step 3: Filter out the reviewed papers
    const unreviewedPapers = allPapers.filter(paper => !reviewedPaperIds.has(paper.papers.paper_id));

    // console.log('Unreviewed papers:', unreviewedPapers);
    return {
        data: unreviewedPapers.map(item => ({
            ...item.papers,
            relevancy_score: item.relevancy_score,
            created_at: item.created_at
        })),
        totalCount: count - reviewedPaperIds.size
    };
}



export async function getFilteredPapers(
    projectId,
    filterDecision = 'all',
    orderBy = 'created_at',
    ascending = true,
    page = 1,
    pageSize = 50
) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    // console.log("Getting filtered papers for project", projectId, "with decision", filterDecision);
    // console.log("Order by:", orderBy, ascending ? 'ASC' : 'DESC');

    const validOrderColumns = ['created_at', 'title', 'relevancy_score', 'publication_date'];
    if (!validOrderColumns.includes(orderBy)) {
        // console.log("Received invalid order column: ", orderBy);
        throw new Error('Invalid order column');
    }

    // First, get all review decisions for the project
    const { data: reviews, error: reviewsError } = await supabase
        .from('paper_reviews')
        .select('paper_id, decision')
        .eq('reviewer_id', user.id)
        .eq('project_id', projectId);

    if (reviewsError) throw reviewsError;

    // Create a map of paper_id to review decision
    const reviewDecisionMap = reviews.reduce((map, review) => {
        map[review.paper_id] = review.decision;
        return map;
    }, {});

    // Build the main query
    let query = supabase
        .from('project_papers')
        .select(`
            papers!inner(
                paper_id,
                title,
                abstract,
                authors,
                publication_date,
                full_text_url
            ),
            relevancy_score,
            created_at,
            paper_id
        `, { count: 'exact' })
        .eq('project_id', projectId);

    // If filtering by decision, add appropriate paper IDs filter
    if (filterDecision !== 'all') {
        const matchingPaperIds = Object.entries(reviewDecisionMap)
            .filter(([_, decision]) => {
                if (filterDecision === 'unreviewed') {
                    return !decision;
                }
                return decision === filterDecision;
            })
            .map(([paperId]) => paperId);

        if (filterDecision === 'unreviewed') {
            // For unreviewed, include papers NOT in the reviews
            query = query.not('paper_id', 'in', Object.keys(reviewDecisionMap));
        } else {
            // For other decisions, include only papers with matching decisions
            query = query.in('paper_id', matchingPaperIds);
        }
    }

    // Handle ordering with proper syntax for foreign tables
    if (orderBy === 'title') {
        query = query.order('papers(title)', { ascending });
    } else if (orderBy === 'publication_date') {
        query = query.order('papers(publication_date)', { ascending });
    } else {
        // For columns in the main table
        query = query.order(orderBy, { ascending });
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute query
    const { data: projectPapers, error: papersError, count } = await query;
    if (papersError) throw papersError;

    // Format the response
    const formattedPapers = projectPapers.map(item => ({
        ...item.papers,
        relevancy_score: item.relevancy_score,
        created_at: item.created_at,
        review_decision: reviewDecisionMap[item.paper_id] || 'unreviewed'
    }));

    return {
        data: formattedPapers,
        totalCount: count
    };
}

export async function addPaper(paperData, projectId) {
    // Call the Supabase stored procedure to add a paper to the papers table and then to the project table
    // create the variable to store the paper id
    let paper_id = null;
    addPaperToDatabase(paperData, projectId).then((data) => {
        paper_id = data.paper_id;
        // console.log('Paper added to the db:', data);
    }).catch((error) => {
        console.error('Error adding paper:', error);
        return error;
    }).then(() => {
        // Calculate the relevancy score for the paper
        if (paper_id) {
            calculateRelevancyScore(paper_id, projectId).then((data) => {
                // console.log('Relevancy score calculated:', data);
            }).catch((error) => {
                console.error('Error calculating relevancy score:', error);
            });
        }
    }).catch((error) => {
        console.error('Error adding paper:', error);
        return error;
    }).then(() => {
        return paper_id;
    }
    );
}

export async function calculateRelevancyScore(paperId, projectId) {
    // console.log('Calculating relevancy score for paper', paperId, 'in project', projectId);
    const { data, error } = await supabase.functions.invoke('calculate_relevancy_score', {
        body: {
            paper_id: paperId,
            project_id: projectId
        }
    });

    if (error) {
        console.error('Error calling calculate_relevancy_score:', error);
        throw error;
    }

    return data;
}

export async function massUpdateRelevancyScores(projectId) {

    const { data, error } = await supabase
        .rpc('reset_project_relevancy_scores', { project_uuid: projectId });

    if (error) {
        console.error('Error calling reset_project_relevancy_scores:', error);
        throw error;
    }

    const { invoke_data, invoke_error } = await supabase.functions.invoke('trigger-gcp-batch-scoring',
        {
            body: {
                projectId: projectId
            },
        })

    if (invoke_error) {
        console.error('Error calling trigger-gcp-batch-scoring:', invoke_error);
        throw invoke_error;
    }

}

// Calls the Supabase stored procedure to add a paper to the papers table and then to the project table
export async function addPaperToDatabase(paperData, projectId, relevancyScore = null) {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user logged in');

    // Start a Supabase transaction
    const { data, error } = await supabase.rpc('add_paper_to_project', {
        p_title: paperData.title,
        p_abstract: paperData.abstract,
        p_authors: paperData.authors || null,
        p_publication_date: paperData.publicationDate || null,
        p_full_text_url: paperData.full_text_url || null,
        p_project_id: projectId,
        p_relevancy_score: relevancyScore
    });

    if (error) throw error;

    // Trigger the retrieve-full-text function
    // Fire and forget - we don't need to wait for the result
    supabase.functions.invoke('retrieve-full-text', {
        body: { projectId }
    }).catch(error => {
        console.error('Error initiating full-text retrieval:', error);
    });

    // If successful, return the new paper data
    return {
        paper_id: data.paper_id,
        ...paperData,
        relevancy_score: relevancyScore,
        created_at: new Date().toISOString()
    };
}

export const uploadImportFile = async (file, projectId, fileType) => {
    try {
        // Get the current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
            throw new Error('No active session. User must be authenticated.');
        }

        const filePath = `${projectId}/${file.name}`;


        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from('csv-uploads')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading file:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw error;
        }

        // Save the data to the database:
        // Get the current user's ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Create the initial import file record
        const { data: importRecord, error: importError } = await supabase
            .from('reference_imports')
            .insert({
                project_id: projectId,
                user_id: user.id,
                file_bucket: 'csv-uploads',
                file_path: filePath,
                // Initialize counters to 0 - they will be updated by the cloud function
                deduplication_total: 0,
                deduplication_file: 0,
                deduplication_project: 0,
                paper_total: 0,
                paper_new: 0
            })
            .select()
            .single();

        if (importError) throw importError;
        console.log('Import record created:', importRecord);

        const cloudFunctionUrl = 'https://us-central1-exp001-429822.cloudfunctions.net/reference-importer';

        const response = await fetch(cloudFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId,
                bucket: 'csv-uploads',
                filePath,
                fileType
                // add the import_id to the request body
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error from cloud function:', errorText);
            throw new Error(`Cloud function error: ${response.status} ${response.statusText}`);
        }

        const functionData = await response.json();

        // log success if the function was called successfully
        // console.log('Function call successful:', functionData);
        return functionData;

    } catch (error) {
        console.error('Error in uploadImportFile:', error);
        throw error;
    }
};



export const getPaperNotes = async (projectId, paperId) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('paper_notes')
      .select('content')
      .match({
        project_id: projectId,
        paper_id: paperId,
        user_id: user.id
      })
      .maybeSingle();

    if (error) throw error;
    return data;
};

export const savePaperNotes = async (projectId, paperId, content) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('paper_notes')
      .upsert({
        project_id: projectId,
        paper_id: paperId,
        user_id: user.id,
        content: content
      }, {
        onConflict: 'project_id,paper_id,user_id'
      });

    if (error) throw error;
    return data;
};