// src/Scripts/Project/pages/Import/ImportPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Import Papers</h1>
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
  );
};

export default ImportPage;