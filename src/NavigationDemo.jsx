import React, { useState } from 'react';
import { Search, Book, User, Home, FileText, Filter, Database, Settings, ChevronRight, Layout, AlertCircle, Download, Upload } from 'lucide-react';
import { cn } from "@/lib/utils";

const OutsideProjectNav = () => (
  <div className="w-64 border-r bg-gray-50/50 flex flex-col min-h-screen">
    <div className="p-4 border-b">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold">RR</span>
        </div>
        <span className="ml-2 font-semibold text-gray-900">RapidReview</span>
      </div>
    </div>
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        <NavItem icon={Layout} label="Projects" active />
        <NavItem icon={Search} label="Search" />
        <NavItem icon={Book} label="Documentation" />
        <NavItem icon={User} label="Account" />
      </ul>
    </nav>
  </div>
);

const InsideProjectNav = ({ projectName = "Project Name" }) => (
  <div className="w-64 border-r bg-gray-50/50 flex flex-col min-h-screen">
    <div className="p-4 border-b">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer">
          <span className="text-white font-bold">RR</span>
        </div>
        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
        <span className="font-semibold text-gray-900 truncate">{projectName}</span>
      </div>
    </div>
    <nav className="flex-1 p-4">
      <div className="space-y-6">
        <ul className="space-y-2">
          <NavItem icon={Home} label="Home" active />
          <NavItem icon={FileText} label="Papers" />
          <NavItem icon={Filter} label="Selection Criteria" />
        </ul>

        <div>
          <div className="h-px bg-gray-200 my-4" />
          <ul className="space-y-2">
            <NavItem icon={Filter} label="Abstract Screening" />
            <NavItem icon={Filter} label="Full-Text Screening" />
            <NavItem icon={Database} label="Data Extraction" />
            <NavItem icon={AlertCircle} label="Conflicts" />
          </ul>
        </div>

        <div>
          <div className="h-px bg-gray-200 my-4" />
          <ul className="space-y-2">
            <NavItem icon={Upload} label="Import" />
            <NavItem icon={Download} label="Export" />
            <NavItem icon={Settings} label="Project Settings" />
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

const NavItem = ({ icon: Icon, label, active = false }) => (
  <li>
    <button
      className={cn(
        "w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors",
        "hover:bg-gray-100",
        active ? "text-blue-600" : "text-gray-600"
      )}
    >
      <Icon className={cn("h-4 w-4 mr-2", active && "text-blue-600")} />
      {label}
    </button>
  </li>
);

// Demo component showing both navigations side by side
const NavigationDemo = () => (
  <div className="flex gap-8 p-8 bg-white min-h-screen">
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <OutsideProjectNav />
    </div>
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <InsideProjectNav projectName="Systematic Review of ML in Healthcare" />
    </div>
  </div>
);

export default NavigationDemo;