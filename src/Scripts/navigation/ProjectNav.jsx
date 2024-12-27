import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import NavItem from './components/NavItem';
import { 
  Home,                 // Overview
  Files,               // Papers (changed from FileText)
  ListFilter,          // Selection Criteria (changed from Filter)
  ScanText,          // Abstract Screening (changed from Filter)
  BookOpen,            // Full-text Screening (changed from FileText)
  TableProperties,     // Data Extraction (changed from Database)
  AlertOctagon,        // Conflicts (changed from AlertCircle)
  Upload,              // Import
  Download,            // Export
  Settings,            // Project Settings
  ChevronLeft
} from 'lucide-react';

const NavSection = ({ children }) => (
  <div className="space-y-1">
    {children}
  </div>
);


const ProjectNav = ({ projectName }) => {
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const getIsActive = (path) => {
    return location.pathname === `/p/${projectId}${path}`;
  };

  return (
    <div className="w-20 hover:w-64 group transition-all duration-200 ease-in-out fixed top-0 left-0 h-full bg-white flex flex-col border-r border-gray-200 z-50">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center px-4 bg-white">
          {/* Logo container that's always visible */}
          <div className="flex items-center min-w-[40px]">
            <div 
              onClick={() => navigate('/projects')}
              className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center cursor-pointer"
            >
              <span className="text-white font-semibold text-lg">RR</span>
            </div>
          </div>
          
          {/* Back arrow and project name that appears only when expanded */}
          <div className="ml-3 flex-1 flex items-center overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="ml-2 font-medium text-sm text-gray-800 whitespace-nowrap">
              {projectName}
            </span>
          </div>
        </div>
        <div className="h-[1px] bg-gray-200"></div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Project Management Section */}
        <NavSection>
          <NavItem 
            to={`/p/${projectId}`}
            icon={Home}
            label="Overview"
            isActive={location.pathname === `/p/${projectId}`}
          />
          <NavItem 
            to={`/p/${projectId}/papers`}
            icon={Files}
            label="Papers"
            isActive={getIsActive('/papers')}
          />
          <NavItem 
            to={`/p/${projectId}/criteria`}
            icon={ListFilter}
            label="Selection Criteria"
            isActive={getIsActive('/criteria')}
          />
        </NavSection>

        {/* Review Queue Section */}
        <NavSection>
          <NavItem 
            to={`/p/${projectId}/review/abstract`}
            icon={ScanText}
            label="Abstract Screening"
            isActive={getIsActive('/review/abstract')}
          />
          <NavItem 
            to={`/p/${projectId}/review/fulltext`}
            icon={BookOpen}
            label="Full-text Screening"
            isActive={getIsActive('/review/fulltext')}
          />
          <NavItem 
            to={`/p/${projectId}/review/extraction`}
            icon={TableProperties}
            label="Data Extraction"
            isActive={getIsActive('/review/extraction')}
          />
          <NavItem 
            to={`/p/${projectId}/review/conflicts`}
            icon={AlertOctagon}
            label="Conflicts"
            isActive={getIsActive('/review/conflicts')}
          />
        </NavSection>

        {/* Project Management Section */}
        <NavSection>
          <NavItem 
            to={`/p/${projectId}/import`}
            icon={Upload}
            label="Import"
            isActive={getIsActive('/import')}
          />
          <NavItem 
            to={`/p/${projectId}/export`}
            icon={Download}
            label="Export"
            isActive={getIsActive('/export')}
          />
          <NavItem 
            to={`/p/${projectId}/settings`}
            icon={Settings}
            label="Project Settings"
            isActive={getIsActive('/settings')}
          />
        </NavSection>
      </nav>
    </div>
  );
};

export default ProjectNav;