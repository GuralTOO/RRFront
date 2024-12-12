import { supabase } from "@/supabaseClient";

export async function addReview(projectId, paperId, decision, stage_name) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    //console.log(`Adding review for paper ${paperId} in project ${projectId} by user ${user.id}. Decision: ${decision}`);

    // enforce that the review is one of the allowed values
    if (!['accept', 'reject', 'skip'].includes(decision)) {
        throw new Error('Invalid review value');
    }
    // First, get the stage_id from stage_name
    const { data: stageData, error: stageError } = await supabase
        .from('stages')
        .select('stage_id')
        .eq('stage_name', stage_name)
        .single();

    if (stageError) {
        console.error('Error getting stage:', stageError);
        throw new Error('Failed to get stage');
    }

    // Add the review
    const { data, error } = await supabase
        .from('paper_reviews')
        .insert({
            project_id: projectId,
            paper_id: paperId,
            reviewer_id: user.id,
            decision: decision,
            review_date: new Date().toISOString(),
            stage_id: stageData.stage_id
        })
        .select('review_id');

    if (error) {
        console.error('Error adding review:', error);
        throw new Error('Failed to add review');
    }

    const review_id = data[0].review_id;

    // Check for conflicts
    const { data: conflictData, error: conflictError } = await supabase
        .rpc('check_for_conflict', { p_review_id: review_id });

    if (conflictError) {
        console.error('Error checking review conflict:', conflictError);
        throw new Error('Failed to check review conflict');
    }

    // Handle the case where conflictData is an array with one element
    const hasConflict = conflictData[0]?.has_conflict ?? false;

    // If no conflict, try to create consensus decision
    if (!hasConflict) {
        const { data: decisionData, error: decisionError } = await supabase
            .rpc('try_create_consensus_decision', {
                p_project_id: projectId,
                p_paper_id: paperId,
                p_stage_id: stageData.stage_id
            });

        if (decisionError) {
            console.error('Error creating decision:', decisionError);
            // Don't throw here - the review was still added successfully
        }
    }

    return {
        review_id: review_id,
        has_conflict: hasConflict,
        conflict_id: conflictData[0]?.conflict_id
    };

    // TODO: Add the concept of stages to the conflicts
}

export async function resolveConflict(conflict_id, resolution) {

    // get the uuid of the current user
    //console.log(`Resolving conflict ${conflict_id} with resolution ${resolution}`);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user logged in');

    // Get conflict details first
    const { data: conflictData, error: conflictError } = await supabase
        .from('conflicts')
        .select('project_id, paper_id')
        .eq('conflict_id', conflictId)
        .single();

    if (conflictError) {
        console.error('Error getting conflict:', conflictError);
        throw new Error('Failed to get conflict details');
    }

    // update the conflicts table with the resolution
    const { error: updateError } = await supabase
        .from('conflicts')
        .update({ resolution: resolution, resolver_id: user.id })
        .eq('conflict_id', conflict_id);

    if (updateError) {
        console.error('Error updating conflict:', updateError);
        throw new Error('Failed to update conflict');
    }

    // Create decision based on resolution
    const { data: decisionData, error: decisionError } = await supabase
        .rpc('create_resolution_decision', {
            p_project_id: conflictData.project_id,
            p_paper_id: conflictData.paper_id,
            p_resolution: resolution
        });

    if (decisionError) {
        console.error('Error creating decision:', decisionError);
        throw new Error('Failed to create decision');
    }

    return decisionData;
}

export async function getConflictPaper() {
    try {
        // Step 1: Get the earliest unresolved conflict
        const { data: conflictData, error: conflictError } = await supabase
            .from('conflicts')
            .select('conflict_id, project_id, paper_id')
            .is('resolution', null)
            .order('created_at', { ascending: true })
            .limit(1);

        if (conflictError) {
            console.error('Error fetching conflict:', conflictError);
            throw new Error('Failed to fetch conflict');
        }

        if (!conflictData || conflictData.length === 0) {
            return null; // No unresolved conflicts found
        }

        // Step 2: Get paper details using a join
        const { data: paperData, error: paperError } = await supabase  // Note: destructure to data and error, not paper_data and paper_error
            .from('papers')
            .select(`
                *,
                project_papers!inner(
                    relevancy_score,
                    created_at
                )
            `)
            .eq('paper_id', conflictData[0].paper_id)
            .eq('project_papers.project_id', conflictData[0].project_id)
            .single();  // Since we're expecting a single result

        if (paperError) {
            console.error('Error fetching paper data:', paperError);
            throw new Error('Failed to fetch paper data');
        }

        // Step 3: Format the response
        const formattedResponse = {
            ...paperData,
            relevancy_score: paperData.project_papers.relevancy_score,
            conflict_id: conflictData[0].conflict_id,
            project_id: conflictData[0].project_id,
            conflict_id: conflictData[0].conflict_id,
        };

        // Remove the nested project_papers object
        delete formattedResponse.project_papers;
        //console.log('Conflict paper:', formattedResponse);
        return formattedResponse;

    } catch (error) {
        console.error('Error in getConflictPaper:', error);
        throw error;
    }
}


export async function listConflicts(projectId) {
    const { data, error } = await supabase
        .from('conflicts')
        .select(`
      conflict_id,
      created_at,
      project_id,
      paper_id,
      papers:paper_id (title)
    `)
        .eq('project_id', projectId)
        .is('resolution', null);  // Add this constraint to only get unresolved conflicts


    if (error) {
        console.error('Error fetching conflicts:', error);
        throw new Error('Failed to fetch conflicts');
    }

    // Flatten the nested paper data
    const flattenedData = data.map(conflict => ({
        ...conflict,
        paper_title: conflict.papers.title
    }));

    return flattenedData;

}

export async function getReviews(project_id, paper_id) {

    // retrieve all of the reviews for the paper in the project from the paper_reviews table
    const { data: reviewsData, error: reviewsError } = await supabase
        .from('paper_reviews')
        .select('review_id, reviewer_id, decision, review_date')
        .eq('project_id', project_id)
        .eq('paper_id', paper_id);

    if (reviewsError) {
        console.error('Error fetching reviews data:', reviewsError);
        throw new Error('Failed to fetch reviews data');
    }

    return reviewsData;
}

// curl -H "Content-Type: application/json" -d '{"title":"test", "abstract":"test", "class_name" : "test"}' https://process-metadata-embedding-w2ogqlksoa-uc.a.run.app


/*
*/