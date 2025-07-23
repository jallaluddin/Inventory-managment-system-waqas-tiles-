
import React, { useState, useEffect, useCallback } from 'react';
import { Tile, UnitType } from '../types';
import api from '../services/api';
import PageContainer from '../components/PageContainer';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/IconComponents';
import { generateTileDescription } from '../services/geminiService';


const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTile, setNewTile] = useState({ name: '', sku: '', quantity: 0, unitType: UnitType.PIECE, price: 0 });
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    const data = await api.getInventory();
    setInventory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['quantity', 'price'].includes(name);
    setNewTile(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };
  
  const handleGenerateDescription = async () => {
      if (!newTile.name) {
          alert("Please enter a tile name first.");
          return;
      }
      setGeneratingDesc(true);
      const description = await generateTileDescription(newTile.name);
      setNewTile(prev => ({...prev, description}));
      setGeneratingDesc(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTile.name || !newTile.sku) return;
    await api.addTile(newTile);
    fetchInventory();
    setIsModalOpen(false);
    setNewTile({ name: '', sku: '', quantity: 0, unitType: UnitType.PIECE, price: 0 });
  };
  
  const AddButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <PlusIcon className="w-5 h-5" />
      Add New Tile
    </button>
  );

  return (
    <>
      <PageContainer title="Inventory" actions={<AddButton />}>
        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((tile) => (
                  <tr key={tile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tile.name}</div>
                      <div className="text-sm text-gray-500">{tile.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tile.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{tile.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{tile.unitType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tile.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContainer>
      <Modal title="Add New Tile" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tile Name</label>
            <input type="text" name="name" id="name" value={newTile.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" name="sku" id="sku" value={newTile.sku} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
          </div>
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <div className="flex items-center gap-2">
                 <textarea name="description" id="description" value={newTile.description} onChange={handleInputChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                <button type="button" onClick={handleGenerateDescription} disabled={generatingDesc} className="mt-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 disabled:opacity-50 text-sm">
                    {generatingDesc ? '...' : 'AI'}
                </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" name="quantity" id="quantity" value={newTile.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price/Unit</label>
              <input type="number" name="price" id="price" step="0.01" value={newTile.price} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
          </div>
          <div>
            <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">Unit Type</label>
            <select name="unitType" id="unitType" value={newTile.unitType} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              {Object.values(UnitType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none">Add Tile</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default InventoryPage;
