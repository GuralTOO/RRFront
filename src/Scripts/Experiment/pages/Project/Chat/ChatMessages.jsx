// Chat/ChatMessages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getChannelMessages, getThreadMessages } from '@/api/chat';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/supabaseClient';

const ChatMessages = ({ channelId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedThreads, setExpandedThreads] = useState(new Set());
    const [threadMessages, setThreadMessages] = useState({});
    const messagesEndRef = useRef(null);
    const { toast } = useToast();

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const messageData = await getChannelMessages(channelId);
                // Reverse order so newest messages are at bottom
                setMessages(messageData.reverse());
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load messages",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (channelId) {
            console.log('Fetching initial messages for channel:', channelId);
            fetchMessages();
        }
    }, [channelId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // Subscribe to new messages
    useEffect(() => {
        if (!channelId) return;

        console.log('Setting up subscription for channel:', channelId);

        // Function to add new message to state
        const handleNewMessage = async (payload) => {
            console.log('Received new message payload:', payload);
            const newMessage = payload.new;
            
            // Fetch the sender's profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .eq('id', newMessage.sender_id)
                .single();

            if (profileError) {
                console.error('Error fetching sender profile:', profileError);
                return;
            }

            console.log('Fetched sender profile:', profile);

            // Add sender profile to message
            const messageWithSender = {
                ...newMessage,
                sender: profile
            };

            // Add to messages if it's a new top-level message
            if (!newMessage.parent_id) {
                console.log('Adding new top-level message:', messageWithSender);
                setMessages(prevMessages => [...prevMessages, messageWithSender]);
            } 
            // Update thread messages if it's a reply
            else {
                console.log('Adding new thread message:', messageWithSender);
                setThreadMessages(prev => ({
                    ...prev,
                    [newMessage.parent_id]: [
                        ...(prev[newMessage.parent_id] || []),
                        messageWithSender
                    ]
                }));
            }
        };

        // Subscribe to channel messages
        const channel = supabase
            .channel(`messages:${channelId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `channel_id=eq.${channelId}`
                },
                handleNewMessage
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        console.log('Subscription created:', channel);

        // Cleanup subscription
        return () => {
            console.log('Cleaning up subscription for channel:', channelId);
            channel.unsubscribe();
        };
    }, [channelId]);

    // Handle thread expansion
    const toggleThread = async (messageId) => {
        const newExpanded = new Set(expandedThreads);
        
        if (newExpanded.has(messageId)) {
            newExpanded.delete(messageId);
            setExpandedThreads(newExpanded);
            return;
        }

        // Fetch thread messages if not already loaded
        if (!threadMessages[messageId]) {
            try {
                const threadData = await getThreadMessages(messageId);
                setThreadMessages(prev => ({
                    ...prev,
                    [messageId]: threadData
                }));
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load thread messages",
                    variant: "destructive",
                });
                return;
            }
        }

        newExpanded.add(messageId);
        setExpandedThreads(newExpanded);
    };

    // Format timestamp
    const formatMessageTime = (timestamp) => {
        return format(new Date(timestamp), 'h:mm a');
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                Loading messages...
            </div>
        );
    }



    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                {messages.map(message => (
                    <div key={message.message_id} className="space-y-2">
                        {/* Main Message */}
                        <div className="flex items-start gap-3 group">
                            {/* Avatar */}
                            {message.sender.avatar_url ? (
                                <img
                                    src={message.sender.avatar_url}
                                    alt={message.sender.username}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {message.sender.username.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Message Content */}
                            <div className="flex-1 min-w-0">
                                {/* Message Header */}
                                <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-gray-800">
                                        {message.sender.username}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {formatMessageTime(message.created_at)}
                                    </span>
                                </div>

                                {/* Message Text */}
                                <p className="text-gray-700 whitespace-pre-wrap break-words">
                                    {message.content}
                                </p>

                                {/* Thread Indicator */}
                                {threadMessages[message.message_id]?.length > 0 && (
                                    <button
                                        onClick={() => toggleThread(message.message_id)}
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        {expandedThreads.has(message.message_id) ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                        {threadMessages[message.message_id].length} replies
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Thread Messages */}
                        {expandedThreads.has(message.message_id) && threadMessages[message.message_id] && (
                            <div className="ml-11 pl-4 border-l-2 border-gray-100 space-y-3">
                                {threadMessages[message.message_id].map(threadMessage => (
                                    <div key={threadMessage.message_id} className="flex items-start gap-3">
                                        {/* Thread Message Avatar */}
                                        {threadMessage.sender.avatar_url ? (
                                            <img
                                                src={threadMessage.sender.avatar_url}
                                                alt={threadMessage.sender.username}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                                                {threadMessage.sender.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        {/* Thread Message Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold text-gray-800">
                                                    {threadMessage.sender.username}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatMessageTime(threadMessage.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap break-words">
                                                {threadMessage.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    );
};

export default ChatMessages;