import React from 'react';
import { useParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SettingsTab from '../../../Experiment/pages/Project/SettingsTab';

const ProjectSettingsPage = () => {
  const { projectId } = useParams();

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        icon={Settings}
        title="Project Settings"
      />

      <div className="flex-1 px-6 py-6">
        <div className="max-w-screen-xl mx-auto">
          <SettingsTab projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;