// // src/Scripts/Project/pages/Import/ImportPage.jsx
// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { Upload } from 'lucide-react';
// import PageHeader from '../../components/PageHeader';
// import FileUploadModal from '../../../Experiment/pages/Project/FileUploadModal';
// import AddPaperModal from '../../../Experiment/pages/Project/AddPaperModal';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// const ImportPage = () => {
//   const { projectId } = useParams();

//   const handleUploadComplete = () => {
//     // Existing upload complete handler
//   };

//   const handleAddPaper = async (paperData) => {
//     // Existing add paper handler
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <PageHeader 
//         icon={Upload}
//         title="Import Papers"
//       />

//       <div className="flex-1 px-6 py-6">
//         <div className="max-w-screen-xl mx-auto">
//           <div className="grid gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Import Options</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <FileUploadModal 
//                   projectId={projectId} 
//                   onUploadComplete={handleUploadComplete} 
//                 />
//                 <AddPaperModal onAddPaper={handleAddPaper} />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;

import React from 'react';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FileUploadModal from '../../../Experiment/pages/Project/FileUploadModal';
import AddPaperModal from '../../../Experiment/pages/Project/AddPaperModal';
import ImportHistory from './ImportHistory';  // Add this import
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";  // Add this import if you're using shadcn/ui

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
            {/* Import Options Card */}
            <Card>
              <CardHeader>
                <CardTitle>Import Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Import from File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file containing reference data
                    </p>
                    <FileUploadModal 
                      projectId={projectId} 
                      onUploadComplete={handleUploadComplete} 
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Add Single Paper</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manually add a single paper to your project
                    </p>
                    <AddPaperModal onAddPaper={handleAddPaper} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import History Card */}
            <Card>
              <CardHeader>
                <CardTitle>Import History</CardTitle>
              </CardHeader>
              <CardContent>
                <ImportHistory projectId={projectId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;