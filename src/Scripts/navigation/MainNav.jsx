// src/Scripts/navigation/MainNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Search, BookOpen, User } from 'lucide-react';
import NavItem from './components/NavItem';

const MainNav = () => {
  const location = useLocation();

  return (
    <div className="w-64 border-r bg-gray-50/50 flex flex-col min-h-screen">
      {/* Logo/Header */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold">RR</span>
          </div>
          <span className="ml-2 font-semibold text-gray-900">RapidReview</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
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
        </ul>
      </nav>
    </div>
  );
};

export default MainNav;