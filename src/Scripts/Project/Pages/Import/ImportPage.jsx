// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Upload } from 'lucide-react';
// import PageHeader from '../../components/PageHeader';
// import FileUploadModal from '../../../Experiment/pages/Project/FileUploadModal';
// import ImportHistory from './ImportHistory';
// import { Separator } from "@/components/ui/separator"

// const ImportPage = () => {
//   const { projectId } = useParams();
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const handleUploadComplete = () => {
//     setRefreshTrigger(refreshTrigger + 1);
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <PageHeader 
//         icon={Upload}
//         title="Import Papers"
//       />

//       <div className="flex-1">
//         {/* Import Section */}
//         <div className="max-w-screen-xl mx-auto px-6 py-8">
//           {/* <h2 className="text-3xl font-semibold mb-6">Import References</h2> */}
//           {/* Full-width action area */}
//           <div className="border rounded-lg bg-gray-50/50 p-8">
//             <div className="flex items-center justify-between">
//               <div className="flex items-start gap-3 flex-1">
//                 <Upload className="h-5 w-5 mt-1 text-gray-500" />
//                 <div>
//                   <p className="text-lg font-medium mb-1">Upload your reference file</p>
//                   <p className="text-muted-foreground">
//                     Import your references using CSV, RIS, or NBIB file formats
//                   </p>
//                 </div>
//               </div>
//               <FileUploadModal 
//                 projectId={projectId} 
//                 onUploadComplete={handleUploadComplete} 
//               />
//             </div>
//           </div>
//           <Separator className="my-8" />
//         </div>

//         {/* History Section */}
//         <div className="max-w-screen-xl mx-auto px-6">
//           <h2 className="text-3xl font-semibold mb-6">Recent Imports</h2>
//           <div className="space-y-4">
//             <ImportHistory 
//               projectId={projectId} 
//               refreshTrigger={refreshTrigger}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FileUploadModal from '../../../Experiment/pages/Project/FileUploadModal';
import ImportHistory from './ImportHistory';
import { Separator } from "@/components/ui/separator"

const ImportPage = () => {
  const { projectId } = useParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        icon={Upload}
        title="Import Papers"
      />

      <div className="flex-1">
        {/* Import Section */}
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          {/* Enhanced action area */}
          <div className="bg-gray-50/50 border rounded-lg p-8 mb-12">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-md border mt-1">
                  <Upload className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-1">Import your references</h2>
                  <p className="text-muted-foreground">
                    Supported formats: CSV, RIS, or NBIB
                  </p>
                </div>
              </div>
              <FileUploadModal 
                projectId={projectId} 
                onUploadComplete={handleUploadComplete} 
              />
            </div>
          </div>

          {/* History Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Recent Imports</h2>
            <div className="space-y-4">
              <ImportHistory 
                projectId={projectId} 
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;