// Chat/NewChatDialog.jsx
import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCirclePlus, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";
import { createChannel, getOrCreateDMChannel } from '@/api/chat';

const NewChatDialog = ({ projectId, onChatCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatType, setChatType] = useState(null); // 'group' or 'direct'
    const [groupName, setGroupName] = useState('');
    const [projectUsers, setProjectUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const { toast } = useToast();

    // Fetch project users on mount
    useEffect(() => {
        const fetchProjectUsers = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const { data, error } = await supabase
                .from('user_projects')
                .select(`
                    user_id,
                    profiles (
                        id,
                        username,
                        avatar_url
                    )
                `)
                .eq('project_id', projectId);

            if (error) {
                toast({
                    title: "Error",
                    description: "Failed to load project users",
                    variant: "destructive",
                });
                return;
            }

            setProjectUsers(data.map(u => u.profiles));
        };

        fetchProjectUsers();
    }, [projectId]);

    const handleCreateChat = async () => {
        try {
            let newChannel;

            if (chatType === 'group') {
                if (!groupName.trim() || selectedUsers.length === 0) {
                    toast({
                        title: "Error",
                        description: "Please enter a group name and select users",
                        variant: "destructive",
                    });
                    return;
                }

                // Add current user to the group
                const memberIds = [...selectedUsers, currentUser.id];
                newChannel = await createChannel(projectId, groupName, memberIds);
            } else {
                // Direct message
                if (selectedUsers.length !== 1) {
                    toast({
                        title: "Error",
                        description: "Please select one user for direct message",
                        variant: "destructive",
                    });
                    return;
                }

                newChannel = await getOrCreateDMChannel(
                    projectId,
                    currentUser.id,
                    selectedUsers[0]
                );
            }

            onChatCreated(newChannel);
            setIsOpen(false);
            resetForm();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create chat",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setChatType(null);
        setGroupName('');
        setSelectedUsers([]);
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            // For DMs, only allow one selection
            if (chatType === 'direct') {
                setSelectedUsers([userId]);
            } else {
                setSelectedUsers([...selectedUsers, userId]);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-2">
                    <MessageCirclePlus className="mr-2" size={18} />
                    New Chat
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start New Chat</DialogTitle>
                </DialogHeader>

                {/* Chat Type Selection */}
                {!chatType ? (
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setChatType('direct')}
                        >
                            Direct Message
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setChatType('group')}
                        >
                            <Users className="mr-2" size={18} />
                            Group Chat
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Back Button */}
                        <Button 
                            variant="ghost" 
                            onClick={() => setChatType(null)}
                            className="mb-2"
                        >
                            ← Back
                        </Button>

                        {/* Group Name Input (for group chats) */}
                        {chatType === 'group' && (
                            <div className="space-y-2">
                                <Label htmlFor="groupName">Group Name</Label>
                                <Input
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter group name"
                                />
                            </div>
                        )}

                        {/* User Selection */}
                        <div className="space-y-2">
                            <Label>Select Users</Label>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {projectUsers.map(user => (
                                    <div 
                                        key={user.id}
                                        onClick={() => toggleUserSelection(user.id)}
                                        className={`
                                            p-2 rounded-lg flex items-center gap-2 cursor-pointer
                                            ${selectedUsers.includes(user.id) 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        {user.avatar_url ? (
                                            <img 
                                                src={user.avatar_url} 
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="flex-1">{user.username}</span>
                                        {user.id === currentUser?.id && (
                                            <span className="text-sm text-gray-500">(You)</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Create Button */}
                        <Button 
                            className="w-full"
                            onClick={handleCreateChat}
                        >
                            Create Chat
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NewChatDialog;