import { supabase } from "@/supabaseClient";

export const fetchProjectImports = async (projectId) => {
    // Mock data with added user information
    // const mockData = [
    //     {
    //         id: '1',
    //         created_at: '2024-01-07T14:30:00Z',
    //         paper_new: 45,
    //         deduplication_total: 12,
    //         deduplication_file: 5,
    //         deduplication_project: 7,
    //         file_path: 'project123/references-batch1.csv',
    //         paper_total: 57,
    //         user: {
    //             first_name: 'John',
    //             last_name: 'Doe',
    //             avatar_url: null
    //         }
    //     },
    //     {
    //         id: '2',
    //         created_at: '2024-01-06T09:15:00Z',
    //         paper_new: 23,
    //         deduplication_total: 8,
    //         deduplication_file: 3,
    //         deduplication_project: 5,
    //         file_path: 'project123/scopus-export.csv',
    //         paper_total: 31,
    //         user: {
    //             first_name: 'Jane',
    //             last_name: 'Smith',
    //             avatar_url: 'https://example.com/avatar.jpg'
    //         }
    //     }
    // ];

    // await new Promise(resolve => setTimeout(resolve, 1000));
    // return { data: mockData, error: null };

    try {
        // First get the imports
        const { data: importsData, error: importsError } = await supabase
            .from('reference_imports')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (importsError) throw importsError;

        // If we have imports, fetch the associated user profiles
        if (importsData && importsData.length > 0) {
            // Get unique user IDs from the imports
            const userIds = [...new Set(importsData.map(imp => imp.user_id))];

            // Fetch profiles for these users
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, avatar_url')
                .in('id', userIds);

            if (profilesError) throw profilesError;

            // Create a map of user profiles for easy lookup
            const userProfiles = (profilesData || []).reduce((acc, profile) => {
                acc[profile.id] = profile;
                return acc;
            }, {});

            // Combine the data
            const combinedData = importsData.map(importRecord => ({
                ...importRecord,
                user: userProfiles[importRecord.user_id] || {
                    first_name: 'Unknown',
                    last_name: 'User',
                    avatar_url: null
                }
            }));

            return { data: combinedData, error: null };
        }

        return { data: importsData, error: null };
    } catch (error) {
        console.error('Error fetching project imports:', error);
        return { data: null, error: error.message };
    }
};

export const downloadImportFile = async (bucket, filePath) => {
    try {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .download(filePath);
        
        if (error) throw error;

        // Create a download link
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filePath.split('/').pop(); // Get filename from path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, error: null };
    } catch (error) {
        console.error('Error downloading file:', error);
        return { success: false, error: error.message };
    }
};