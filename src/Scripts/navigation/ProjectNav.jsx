// src/Scripts/navigation/ProjectNav.jsx
import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Home, FileText, Filter, Database, 
  AlertCircle, Settings, Upload, Download,
  ChevronRight 
} from 'lucide-react';
import NavItem from './components/NavItem';

const ProjectNav = ({ projectName }) => {
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const getIsActive = (path) => {
    return location.pathname === `/p/${projectId}${path}`;
  };

  return (
    <div className="w-64 border-r bg-gray-50/50 flex flex-col min-h-screen">
      {/* Logo/Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/projects')}
          >
            <span className="text-white font-bold">RR</span>
          </div>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="font-semibold text-gray-900 truncate">{projectName}</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-6">
          {/* Main sections */}
          <ul className="space-y-2">
            <NavItem 
              to={`/p/${projectId}`}
              icon={Home}
              label="Home"
              isActive={location.pathname === `/p/${projectId}`}
            />
            <NavItem 
              to={`/p/${projectId}/papers`}
              icon={FileText}
              label="Papers"
              isActive={getIsActive('/papers')}
            />
            <NavItem 
              to={`/p/${projectId}/criteria`}
              icon={Filter}
              label="Selection Criteria"
              isActive={getIsActive('/criteria')}
            />
          </ul>

          {/* Review sections */}
          <div>
            <div className="h-px bg-gray-200" />
            <ul className="mt-4 space-y-2">
              <NavItem 
                to={`/p/${projectId}/review/abstract`}
                icon={Filter}
                label="Abstract Screening"
                isActive={getIsActive('/review/abstract')}
              />
              <NavItem 
                to={`/p/${projectId}/review/fulltext`}
                icon={Filter}
                label="Full-text Screening"
                isActive={getIsActive('/review/fulltext')}
              />
              <NavItem 
                to={`/p/${projectId}/review/extraction`}
                icon={Database}
                label="Data Extraction"
                isActive={getIsActive('/review/extraction')}
              />
              <NavItem 
                to={`/p/${projectId}/review/conflicts`}
                icon={AlertCircle}
                label="Conflicts"
                isActive={getIsActive('/review/conflicts')}
              />
            </ul>
          </div>

          {/* Project management */}
          <div>
            <div className="h-px bg-gray-200" />
            <ul className="mt-4 space-y-2">
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ProjectNav;