import { supabase } from "@/supabaseClient";

export async function addReview(projectId, paperId, decision) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    console.log(`Adding review for paper ${paperId} in project ${projectId} by user ${user.id}. Decision: ${decision}`);
    // enforce that the review is one of the allowed values
    if (!['accept', 'reject', 'skip'].includes(decision)) {
        throw new Error('Invalid review value');
    }

    const { error } = await supabase
        .from('paper_reviews')
        .insert([
            {
                project_id: projectId,
                paper_id: paperId,
                reviewer_id: user.id,
                decision: decision
            }
        ]);

    if (error) throw error;
}

// curl -H "Content-Type: application/json" -d '{"title":"test", "abstract":"test", "class_name" : "test"}' https://process-metadata-embedding-w2ogqlksoa-uc.a.run.app
