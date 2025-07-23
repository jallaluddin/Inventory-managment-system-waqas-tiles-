
import React from 'react';

interface PageContainerProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, actions, children }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {actions && <div className="mt-4 md:mt-0">{actions}</div>}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
