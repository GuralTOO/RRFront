import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Search, Check, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/supabaseClient";

const InviteUserModal = ({ projectId, onInviteUser }) => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [matchedUser, setMatchedUser] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const checkUserStatus = async (searchEmail) => {
        if (!searchEmail) {
            setStatus({ type: null, message: '' });
            setMatchedUser(null);
            return;
        }

        try {
            setIsLoading(true);
            // First check if user exists
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, username')
                .ilike('username', searchEmail)
                .limit(1);

            if (profileError) throw profileError;

            if (!profiles || profiles.length === 0) {
                setMatchedUser(null);
                setStatus({ 
                    type: 'warning', 
                    message: 'User not found. Please ask them to sign up first.' 
                });
                return;
            }

            // Then check if user is already in project
            const { data: existingMember, error: memberError } = await supabase
                .from('user_projects')
                .select('role')
                .eq('user_id', profiles[0].id)
                .eq('project_id', projectId)
                .maybeSingle();

            if (memberError) throw memberError;

            if (existingMember) {
                setMatchedUser(null);
                setStatus({ 
                    type: 'error', 
                    message: `This user is already ${existingMember.role} in this project.` 
                });
                return;
            }

            setMatchedUser(profiles[0]);
            setStatus({ type: 'success', message: 'User found!' });

        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsTyping(true);
        
        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            setIsTyping(false);
            if (value.length >= 3) {
                checkUserStatus(value);
            } else {
                setStatus({ type: null, message: '' });
                setMatchedUser(null);
            }
        }, 500); // Wait 1 second after user stops typing

        setSearchTimeout(timeout);
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (searchTimeout) clearTimeout(searchTimeout);
        };
    }, [searchTimeout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!matchedUser) return;

        setIsLoading(true);
        try {
            await onInviteUser({ email: matchedUser.username, role });
            setStatus({ type: 'success', message: 'Invitation sent successfully!' });
            setTimeout(() => {
                resetForm();
                setOpen(false);
            }, 1500);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setRole('');
        setStatus({ type: null, message: '' });
        setMatchedUser(null);
        setIsTyping(false);
        if (searchTimeout) clearTimeout(searchTimeout);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    className="text-sm text-white bg-black transition-colors"
                >
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white rounded-lg">
                <div className="bg-white">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">Invite User</h2>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* Search Input Group */}
                            <div className="space-y-3">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <Input
                                        placeholder="Search by email..."
                                        type="email"
                                        value={email}
                                        onChange={handleInputChange}
                                        className={`
                                            pl-9 pr-9 py-5 border-gray-200
                                            transition-all duration-200
                                            ${matchedUser && !isTyping ? 'bg-gray-50' : ''}
                                        `}
                                    />
                                    {isLoading && !isTyping && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                        </div>
                                    )}
                                    {matchedUser && !isTyping && !isLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Check className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Status Message */}
                                {status.message && !isTyping && (
                                    <div className={`
                                        px-3 py-2 rounded-md text-sm flex items-center gap-2
                                        ${status.type === 'success' ? 'bg-gray-50 text-gray-700' :
                                          status.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                                          status.type === 'error' ? 'bg-red-50 text-red-700' : ''}
                                    `}>
                                        {status.type === 'success' ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : status.type === 'error' ? (
                                            <X className="h-4 w-4 text-red-500" />
                                        ) : null}
                                        <span className="font-medium">{status.message}</span>
                                    </div>
                                )}
                            </div>

                            {/* Role Selector */}
                            {matchedUser && !isTyping && (
                                <div className="space-y-2">
                                    <Select value={role} onValueChange={setRole} required>
                                        <SelectTrigger 
                                            className="w-full py-5 border-gray-200 focus:border-[#4096ff] focus:ring-0"
                                        >
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="senior">Senior</SelectItem>
                                            <SelectItem value="reviewer">Reviewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-8">
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="hover:bg-gray-50 border-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={!matchedUser || !role || isLoading || isTyping}
                                className={`
                                    px-6
                                    ${(!matchedUser || !role || isLoading || isTyping) 
                                        ? 'bg-gray-100 text-gray-400' 
                                        : 'bg-[#4096ff] hover:bg-[#1677ff] text-white'}
                                    transition-colors
                                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Sending</span>
                                    </div>
                                ) : 'Send Invite'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default InviteUserModal;