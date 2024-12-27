// NavItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`
      flex items-center px-4 py-3 text-base transition-colors
      ${isActive 
        ? 'text-gray-900 bg-gray-100 font-medium' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }
    `}
  >
    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
    <span className="ml-3 overflow-hidden transition-all duration-150 whitespace-nowrap opacity-0 group-hover:opacity-100">
      {label}
    </span>
  </Link>
);
export default NavItem;