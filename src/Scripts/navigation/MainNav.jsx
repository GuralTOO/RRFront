import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Search, BookOpen, User } from 'lucide-react';
import NavItem from './components/NavItem';

const NavSection = ({ children }) => (
  <div className="space-y-1">
    {children}
  </div>
);

const MainNav = () => {
  const location = useLocation();

  return (
    <div className="w-20 hover:w-64 group transition-all duration-200 ease-in-out fixed top-0 left-0 h-full bg-white flex flex-col border-r border-gray-200 z-50">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center px-4 bg-white">
          {/* Logo container that's always visible */}
          <div className="flex items-center min-w-[40px]">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-semibold text-lg">RR</span>
            </div>
          </div>
          
          {/* Text that appears only when expanded */}
          <div className="ml-3 flex-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="font-medium text-sm text-gray-800 whitespace-nowrap">
              RapidReview
            </span>
          </div>
        </div>
        <div className="h-[1px] bg-gray-200"></div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <NavSection>
          <NavItem 
            to="/projects"
            icon={Layout}
            label="Projects"
            isActive={location.pathname === '/projects'}
          />
          <NavItem 
            to="/search"
            icon={Search}
            label="Search"
            isActive={location.pathname === '/search'}
          />
          <NavItem 
            to="/docs"
            icon={BookOpen}
            label="Documentation"
            isActive={location.pathname === '/docs'}
          />
          <NavItem 
            to="/account"
            icon={User}
            label="Account"
            isActive={location.pathname === '/account'}
          />
        </NavSection>
      </nav>
    </div>
  );
};

export default MainNav;