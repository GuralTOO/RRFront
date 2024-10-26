import { supabase } from '../supabaseClient';

/**
 * Get all analytics data for a project
 * @param {string} projectId - UUID of the project
 */
export async function getProjectAnalytics(projectId) {
    try {
        const [
            basicStats,
            reviewProgress,
            conflictStats
        ] = await Promise.all([
            getBasicStats(projectId),
            getReviewProgress(projectId),
            getConflictStats(projectId)
        ]);

        return {
            ...basicStats,
            ...reviewProgress,
            ...conflictStats
        };
    } catch (error) {
        console.error('Error fetching project analytics:', error);
        throw error;
    }
}

/**
 * Get basic project statistics
 */
async function getBasicStats(projectId) {
    // Get total papers
    const { count: totalPapers, error: papersError } = await supabase
        .from('project_papers')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId);

    if (papersError) throw papersError;

    // Get active reviewers in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: reviewers, error: reviewersError } = await supabase
        .from('paper_reviews')
        .select('reviewer_id')
        .eq('project_id', projectId)
        .gte('review_date', thirtyDaysAgo.toISOString());

    if (reviewersError) throw reviewersError;

    const activeReviewers = new Set(reviewers.map(r => r.reviewer_id)).size;

    // For now, we'll skip average review time since we don't have created_at
    // In the future, you might want to add a start_time column to track this

    return {
        totalPapers,
        activeReviewers,
        avgReviewTime: 0 // Placeholder until we have proper timing data
    };
}

/**
 * Get review progress
 */
async function getReviewProgress(projectId) {
    // Get total and reviewed papers counts
    const { count: totalPapers, error: totalError } = await supabase
        .from('project_papers')
        .select('*', { count: 'exact' })
        .eq('project_id', projectId);

    if (totalError) throw totalError;

    const { data: reviews, error: reviewsError } = await supabase
        .from('paper_reviews')
        .select('paper_id')
        .eq('project_id', projectId);

    if (reviewsError) throw reviewsError;

    const reviewedPapers = new Set(reviews.map(review => review.paper_id)).size;
    const reviewProgress = totalPapers ? Math.round((reviewedPapers / totalPapers) * 100) : 0;

    return {
        reviewProgress,
        reviewedPapers
    };
}

/**
 * Get conflict statistics
 */
async function getConflictStats(projectId) {
    const { data: conflicts, error } = await supabase
        .from('conflicts')
        .select('*')
        .eq('project_id', projectId);

    if (error) throw error;

    const totalConflicts = conflicts.length;
    const pendingConflicts = conflicts.filter(conflict => !conflict.resolution).length;
    const conflictResolution = totalConflicts
        ? Math.round(((totalConflicts - pendingConflicts) / totalConflicts) * 100)
        : 0;

    return {
        pendingConflicts,
        totalConflicts,
        conflictResolution
    };
}

/**
 * Export project data
 */
export async function exportProjectData(projectId) {
    const { data: papers, error } = await supabase
        .from('papers')
        .select(`
            title,
            abstract,
            authors,
            publication_date,
            doi,
            project_papers!inner(
                relevancy_score,
                comments,
                project_id
            ),
            paper_reviews(
                decision,
                review_date,
                reviewer_id
            )
        `)
        .eq('project_papers.project_id', projectId);

    if (error) throw error;

    // Transform data for export
    return papers.map(paper => ({
        title: paper.title,
        authors: paper.authors?.join('; ') || '',
        publicationDate: paper.publication_date,
        doi: paper.doi,
        relevancyScore: paper.project_papers[0].relevancy_score,
        comments: paper.project_papers[0].comments,
        reviews: paper.paper_reviews.map(review => ({
            reviewerId: review.reviewer_id,
            decision: review.decision,
            date: review.review_date
        }))
    }));
}