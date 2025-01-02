import React from 'react';
import { ChevronRight } from 'lucide-react';

const PageHeader = ({ icon: Icon, title, breadcrumb, children, onBreadcrumbClick }) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-gray-500" />}
          
          {breadcrumb ? (
            <div className="flex items-center">
              <button
                onClick={() => onBreadcrumbClick?.(breadcrumb[0])}
                className="text-lg text-gray-500 hover:text-gray-900 transition-colors"
              >
                {breadcrumb[0]}
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              <span className="text-gray-900 font-semibold">{breadcrumb[1]}</span>
            </div>
          ) : (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>
        
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;