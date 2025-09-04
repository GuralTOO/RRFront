import React from 'react';
import { useParams } from 'react-router-dom';
import { Files } from 'lucide-react';
import DocumentList from '@/Scripts/DocumentList';
import PageHeader from '../../components/PageHeader';
import PapersHeader from './components/PapersHeader';
const PapersPage = () => {
  const { projectId } = useParams();

  return (
    <div className="flex flex-col h-full">
      <PageHeader icon={Files} title="Papers" />
      
      {/* Search Bar - Full Width */}
      {/* <PapersSearch onSearchChange={(value) => console.log('Search:', value)} /> */}

      <PapersHeader
        onSearchChange={(value) => console.log('Search:', value)}
        onSortChange={(value) => console.log('Sort:', value)}
        onStageChange={(value) => console.log('Stage:', value)}
        onStatusChange={(value) => console.log('Status:', value)}
        onRelevanceRangeChange={(range) => console.log('Relevance:', range)}
      />
      {/* Main Content
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] mx-auto px-6">
            <DocumentList projectId={projectId} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PapersPage;