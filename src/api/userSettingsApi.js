import { supabase } from "@/supabaseClient";

export const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw error;
    return data;
};

export const updateUserProfile = async (profileData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user');

    const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

    if (error) throw error;
    return true;
};

export const updateUserAvatar = async (avatarUrl) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user');

    const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

    if (error) throw error;
    return true;
};

export const generateAvatarUrl = () => {
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
};