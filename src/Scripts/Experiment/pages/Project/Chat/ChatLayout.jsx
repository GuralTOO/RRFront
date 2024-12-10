// Chat/ChatLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from "@/supabaseClient";
import { getProjectChannels, subscribeToChannel } from '@/api/chat';
import { useToast } from "@/hooks/use-toast";

// Placeholder components - we'll build these next
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ChatLayout = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { toast } = useToast();
    
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Get current user on mount
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                toast({
                    title: "Error",
                    description: "Failed to authenticate user",
                    variant: "destructive",
                });
                navigate('/');
                return;
            }
            setUserId(user.id);
        };

        getCurrentUser();
    }, []);

    // Fetch channels when component mounts
    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setLoading(true);
                const channelData = await getProjectChannels(projectId);
                setChannels(channelData);
                // Set first channel as default if exists
                if (channelData.length > 0 && !selectedChannel) {
                    setSelectedChannel(channelData[0]);
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load chat channels",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (projectId && userId) {
            fetchChannels();
        }
    }, [projectId, userId]);

    // Subscribe to selected channel
    useEffect(() => {
        if (!selectedChannel) return;

        const subscription = subscribeToChannel(
            selectedChannel.channel_id,
            (payload) => {
                // Handle new message
                console.log('New message:', payload);
                // We'll implement message handling later
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedChannel]);

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading chat...
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-white">
            {/* Back button */}
            <button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full"
            >
                <ArrowLeftOutlined />
            </button>

            {/* Sidebar */}
            <ChatSidebar 
                channels={channels}
                selectedChannel={selectedChannel}
                onChannelSelect={handleChannelSelect}
                projectId={projectId}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChannel ? (
                    <>
                        {/* Channel Header */}
                        <div className="h-14 border-b flex items-center px-4">
                            <h3 className="font-semibold text-gray-800">
                                {selectedChannel.channel_name || 'Direct Message'}
                            </h3>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-hidden">
                            <ChatMessages 
                                channelId={selectedChannel.channel_id}
                            />
                        </div>

                        {/* Message Input */}
                        <ChatInput 
                            channelId={selectedChannel.channel_id}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a channel to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;