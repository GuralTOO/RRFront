// import React, { useEffect, useState } from 'react';
// import { ArrowUpRightFromCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { getConflictHistory } from '@/api/reviewsAPI';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import ConflictsHistory from './ConflictsHistory';

// const StageCardExpanded = ({
//   stats,
//   projectId,
//   stageId,
//   onStartResolution,
//   canResolve
// }) => {
//   const [history, setHistory] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const data = await getConflictHistory(projectId, stageId);
//       setHistory(data);
//     } catch (error) {
//       console.error('Error loading history:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Stats Section */}
//       <div className="border-b bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="grid grid-cols-3 gap-6">
//             {/* Active Conflicts */}
//             <div className="bg-white rounded-lg p-6 text-center">
//               <div className="text-5xl font-bold text-red-600 mb-2">
//                 {stats.active_conflicts}
//               </div>
//               <div className="text-sm text-gray-600 uppercase tracking-wide">
//                 Active Conflicts
//               </div>
//             </div>

//             {/* Resolved Conflicts */}
//             <div className="bg-white rounded-lg p-6 text-center">
//               <div className="text-4xl font-semibold text-green-600 mb-2">
//                 {stats.resolved_conflicts}
//               </div>
//               <div className="text-sm text-gray-600 uppercase tracking-wide">
//                 Resolved Conflicts
//               </div>
//             </div>

//             {/* Progress */}
//             <div className="bg-white rounded-lg p-6">
//               <div className="text-sm font-medium mb-2">Resolution Progress</div>
//               <Progress
//                 value={(stats.resolved_conflicts / stats.total_conflicts) * 100}
//                 className="h-2 mb-2"
//               />
//               <div className="text-sm text-gray-600">
//                 {Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100)}% Complete
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Button */}
//       <div className="border-b px-6 py-4">
//         <Button
//           size="lg"
//           className="w-full max-w-md mx-auto"
//           disabled={!canResolve || stats.active_conflicts === 0}
//           onClick={onStartResolution}
//         >
//           <ArrowUpRightFromCircle className="h-4 w-4 mr-2" />
//           {stats.active_conflicts === 0 ? 'No Active Conflicts' : 'Start Conflict Resolution'}
//         </Button>
//       </div>

//       {/* History Section */}
//       <div className="flex-1 overflow-hidden">
//         <ScrollArea className="h-full">
//           <div className="max-w-7xl mx-auto px-6 py-6">
//             <h3 className="text-lg font-medium mb-4">Resolution History</h3>
//             <ConflictsHistory
//               conflicts={history?.conflicts || []}
//               loading={loading}
//             />
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };

// export default StageCardExpanded;


// // const StageCardExpanded = ({
// //     stats,
// //     projectId,
// //     stageId,
// //     onStartResolution,
// //     canResolve
// //   }) => {
// //     const [history, setHistory] = useState(null);
// //     const [loading, setLoading] = useState(true);
  
// //     useEffect(() => {
// //       loadHistory();
// //     }, []);
  
// //     const loadHistory = async () => {
// //       try {
// //         setLoading(true);
// //         const data = await getConflictHistory(projectId, stageId);
// //         setHistory(data);
// //       } catch (error) {
// //         console.error('Error loading history:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
  
// //     return (
// //       <div className="flex flex-col h-full bg-white">
// //         {/* Combined Stats and Action Section */}
// //         <div className="border-b">
// //           <div className="max-w-7xl mx-auto px-6 py-8">
// //             <div className="bg-gray-50 rounded-lg p-6">
// //               <div className="flex flex-col md:flex-row items-center gap-8">
// //                 {/* Main Stats and CTA */}
// //                 <div className="flex-1 w-full">
// //                   <div className="flex items-center justify-between mb-6">
// //                     {/* Resolved Conflicts - Left side */}
// //                     <div className="flex flex-col">
// //                       <div className="text-3xl font-semibold text-green-600">
// //                         {stats.resolved_conflicts}
// //                       </div>
// //                       <div className="text-sm font-medium text-gray-600">
// //                         Resolved
// //                       </div>
// //                     </div>
  
