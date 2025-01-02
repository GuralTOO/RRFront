// import React from 'react';
// import { Progress } from "@/components/ui/progress";

// const StageCard = ({
//     id,
//     title,
//     stats,
//     onExpand,
//     canResolve
//   }) => {
//     return (
//       <div
//         className="bg-white rounded-lg shadow-md h-[240px] relative overflow-hidden cursor-pointer"
//         onClick={onExpand}
//       >
//         <div className="p-6 flex flex-col h-full">
//           {/* Header */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//             </div>
//           </div>
  
//           {/* Stats */}
//           <div className="flex-1 flex flex-col justify-between">
//             {/* Active Conflicts Card */}
//             <div className="bg-red-50 rounded-lg p-4 mb-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-red-900">Active Conflicts</span>
//                 <span className="text-2xl font-bold text-red-600">{stats.active_conflicts}</span>
//               </div>
//             </div>
  
//             {/* Progress Section */}
//             <div>
//               <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
//                 <span>Resolution Progress</span>
//                 <span>{Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100)}%</span>
//               </div>
//               <Progress
//                 value={(stats.resolved_conflicts / stats.total_conflicts) * 100}
//                 className="h-2"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-sm text-gray-500">
//                   {stats.resolved_conflicts} of {stats.total_conflicts} resolved
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

// export default StageCard;

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from 'lucide-react';

const StageCard = ({
  id,
  title,
  stats,
  onExpand,
  canResolve
}) => {
  const progressPercentage = Math.round((stats.resolved_conflicts / stats.total_conflicts) * 100);
  
  return (
    <div
      className="group bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer"
      onClick={onExpand}
    >
      <div className="p-6 flex items-center">
        {/* Main Content */}
        <div className="flex-1">
          {/* Title and Active Conflicts */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                {title}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                {stats.resolved_conflicts} of {stats.total_conflicts} resolved
              </div>
            </div>
            
            {stats.active_conflicts > 0 ? (
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold text-red-600">
                  {stats.active_conflicts}
                </div>
                <div className="text-sm font-medium text-red-600">
                  Active
                </div>
              </div>
            ) : (
              <div className="text-sm font-medium text-green-600">
                All Resolved
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <Progress 
              value={progressPercentage} 
              className="h-1.5"
            />
            <div className="text-xs text-gray-500 mt-1">
              {progressPercentage}% Complete
            </div>
          </div>
        </div>

        {/* Arrow Indicator */}
        <ChevronRight 
          className="w-5 h-5 text-gray-400 group-hover:text-gray-600 ml-4 transition-colors" 
        />
      </div>
    </div>
  );
};

export default StageCard;