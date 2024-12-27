import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import MainNav from '../navigation/MainNav';
import ProjectNav from '../navigation/ProjectNav';
import { getProjectDetails } from '@/api/projectsApi';

const AppLayout = ({ session }) => {
  const location = useLocation();
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  
  const isProjectRoute = location.pathname.startsWith('/p/');

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId)
        .then(details => setProjectName(details.name))
        .catch(console.error);
    }
  }, [projectId]);

  return (
    <div className="flex min-h-screen bg-white">
      {isProjectRoute ? (
        <ProjectNav projectName={projectName} />
      ) : (
        <MainNav />
      )}
      <main className="flex-1 ml-20 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;