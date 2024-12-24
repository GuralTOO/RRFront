// src/Scripts/Project/pages/ProjectHome.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectDetailsCard from '@/Scripts/Experiment/pages/Project/ProjectDetailsCard';
import AnalyticsTab from '@/Scripts/Experiment/pages/Project/AnalyticsTab';
import { getProjectDetails, getUserRole } from '@/api/projectsApi';

const ProjectHome = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // State management
  const [project, setProject] = useState({
    id: parseInt(projectId),
    name: 'Loading',
    papers: 1,
    keywords: null,
    progress: 0,
    researchQuestion: 'Loading'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const canEdit = (userRole === 'admin' || userRole === 'senior');

  // Fetch project details and user role
  useEffect(() => {
    async function fetchProjectDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const [projectDetails, role] = await Promise.all([
          getProjectDetails(projectId),
          getUserRole(projectId)
        ]);
        
        setProject({
          ...projectDetails,
          keywords: projectDetails.keywords || []
        });
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" />
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-6">
      <div className="text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Project Overview</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectDetailsCard
              project={project}
              setProject={setProject}
              canEdit={canEdit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsTab projectId={projectId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectHome;