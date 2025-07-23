
import { Tile, Customer, Sale, Purchase, UnitType } from '../types';

let mockTiles: Tile[] = [
  { id: 't1', name: 'Calacatta Gold Marble', sku: 'CGM-001', quantity: 150, unitType: UnitType.SQFT, price: 12.50, description: 'Elegant white marble with gold veining.' },
  { id: 't2', name: 'Nero Marquina Porcelain', sku: 'NMP-002', quantity: 300, unitType: UnitType.PIECE, price: 8.75, description: 'Durable black porcelain with white streaks.' },
  { id: 't3', name: 'Classic Subway Tile', sku: 'CST-003', quantity: 100, unitType: UnitType.BOX, price: 25.00, description: 'Timeless white ceramic subway tiles.' },
];

let mockCustomers: Customer[] = [
  { id: 'c1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St, Anytown, USA' },
  { id: 'c2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', address: '456 Oak Ave, Somewhere, USA' },
];

let mockSales: Sale[] = [
  { id: 's1', customerId: 'c1', tileId: 't1', quantity: 50, totalPrice: 625, date: new Date() },
];

let mockPurchases: Purchase[] = [
  { id: 'p1', tileId: 't2', supplierName: 'Global Ceramics Inc.', quantity: 200, date: new Date() },
];

const api = {
  // Tiles
  getInventory: async (): Promise<Tile[]> => [...mockTiles],
  addTile: async (tile: Omit<Tile, 'id'>): Promise<Tile> => {
    const newTile: Tile = { ...tile, id: `t${Date.now()}` };
    mockTiles.push(newTile);
    return newTile;
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => [...mockCustomers],
  addCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    const newCustomer: Customer = { ...customer, id: `c${Date.now()}` };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  // Sales
  getSales: async (): Promise<Sale[]> => [...mockSales],
  addSale: async (sale: Omit<Sale, 'id'>): Promise<Sale> => {
    const newSale: Sale = { ...sale, id: `s${Date.now()}` };
    mockSales.push(newSale);
    // Adjust inventory
    const tile = mockTiles.find(t => t.id === sale.tileId);
    if (tile) {
      tile.quantity -= sale.quantity;
    }
    return newSale;
  },

  // Purchases
  getPurchases: async (): Promise<Purchase[]> => [...mockPurchases],
  addPurchase: async (purchase: Omit<Purchase, 'id'>): Promise<Purchase> => {
    const newPurchase: Purchase = { ...purchase, id: `p${Date.now()}` };
    mockPurchases.push(newPurchase);
     // Adjust inventory
     const tile = mockTiles.find(t => t.id === purchase.tileId);
     if (tile) {
       tile.quantity += purchase.quantity;
     }
    return newPurchase;
  },
};

export default api;
