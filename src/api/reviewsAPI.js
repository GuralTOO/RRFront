import { supabase } from "@/supabaseClient";
import { getPaperDetails } from "./papersApi";

export async function addReview(projectId, paperId, decision) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    console.log(`Adding review for paper ${paperId} in project ${projectId} by user ${user.id}. Decision: ${decision}`);
    // enforce that the review is one of the allowed values
    if (!['accept', 'reject', 'skip'].includes(decision)) {
        throw new Error('Invalid review value');
    }

    const { data, error } = await supabase
        .from('paper_reviews')
        .insert({ project_id: projectId, paper_id: paperId, reviewer_id: user.id, decision: decision }).select('review_id');

    if (error) {
        console.error('Error adding review:', error);
        throw new Error('Failed to add review');
    }
    const review_id = data[0].review_id;

    // call the rpc function to see if the review causes a conflict
    const { data: conflictData, error: conflictError } = await supabase.rpc('check_for_conflict', { p_review_id: review_id });
    if (conflictError) {
        console.error('Error checking review conflict:', conflictError);
        throw new Error('Failed to check review conflict');
    }
    console.log('Conflict data:', conflictData);

}

export async function resolveConflict(conflict_id, resolution) {
    // get the uuid of the current user

    console.log(`Resolving conflict ${conflict_id} with resolution ${resolution}`);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user logged in');

    console.log('User:', user);
    // update the conflicts table with the resolution
    const { data, error } = await supabase
        .from('conflicts')
        .update({ resolution: resolution, resolver_id: user.id })
        .eq('conflict_id', conflict_id);

    if (error) {
        console.error('Error resolving conflict:', error);
        throw error;
    }
    return data;
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
        console.log('Conflict paper:', formattedResponse);
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