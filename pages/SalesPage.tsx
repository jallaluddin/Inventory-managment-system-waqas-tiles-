
import React, { useState, useEffect, useCallback } from 'react';
import { Sale, Tile, Customer } from '../types';
import api from '../services/api';
import PageContainer from '../components/PageContainer';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/IconComponents';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({ customerId: '', tileId: '', quantity: 0, totalPrice: 0, date: new Date() });

  const fetchSalesData = useCallback(async () => {
    setLoading(true);
    const [salesData, tilesData, customersData] = await Promise.all([
      api.getSales(),
      api.getInventory(),
      api.getCustomers(),
    ]);
    setSales(salesData);
    setTiles(tilesData);
    setCustomers(customersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedSale = { ...newSale, [name]: value };
    
    if (name === 'quantity' || name === 'tileId') {
      const tile = tiles.find(t => t.id === (name === 'tileId' ? value : updatedSale.tileId));
      const quantity = name === 'quantity' ? Number(value) : updatedSale.quantity;
      if (tile) {
        updatedSale.totalPrice = tile.price * quantity;
      }
    }
    
    setNewSale(updatedSale);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.customerId || !newSale.tileId || newSale.quantity <= 0) return;
    await api.addSale(newSale);
    fetchSalesData();
    setIsModalOpen(false);
    setNewSale({ customerId: '', tileId: '', quantity: 0, totalPrice: 0, date: new Date() });
  };
  
  const getTileName = (tileId: string) => tiles.find(t => t.id === tileId)?.name || 'N/A';
  const getCustomerName = (customerId: string) => customers.find(c => c.id === customerId)?.name || 'N/A';

  const AddButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <PlusIcon className="w-5 h-5" />
      Record New Sale
    </button>
  );

  return (
    <>
      <PageContainer title="Sales" actions={<AddButton />}>
        {loading ? (
          <p>Loading sales...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tile Sold</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getCustomerName(sale.customerId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTileName(sale.tileId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${sale.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContainer>
      <Modal title="Record New Sale" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer</label>
            <select name="customerId" id="customerId" value={newSale.customerId} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
              <option value="" disabled>Select a customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tileId" className="block text-sm font-medium text-gray-700">Tile</label>
            <select name="tileId" id="tileId" value={newSale.tileId} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
              <option value="" disabled>Select a tile</option>
              {tiles.map(t => <option key={t.id} value={t.id}>{t.name} (Stock: {t.quantity})</option>)}
            </select>
          </div>
          <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity Sold</label>
              <input type="number" name="quantity" id="quantity" value={newSale.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required min="1" />
          </div>
          <div>
              <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
              <input type="text" name="totalPrice" id="totalPrice" value={`$${newSale.totalPrice.toFixed(2)}`} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none">Record Sale</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SalesPage;
