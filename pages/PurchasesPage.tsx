
import React, { useState, useEffect, useCallback } from 'react';
import { Purchase, Tile } from '../types';
import api from '../services/api';
import PageContainer from '../components/PageContainer';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/IconComponents';

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState({ tileId: '', supplierName: '', quantity: 0, date: new Date() });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [purchasesData, tilesData] = await Promise.all([
      api.getPurchases(),
      api.getInventory(),
    ]);
    setPurchases(purchasesData);
    setTiles(tilesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchase.tileId || !newPurchase.supplierName || newPurchase.quantity <= 0) return;
    await api.addPurchase(newPurchase);
    fetchData();
    setIsModalOpen(false);
    setNewPurchase({ tileId: '', supplierName: '', quantity: 0, date: new Date() });
  };

  const getTileName = (tileId: string) => tiles.find(t => t.id === tileId)?.name || 'N/A';
  
  const AddButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <PlusIcon className="w-5 h-5" />
      Record New Purchase
    </button>
  );

  return (
    <>
      <PageContainer title="Purchases" actions={<AddButton />}>
        {loading ? (
          <p>Loading purchases...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tile Purchased</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(purchase.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.supplierName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTileName(purchase.tileId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{purchase.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContainer>
      <Modal title="Record New Purchase" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input type="text" name="supplierName" id="supplierName" value={newPurchase.supplierName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="tileId" className="block text-sm font-medium text-gray-700">Tile</label>
            <select name="tileId" id="tileId" value={newPurchase.tileId} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required>
              <option value="" disabled>Select a tile</option>
              {tiles.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity Purchased</label>
              <input type="number" name="quantity" id="quantity" value={newPurchase.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required min="1" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none">Record Purchase</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PurchasesPage;
