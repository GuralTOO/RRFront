import { supabase } from "@/supabaseClient";

export async function getEmail(user_id) {
    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('id', user_id);
    if (error) {
        console.error('Error fetching email:', error);
        throw new Error('Failed to fetch email');
    }
    return data;
}
