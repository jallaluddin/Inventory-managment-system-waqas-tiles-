
import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  link: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, link, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <Link to={link} className="text-sm font-medium text-primary-600 hover:text-primary-800">
          View all &rarr;
        </Link>
      </div>
    </div>
  );
};

export default DashboardCard;
