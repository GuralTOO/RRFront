// src/Scripts/navigation/components/NavItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label, isActive }) => (
  <li>
    <Link
      to={to}
      className={cn(
        "flex items-center px-2 py-1.5 text-sm rounded-md transition-colors",
        "hover:bg-gray-100",
        isActive ? "text-blue-600" : "text-gray-600"
      )}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Link>
  </li>
);

export default NavItem;