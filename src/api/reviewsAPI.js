import { supabase } from "@/supabaseClient";


export async function generateReviewQueue(projectId, queueSize = 10, stage_name = 'abstract_screening') {
    console.log('Starting generateReviewQueue with:', { projectId, queueSize, stage_name });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');
    console.log('Current user:', user.id);

    // First, get the stage_id for the given stage
    const { data: stageData, error: stageError } = await supabase
        .from('stages')
        .select('stage_id')
        .eq('stage_name', stage_name)
        .single();

    if (stageError) {
        console.error('Error fetching stage:', stageError);
        throw new Error('Failed to get stage information');
    }
    console.log('Found stage:', stageData);

    // Get already reviewed papers
    const { data: reviewedPapers } = await supabase
        .from('paper_reviews')
        .select('paper_id')
        .eq('reviewer_id', user.id)
        .eq('project_id', projectId)
        .eq('stage_id', stageData.stage_id);

    // Get papers with decisions
    const { data: decidedPapers } = await supabase
        .from('paper_decisions')
        .select('paper_id')
        .eq('project_id', projectId)
        .eq('stage_id', stageData.stage_id);

    // Extract paper IDs from the results
    const reviewedPaperIds = reviewedPapers?.map(p => p.paper_id) || [];
    const decidedPaperIds = decidedPapers?.map(p => p.paper_id) || [];
    
    // Combine all paper IDs to exclude
    const excludePaperIds = [...new Set([...reviewedPaperIds, ...decidedPaperIds])];

    console.log('Papers to exclude:', excludePaperIds.length);

    // Get eligible papers
    let query = supabase
        .from('project_papers')
        .select(`
            paper_id,
            relevancy_score,
            papers!inner (
                title,
                abstract,
                authors,
                publication_date
            )
        `)
        .eq('project_id', projectId)
        .order('relevancy_score', { ascending: false })
        .limit(queueSize);

    // Only add the not-in filter if there are papers to exclude
    if (excludePaperIds.length > 0) {
        query = query.not('paper_id', 'in', `(${excludePaperIds.join(',')})`);
    }

    const { data: eligiblePapers, error: eligibleError } = await query;

    if (eligibleError) {
        console.error('Error fetching eligible papers:', eligibleError);
        throw new Error('Failed to fetch eligible papers');
    }

    console.log('Query executed, found papers:', eligiblePapers?.length || 0);

    if (!eligiblePapers || eligiblePapers.length === 0) {
        console.log('No eligible papers found');
        return [];
    }

    // Format the response
    const papers = eligiblePapers.map(paper => ({
        paper_id: paper.paper_id,
        title: paper.papers.title,
        abstract: paper.papers.abstract,
        authors: paper.papers.authors,
        publication_date: paper.papers.publication_date,
        relevancy_score: paper.relevancy_score,
        project_id: projectId
    }));

    console.log('Returning formatted papers:', papers.length);
    return papers;
}

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


/*
Mock functions for testing
*/

// Mock data generator for conflicts
const generateMockConflicts = (count = 5) => {
    const samplePaperTitles = [
      "Machine Learning Applications in Healthcare: A Systematic Review",
      "Deep Learning for Medical Image Analysis: Current Trends and Future Directions",
      "Artificial Intelligence in Drug Discovery: Opportunities and Challenges",
      "Natural Language Processing for Clinical Text: A Comprehensive Survey",
      "The Impact of Neural Networks on Medical Diagnosis: A Meta-Analysis",
      "Robotic Surgery Systems: A Review of Current Technologies",
      "Predictive Analytics in Patient Care: Systematic Review and Meta-Analysis",
      "Blockchain Technology in Healthcare: Current Applications and Future Prospects",
      "Big Data Analytics for Healthcare: Challenges and Opportunities",
      "Internet of Medical Things (IoMT): A Systematic Literature Review"
    ];
  
    return Array.from({ length: count }, (_, index) => {
      // Generate a date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
      return {
        conflict_id: `conf-${Math.random().toString(36).substr(2, 9)}`,
        created_at: date.toISOString(),
        project_id: "proj-123", // This would match the projectId parameter in real usage
        paper_id: `paper-${Math.random().toString(36).substr(2, 9)}`,
        paper_title: samplePaperTitles[Math.floor(Math.random() * samplePaperTitles.length)],
        // Add any additional fields that might be needed for testing
        reviewers: [
          { id: "rev1", decision: "accept" },
          { id: "rev2", decision: "reject" }
        ]
      };
    });
  };
  
