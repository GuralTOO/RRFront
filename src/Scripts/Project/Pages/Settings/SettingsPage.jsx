// src/Scripts/Project/pages/Settings/ProjectSettingsPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import SettingsTab from '../../../Experiment/pages/Project/SettingsTab';

const ProjectSettingsPage = () => {
  const { projectId } = useParams();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>
      <SettingsTab projectId={projectId} />
    </div>
  );
};

export default ProjectSettingsPage;