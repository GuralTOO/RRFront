import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/supabaseClient";
import { Camera, Edit2, X, Check, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserProfile, updateUserProfile, updateUserAvatar, generateAvatarUrl } from '../../api/userSettingsApi';

const UserSettingsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        first_name: '',
        last_name: '',
        company: '',
        avatar_url: '',
        username: ''
    });
    const [editedProfile, setEditedProfile] = useState({});

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const data = await fetchUserProfile();
            if (data) {
                setUserProfile({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    company: data.company || '',
                    avatar_url: data.avatar_url || '',
                    username: data.username || ''
                });
                setEditedProfile({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    company: data.company || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleRandomizeAvatar = async () => {
        try {
            const newAvatarUrl = generateAvatarUrl();
            await updateUserAvatar(newAvatarUrl);
            setUserProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedProfile({
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            company: userProfile.company
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedProfile({
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            company: userProfile.company
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(editedProfile);
            setUserProfile(prev => ({
                ...prev,
                ...editedProfile
            }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-50/50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-zinc-900">Account Settings</h1>
                    <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="text-zinc-600 hover:text-zinc-900"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Button>
                </div>

                <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-6 mb-10">
                                <div className="w-32 h-32 relative overflow-hidden rounded-full border-2 border-zinc-300">
                                {userProfile.avatar_url ? (
                                    <img
                                        src={userProfile.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-50 flex items-center justify-center">
                                        <Camera className="text-zinc-400" size={48} />
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleRandomizeAvatar}
                                className="text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                            >
                                Generate New Avatar
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-zinc-900">Personal Information</h2>
                                {!isEditing ? (
                                    <Button 
                                        variant="ghost" 
                                        onClick={handleEditClick}
                                        className="text-zinc-600 hover:text-zinc-900"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="space-x-2">
                                        <Button 
                                            variant="ghost" 
                                            onClick={handleCancelEdit}
                                            className="text-zinc-600 hover:text-zinc-900"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={handleProfileUpdate}
                                            className="text-zinc-900 border-zinc-200 hover:bg-zinc-50"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-6">
                                <div>
                                    <Label className="text-zinc-500 text-sm mb-1.5">Email</Label>
                                    <div className="text-zinc-900 font-medium">
                                        {userProfile.username}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName" className="text-zinc-500 text-sm mb-1.5">First Name</Label>
                                        {isEditing ? (
                                            <Input
                                                id="firstName"
                                                value={editedProfile.first_name}
                                                onChange={(e) => setEditedProfile(prev => ({
                                                    ...prev,
                                                    first_name: e.target.value
                                                }))}
                                                className="border-zinc-200"
                                            />
                                        ) : (
                                            <div className="text-zinc-900 font-medium">
                                                {userProfile.first_name || 'Not set'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="text-zinc-500 text-sm mb-1.5">Last Name</Label>
                                        {isEditing ? (
                                            <Input
                                                id="lastName"
                                                value={editedProfile.last_name}
                                                onChange={(e) => setEditedProfile(prev => ({
                                                    ...prev,
                                                    last_name: e.target.value
                                                }))}
                                                className="border-zinc-200"
                                            />
                                        ) : (
                                            <div className="text-zinc-900 font-medium">
                                                {userProfile.last_name || 'Not set'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="company" className="text-zinc-500 text-sm mb-1.5">Company</Label>
                                    {isEditing ? (
                                        <Input
                                            id="company"
                                            value={editedProfile.company}
                                            onChange={(e) => setEditedProfile(prev => ({
                                                ...prev,
                                                company: e.target.value
                                            }))}
                                            className="border-zinc-200"
                                        />
                                    ) : (
                                        <div className="text-zinc-900 font-medium">
                                            {userProfile.company || 'Not set'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserSettingsPage;