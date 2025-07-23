
import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { Tile, Customer, Sale, Purchase } from '../types';
import api from '../services/api';
import { TilesIcon, UsersIcon, ShoppingCartIcon, PackageIcon } from '../components/IconComponents';

const HomePage: React.FC = () => {
  const [inventory, setInventory] = useState<Tile[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [inv, cust, sls, pur] = await Promise.all([
        api.getInventory(),
        api.getCustomers(),
        api.getSales(),
        api.getPurchases(),
      ]);
      setInventory(inv);
      setCustomers(cust);
      setSales(sls);
      setPurchases(pur);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }
  
  const totalStock = inventory.reduce((acc, tile) => acc + tile.quantity, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's a summary of your business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Inventory Items"
          value={inventory.length}
          link="/inventory"
          icon={<TilesIcon className="w-10 h-10" />}
          color="border-blue-500"
        />
        <DashboardCard 
          title="Total Customers"
          value={customers.length}
          link="/customers"
          icon={<UsersIcon className="w-10 h-10" />}
          color="border-green-500"
        />
        <DashboardCard 
          title="Total Sales Orders"
          value={sales.length}
          link="/sales"
          icon={<ShoppingCartIcon className="w-10 h-10" />}
          color="border-yellow-500"
        />
        <DashboardCard 
          title="Total Purchase Orders"
          value={purchases.length}
          link="/purchases"
          icon={<PackageIcon className="w-10 h-10" />}
          color="border-purple-500"
        />
      </div>
    </div>
  );
};

export default HomePage;