// //                     {/* Active Conflicts and CTA - Right side */}
// //                     <div className="flex items-center gap-4">
// //                       <div className="flex flex-col">
// //                         <div className="text-5xl font-bold text-red-600">
// //                           {stats.active_conflicts}
// //                         </div>
// //                         <div className="text-sm font-medium text-gray-600 mt-1">
// //                           Active Conflicts
// //                         </div>
// //                       </div>
// //                       {stats.active_conflicts > 0 && canResolve && (
// //                         <Button
// //                           size="lg"
// //                           onClick={onStartResolution}
// //                           className="ml-4 bg-red-600 hover:bg-red-700"
// //                         >
// //                           <ArrowUpRightFromCircle className="h-4 w-4 mr-2" />
// //                           Start Resolution
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </div>
  
// //                   {/* Progress Bar */}
// //                   <div className="w-full">
// //                     <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
// //                       <span>Resolution Progress</span>
// //                       <span>{Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100)}% Complete</span>
// //                     </div>
// //                     <Progress
// //                       value={(stats.resolved_conflicts / stats.total_conflicts) * 100}
// //                       className="h-3"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
  
// //               {/* Disabled State Message */}
// //               {!canResolve && stats.active_conflicts > 0 && (
// //                 <div className="mt-4 text-sm text-gray-500 bg-gray-100 p-3 rounded">
// //                   You don't have permission to resolve conflicts. Contact a senior reviewer or admin for assistance.
// //                 </div>
// //               )}
// //               {stats.active_conflicts === 0 && (
// //                 <div className="mt-4 text-sm text-gray-500 bg-green-50 p-3 rounded">
// //                   All conflicts have been resolved. Check the history below for details.
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
  
// //         {/* History Section */}
// //         <div className="flex-1 overflow-hidden">
// //           <ScrollArea className="h-full">
// //             <div className="max-w-7xl mx-auto px-6 py-6">
// //               <h3 className="text-lg font-medium mb-4">Resolution History</h3>
// //               <ConflictsHistory
// //                 conflicts={history?.conflicts || []}
// //                 loading={loading}
// //               />
// //             </div>
// //           </ScrollArea>
// //         </div>
// //       </div>
// //     );
// //   };
  
// //   export default StageCardExpanded;

import React, { useEffect, useState } from 'react';
import { ArrowUpRightFromCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getConflictHistory } from '@/api/reviewsAPI';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConflictsHistory from './ConflictsHistory';

// Option 1: Horizontal Layout with Right Column Button
const StageCardExpanded = ({
  stats,
  projectId,
  stageId,
  onStartResolution,
  canResolve
}) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getConflictHistory(projectId, stageId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Stats Section */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Stats and Progress - Left 2 columns */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-6">
                  {/* Resolved Conflicts */}
                  <div className="flex flex-col">
                    <div className="text-3xl font-semibold text-green-600">
                      {stats.resolved_conflicts}
                    </div>
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Resolved Conflicts
                    </div>
                  </div>

                  {/* Active Conflicts */}
                  <div className="flex flex-col items-end">
                    <div className="text-4xl font-semibold text-red-600">
                      {stats.active_conflicts}
                    </div>
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Active Conflicts
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span>Resolution Progress</span>
                    <span>{Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100)}% Complete</span>
                  </div>
                  <Progress
                    value={(stats.resolved_conflicts / stats.total_conflicts) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Action Button - Right column */}
              <div className="flex items-center justify-center border-l pl-6">
                {stats.active_conflicts > 0 && canResolve ? (
                  <div className="w-full">
                    <Button
                      size="lg"
                      onClick={onStartResolution}
                      className="w-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all px-6 py-5 text-base"
                    >
                      <ArrowUpRightFromCircle className="h-5 w-5 mr-2" />
                      Resolve {stats.active_conflicts} {stats.active_conflicts === 1 ? 'Conflict' : 'Conflicts'}
                    </Button>
                  </div>
                ) : !canResolve && stats.active_conflicts > 0 ? (
                  <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                    You don't have permission to resolve conflicts
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-green-50 p-3 rounded">
                    All conflicts resolved
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h3 className="text-lg font-medium mb-4">Resolution History</h3>
            <ConflictsHistory
              conflicts={history?.conflicts || []}
              loading={loading}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StageCardExpanded;