export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'boisson' | 'plat' | 'dessert' | 'entree';
}

export interface NoteItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface Adjustment {
  id: string;
  amount: number;
  reason?: string;
  timestamp: Date;
}

export interface Note {
  id: string;
  title: string;
  items: NoteItem[];
  adjustments: Adjustment[];
  total: number;
  status: 'ouvert' | 'cloture';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  username: string;
  password: string;
}