// Mock implementation of listConflicts
export async function mockListConflicts(projectId) {
// Simulate network delay
await new Promise(resolve => setTimeout(resolve, 1000));

// Randomly fail sometimes to test error handling (10% chance)
if (Math.random() < 0.1) {
    throw new Error("Random mock API error");
}

// Generate between 0 and 8 conflicts
const numberOfConflicts = Math.floor(Math.random() * 9);

return generateMockConflicts(numberOfConflicts);
}





// Mock data generators and API functions for conflicts management

// Mock data generators and API functions for conflicts management

// Function to get conflicts overview by stage
export async function getConflictsOverview(projectId) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
  
    // Generate consistent numbers for abstract screening
    const abstractActive = Math.floor(Math.random() * 10);
    const abstractResolved = Math.floor(Math.random() * 50);
    const abstractTotal = abstractActive + abstractResolved;
  
    // Generate consistent numbers for full text screening
    const fullTextActive = Math.floor(Math.random() * 8);
    const fullTextResolved = Math.floor(Math.random() * 30);
    const fullTextTotal = fullTextActive + fullTextResolved;
  
    return {
      abstract_screening: {
        stage_id: "stage-1",
        active_conflicts: abstractActive,
        resolved_conflicts: abstractResolved,
        total_conflicts: abstractTotal,
      },
      full_text_screening: {
        stage_id: "stage-2",
        active_conflicts: fullTextActive,
        resolved_conflicts: fullTextResolved,
        total_conflicts: fullTextTotal,
      }
    };
  }
  
// Function to get conflict history for a specific stage
export async function getConflictHistory(projectId, stageId, page = 1, pageSize = 10) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const samplePapers = [
        {
        title: "Deep Learning Applications in Medical Imaging",
        authors: ["Smith, J.", "Johnson, M.", "Williams, K."],
        publication_date: "2023-06-15"
        },
        {
        title: "AI-Driven Diagnostic Tools: A Systematic Review",
        authors: ["Brown, R.", "Davis, L."],
        publication_date: "2023-08-22"
        },
        {
        title: "Machine Learning in Clinical Decision Support",
        authors: ["Wilson, A.", "Taylor, S.", "Martinez, J."],
        publication_date: "2023-07-10"
        }
    ];

    const resolvers = [
        { id: "user1", username: "Dr. Sarah Wilson" },
        { id: "user2", username: "Prof. Michael Chang" },
        { id: "user3", username: "Dr. James Martinez" }
    ];

    // Generate random resolved conflicts
    const conflicts = Array.from({ length: 15 }, (_, i) => {
        const paper = samplePapers[Math.floor(Math.random() * samplePapers.length)];
        const resolver = resolvers[Math.floor(Math.random() * resolvers.length)];
        const resolution = Math.random() > 0.5 ? 'accept' : 'reject';
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        return {
        conflict_id: `conf-${i}`,
        paper_id: `paper-${i}`,
        project_id: projectId,
        stage_id: stageId,
        paper_title: paper.title,
        paper_authors: paper.authors,
        publication_date: paper.publication_date,
        resolution,
        resolution_reason: resolution === 'accept' 
            ? "Paper meets inclusion criteria and methodology is sound"
            : "Study design does not match inclusion criteria",
        resolver: resolver,
        resolution_date: date.toISOString(),
        };
    });

    // Sort by resolution date descending
    conflicts.sort((a, b) => new Date(b.resolution_date) - new Date(a.resolution_date));

    // Simulate pagination
    const start = (page - 1) * pageSize;
    const paginatedConflicts = conflicts.slice(start, start + pageSize);

    return {
        conflicts: paginatedConflicts,
        total: conflicts.length,
        page,
        pageSize,
        totalPages: Math.ceil(conflicts.length / pageSize)
    };
}

// Function to check if user can resolve conflicts
export async function canResolveConflicts(projectId) {
    // In real implementation, this would check the user's role in the project
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() > 0.3; // 70% chance of being able to resolve conflicts
    }

    // Function to start conflict resolution session
    export async function startConflictResolution(projectId, stageId) {
    // In real implementation, this would create or resume a conflict resolution session
    await new Promise(resolve => setTimeout(resolve, 500));

    if (Math.random() > 0.1) { // 90% success rate
        return {
        success: true,
        sessionId: `session-${Math.random().toString(36).substr(2, 9)}`,
        nextUrl: `/p/${projectId}/review/conflicts`
        };
    } else {
        throw new Error("Failed to start conflict resolution session");
    }
}


/*
Mock functions end
*/





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