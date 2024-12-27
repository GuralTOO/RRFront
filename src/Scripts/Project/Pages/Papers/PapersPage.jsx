import React from 'react';
import { useParams } from 'react-router-dom';
import { Files } from 'lucide-react';
import DocumentList from '@/Scripts/DocumentList';
import PageHeader from '../../components/PageHeader';

const PapersPage = () => {
  const { projectId } = useParams();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div>
        <PageHeader icon={Files} title="Papers" />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] mx-auto">
            <DocumentList projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapersPage;