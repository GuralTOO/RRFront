import { supabase } from "@/supabaseClient";

// In api/chat.js

// Get project channels
export async function getProjectChannels(projectId) {
    // First get the channels with their members
    const { data, error } = await supabase
        .from('chat_channels')
        .select(`
            *,
            chat_channel_members!inner (
                user_id
            )
        `)
        .eq('project_id', projectId);

    if (error) {
        console.error('Error fetching channels:', error);
        throw error;
    }

    // Then get the profile information for each member
    const channelsWithProfiles = await Promise.all(data.map(async (channel) => {
        const { data: memberProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('username, avatar_url, id')
            .in('id', channel.chat_channel_members.map(member => member.user_id));

        if (profilesError) {
            console.error('Error fetching member profiles:', profilesError);
            throw profilesError;
        }

        return {
            ...channel,
            chat_channel_members: channel.chat_channel_members.map(member => {
                const profile = memberProfiles.find(p => p.id === member.user_id);
                return {
                    ...member,
                    profiles: profile
                };
            })
        };
    }));

    return channelsWithProfiles;
}

export async function getChannelMessages(channelId) {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channelId)
        .is('parent_id', null) // Only get top-level messages
        .order('created_at', { ascending: true }) // Changed to ascending
        .limit(50);

    if (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }

    // Then get sender profiles
    const senderIds = [...new Set(data.map(m => m.sender_id))];
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', senderIds);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
    }

    // Attach sender profiles to messages
    const messagesWithProfiles = data.map(message => ({
        ...message,
        sender: profiles.find(p => p.id === message.sender_id)
    }));

    return messagesWithProfiles;
}


// Get thread messages for a parent message
export async function getThreadMessages(parentMessageId) {
    // First get thread messages
    const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('parent_id', parentMessageId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching thread:', error);
        throw error;
    }

    // Then get sender profiles
    const senderIds = [...new Set(messages.map(m => m.sender_id))];
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', senderIds);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
    }

    // Attach sender profiles to messages
    const messagesWithProfiles = messages.map(message => ({
        ...message,
        sender: profiles.find(p => p.id === message.sender_id)
    }));

    return messagesWithProfiles;
}


// Send a new message
export async function sendMessage(channelId, userId, content, parentId = null) {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert([
            {
                channel_id: channelId,
                sender_id: userId,
                content,
                parent_id: parentId
            }
        ])
        .select();

    if (error) {
        console.error('Error sending message:', error);
        throw error;
    }

    return data;
}

// Create a new channel (for group chats or DMs)
export async function createChannel(projectId, channelName, memberIds, channelType = 'group') {
    // For DMs, generate a default channel name if none provided
    const finalChannelName = channelName || `dm-${Date.now()}`;
    
    // Start a transaction
    const { data: channel, error: channelError } = await supabase
        .from('chat_channels')
        .insert([
            {
                project_id: projectId,
                channel_name: finalChannelName,
                channel_type: channelType
            }
        ])
        .select()
        .single();

    if (channelError) {
        console.error('Error creating channel:', channelError);
        throw channelError;
    }

    // Add members to the channel
    const memberData = memberIds.map(userId => ({
        channel_id: channel.channel_id,
        user_id: userId
    }));

    const { error: membersError } = await supabase
        .from('chat_channel_members')
        .insert(memberData);

    if (membersError) {
        console.error('Error adding members:', membersError);
        throw membersError;
    }

    return channel;
}

export async function getOrCreateDMChannel(projectId, user1Id, user2Id) {
    // First try to find existing DM channel
    const { data: existingChannels, error: searchError } = await supabase
        .from('chat_channels')
        .select(`
            *,
            chat_channel_members (user_id)
        `)
        .eq('project_id', projectId)
        .eq('channel_type', 'direct');

    if (searchError) {
        console.error('Error searching for DM channel:', searchError);
        throw searchError;
    }

    // Find channel that has exactly these two users
    const dmChannel = existingChannels?.find(channel => {
        const memberIds = channel.chat_channel_members.map(m => m.user_id);
        return memberIds.length === 2 
            && memberIds.includes(user1Id) 
            && memberIds.includes(user2Id);
    });

    if (dmChannel) {
        // Fetch and attach profile information for the existing channel
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', [user1Id, user2Id]);

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            throw profilesError;
        }

        dmChannel.chat_channel_members = dmChannel.chat_channel_members.map(member => ({
            ...member,
            profiles: profiles.find(p => p.id === member.user_id)
        }));

        return dmChannel;
    }

    // If no existing channel, fetch profiles and create new channel
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('username')
        .in('id', [user1Id, user2Id]);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
    }

    // Sort usernames alphabetically for consistency
    const usernames = profiles.map(p => p.username).sort();
    const channelName = `dm-${usernames.join('-')}`;

    // Create new channel
    const newChannel = await createChannel(projectId, channelName, [user1Id, user2Id], 'direct');

    // Attach profile information to the new channel
    newChannel.chat_channel_members = [user1Id, user2Id].map(userId => ({
        user_id: userId,
        profiles: profiles.find(p => p.id === userId)
    }));

    return newChannel;
}

// Subscribe to new messages in a channel
export function subscribeToChannel(channelId, onMessage) {
    return supabase
        .channel(`chat:${channelId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `channel_id=eq.${channelId}`
        }, onMessage)
        .subscribe();
}


/*

: 
"Searched for a foreign key relationship between 'chat_channel_members' and 'profiles' in the schema 'public', but no matches were found."
hint
: 
null
message
: 
"Could not find a relationship between 'chat_channel_members' and 'profiles' in the schema cache"
[[Prototype]]
: 
Object
getProjectChannels	@	chat.js:21

*/