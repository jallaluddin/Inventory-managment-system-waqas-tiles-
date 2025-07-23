
export enum UnitType {
  PIECE = 'piece',
  BOX = 'box',
  SQFT = 'square feet',
}

export interface Tile {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitType: UnitType;
  price: number; // Price per unit
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Sale {
  id: string;
  customerId: string;
  tileId: string;
  quantity: number;
  totalPrice: number;
  date: Date;
}

export interface Purchase {
  id: string;
  tileId: string;
  supplierName: string;
  quantity: number;
  date: Date;
}
