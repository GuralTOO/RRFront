import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InviteUserModal from './InviteUserModal';
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUserRole } from '@/api/projectsApi';

const SettingsTab = ({ projectId }) => {
    const [userRole, setUserRole] = useState(null);
    const [projectUsers, setProjectUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const role = await getUserRole(projectId);
                setUserRole(role);
                await fetchProjectUsers();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const fetchProjectUsers = async () => {
        // TODO: Replace with actual API call
        const mockUsers = [
            { id: 1, email: 'admin@example.com', role: 'admin', joinedAt: '2024-01-01' },
            { id: 2, email: 'senior@example.com', role: 'senior', joinedAt: '2024-01-02' },
            { id: 3, email: 'researcher@example.com', role: 'researcher', joinedAt: '2024-01-03' },
        ];
        setProjectUsers(mockUsers);
    };


    const handleInviteUser = async ({ email, role }) => {
        try {
            console.log('Inviting user:', email, role);
            await inviteUserToProject(projectId, email, role);
            await fetchProjectUsers();
        } catch (error) {
            console.error('Error inviting user:', error);
            // You might want to add proper error handling here
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'senior':
                return 'bg-blue-100 text-blue-800';
            case 'researcher':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {(userRole === 'admin' || userRole === 'senior') && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Project Members</h3>
                                <p className="text-sm text-gray-500">
                                    Add new researchers to collaborate on this project
                                </p>
                            </div>
                            <InviteUserModal onInviteUser={handleInviteUser} />
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Current Members</CardTitle>
                    <CardDescription>View and manage project members</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projectUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.joinedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {userRole === 'admin' || (userRole === 'senior' && user.role === 'researcher') ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleRemoveUser(user.id)}
                                            >
                                                Remove
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Permissions and Roles Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Roles and Permissions</CardTitle>
                    <CardDescription>Overview of project roles and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Admin</h4>
                            <p className="text-sm text-gray-500">
                                Can manage all aspects of the project, including managing users and their roles
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Senior Researcher</h4>
                            <p className="text-sm text-gray-500">
                                Can invite researchers and resolve conflicts, but cannot manage admins or other senior researchers
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Researcher</h4>
                            <p className="text-sm text-gray-500">
                                Can review papers and participate in the systematic review process
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsTab;