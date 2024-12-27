// src/Scripts/Project/pages/Import/ImportPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FileUploadModal from '../../../Experiment/pages/Project/FileUploadModal';
import AddPaperModal from '../../../Experiment/pages/Project/AddPaperModal';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ImportPage = () => {
  const { projectId } = useParams();

  const handleUploadComplete = () => {
    // Existing upload complete handler
  };

  const handleAddPaper = async (paperData) => {
    // Existing add paper handler
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        icon={Upload}
        title="Import Papers"
      />

      <div className="flex-1 px-6 py-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploadModal 
                  projectId={projectId} 
                  onUploadComplete={handleUploadComplete} 
                />
                <AddPaperModal onAddPaper={handleAddPaper} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;