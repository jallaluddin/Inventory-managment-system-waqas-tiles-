
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TilesIcon } from './IconComponents';

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-600 hover:text-white'
    }`;

  return (
    <header className="bg-primary-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-white">
              <TilesIcon className="h-8 w-8 text-primary-300" />
              <span className="font-bold text-xl">Waqas Tiles</span>
            </NavLink>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/inventory" className={navLinkClass}>Inventory</NavLink>
              <NavLink to="/sales" className={navLinkClass}>Sales</NavLink>
              <NavLink to="/purchases" className={navLinkClass}>Purchases</NavLink>
              <NavLink to="/customers" className={navLinkClass}>Customers</NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
