// Chat/ChatSidebar.jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, User } from 'lucide-react';
import { supabase } from "@/supabaseClient";
import NewChatDialog from './NewChatDialog';

const ChatSidebar = ({ channels, selectedChannel, onChannelSelect, projectId }) => {
    const [userId, setUserId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    // Get current user and their profile
    useEffect(() => {
        const getUserDetails = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                
                // Get user profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    setUserProfile(profile);
                }
            }
        };

        getUserDetails();
    }, []);

    // Helper function to get channel display name
    const getChannelDisplay = (channel) => {
        if (channel.channel_type === 'direct') {
            // For DMs, show the other user's name
            const otherUser = channel.chat_channel_members
                .find(member => member.user_id !== userId)?.profiles;
            return otherUser ? otherUser.username : 'Direct Message';
        }
        return channel.channel_name;
    };

    // Helper function to get channel icon
    const getChannelIcon = (channel) => {
        switch (channel.channel_type) {
            case 'direct':
                return <User size={18} />;
            case 'group':
                return <Users size={18} />;
            default:
                return <MessageCircle size={18} />;
        }
    };

    return (
        <div className="w-64 border-r bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
            </div>

            <div className="p-2">
                <NewChatDialog 
                    projectId={projectId}
                    onChatCreated={(newChannel) => {
                        // Add the new channel to the list and select it
                        setChannels([newChannel, ...channels]);
                        onChannelSelect(newChannel);
                    }}
                />
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {channels.map(channel => (
                        <button
                            key={channel.channel_id}
                            onClick={() => onChannelSelect(channel)}
                            className={`w-full p-2 rounded-lg text-left flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                                selectedChannel?.channel_id === channel.channel_id 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-700'
                            }`}
                        >
                            {getChannelIcon(channel)}
                            <span className="truncate">
                                {getChannelDisplay(channel)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Profile Section */}
            {userProfile && (
                <div className="p-4 border-t bg-gray-100">
                    <div className="flex items-center gap-3">
                        {userProfile.avatar_url ? (
                            <img 
                                src={userProfile.avatar_url} 
                                alt={userProfile.username}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                {userProfile.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="font-medium text-gray-700 truncate">
                            {userProfile.username}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;