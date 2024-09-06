import { supabase } from "@/supabaseClient";
import { add } from "date-fns";

export async function getUnreviewedPapers(projectId, orderBy = 'created_at', ascending = true, page = 1, pageSize = 50) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');


    console.log("Getting unreviewed papers for project", projectId);
    console.log("Order by:", orderBy, ascending ? 'ASC' : 'DESC');
    // Validate orderBy to prevent SQL injection
    const validOrderColumns = ['created_at', 'title', 'relevancy_score', 'publication_date'];
    if (!validOrderColumns.includes(orderBy)) {
        console.log("Received invalid order column: ", orderBy);
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

    console.log('Unreviewed papers:', unreviewedPapers);
    return {
        data: unreviewedPapers.map(item => ({
            ...item.papers,
            relevancy_score: item.relevancy_score,
            created_at: item.created_at
        })),
        totalCount: count - reviewedPaperIds.size
    };
}

export async function getFilteredPapers(projectId, filterDecision = 'all', orderBy = 'created_at', ascending = true, page = 1, pageSize = 50) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    console.log("Getting filtered papers for project", projectId, "with decision", filterDecision);
    console.log("Order by:", orderBy, ascending ? 'ASC' : 'DESC');

    const validOrderColumns = ['created_at', 'title', 'relevancy_score', 'publication_date'];
    if (!validOrderColumns.includes(orderBy)) {
        console.log("Received invalid order column: ", orderBy);
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
        created_at,
        paper_id
      `, { count: 'exact' })
        .eq('project_id', projectId);

    // Handle ordering
    if (orderBy === 'title' || orderBy === 'publication_date') {
        query = query.order(`papers.${orderBy}`, { ascending: ascending });
    } else {
        query = query.order(orderBy, { ascending: ascending });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data: projectPapers, error: papersError, count } = await query;
    if (papersError) throw papersError;

    // Fetch review decisions for these papers
    const paperIds = projectPapers.map(pp => pp.paper_id);
    const { data: reviews, error: reviewsError } = await supabase
        .from('paper_reviews')
        .select('paper_id, decision')
        .eq('reviewer_id', user.id)
        .eq('project_id', projectId)
        .in('paper_id', paperIds);

    if (reviewsError) throw reviewsError;

    // Create a map of paper_id to review decision
    const reviewDecisionMap = reviews.reduce((map, review) => {
        map[review.paper_id] = review.decision;
        return map;
    }, {});

    // Combine paper data with review decision and apply filter
    const filteredPapers = projectPapers.map(item => ({
        ...item.papers,
        relevancy_score: item.relevancy_score,
        created_at: item.created_at,
        review_decision: reviewDecisionMap[item.paper_id] || 'unreviewed'
    })).filter(paper => {
        if (filterDecision === 'all') {
            return true; // Include all papers
        } else if (filterDecision === 'unreviewed') {
            return paper.review_decision === 'unreviewed';
        } else {
            return paper.review_decision === filterDecision;
        }
    });

    console.log('Filtered papers:', filteredPapers);

    return {
        data: filteredPapers,
        totalCount: filteredPapers.length
    };
}

export async function addPaper(paperData, projectId) {
    // Call the Supabase stored procedure to add a paper to the papers table and then to the project table
    // create the variable to store the paper id
    let paper_id = null;
    addPaperToDatabase(paperData, projectId).then((data) => {
        paper_id = data.paper_id;
        console.log('Paper added to the db:', data);
    }).catch((error) => {
        console.error('Error adding paper:', error);
    });
    calculateRelevancyScore(paper_id, projectId).then((data) => {
        console.log('Relevancy score calculated and database updated.');
    }).catch((error) => {
        console.error('Error calculating relevancy score:', error);
    });
    return paper_id;
}

export async function calculateRelevancyScore(paperId, projectId) {
    // Call the supabase cloud function to calculate the relevancy score
    return await supabase.functions.invoke('calculate_relevancy_score', {
        body: {
            paper_id: paperId,
            project_id: projectId
        }
    });
}

export async function massUpdateRelevancyScores(projectId) {
    // Fetch all the papers for the project
    const { data: papers, error: papersError } = await supabase
        .from('project_papers')
        .select('paper_id')
        .eq('project_id', projectId);
    // Call the supabase cloud function to calculate the relevancy score using the pairs of paper_id and project_id
    papers.forEach(async (paper) => {
        await calculateRelevancyScore(paper.paper_id, projectId);
    });
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

    // If successful, return the new paper data
    return {
        paper_id: data.paper_id,
        ...paperData,
        relevancy_score: relevancyScore,
        created_at: new Date().toISOString()
    };
}