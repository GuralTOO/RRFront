import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Adjust the import path as needed
import { Avatar, Upload } from 'antd';
import { Camera, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const UserSettingsPage = () => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleAvatarChange = async (info) => {
        if (info.file.status === 'done') {
            // Here you would typically upload the file to Supabase storage
            // and update the user's profile in the database
            setAvatarUrl(info.file.originFileObj);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* <Button
                    variant="ghost"
                    className="mb-6 text-gray-600 hover:text-gray-800"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button> */}

                <Card className="bg-white shadow-sm border border-gray-200">
                    <CardHeader className="border-b border-gray-200 pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800">User Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar
                                    size={128}
                                    src={avatarUrl}
                                    icon={<Camera className="text-gray-400" size={64} />}
                                    className="bg-gray-100"
                                />
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    onChange={handleAvatarChange}
                                >
                                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                        Change Profile Picture
                                    </Button>
                                </Upload>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Account Actions</h3>
                                <Button variant="destructive" onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
                                    Log Out
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Coming Soon</h3>
                                <p className="text-gray-600">More customization options will be available here in the future.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserSettingsPage;