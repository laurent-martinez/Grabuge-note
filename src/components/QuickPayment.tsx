'use client';

import { useState } from 'react';
import { MenuItem } from '@/types';

interface QuickPaymentProps {
  menuItems: MenuItem[];
  onClose: () => void;
}

interface Adjustment {
  id: string;
  amount: number;
  timestamp: Date;
}

export default function QuickPayment({ menuItems, onClose }: QuickPaymentProps) {
  const [items, setItems] = useState<{menuItemId: string, quantity: number, price: number}[]>([]);
  const [tempRemovals, setTempRemovals] = useState<{menuItemId: string, name: string, price: number}[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('');
  const [amountGiven, setAmountGiven] = useState<string>('');

  const addItem = (menuItemId: string) => {
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!menuItem) return;

    const existingItem = items.find(i => i.menuItemId === menuItemId);
    if (existingItem) {
      setItems(items.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setItems([...items, {
        menuItemId,
        quantity: 1,
        price: menuItem.price,
      }]);
    }
  };

  const removeItem = (menuItemId: string) => {
    const existingItem = items.find(i => i.menuItemId === menuItemId);
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!existingItem || !menuItem) return;

    // Ajouter aux retraits temporaires
    setTempRemovals([...tempRemovals, {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price
    }]);

    if (existingItem.quantity > 1) {
      setItems(items.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ));
    } else {
      setItems(items.filter(i => i.menuItemId !== menuItemId));
    }
  };

  const clearTempRemovals = () => {
    setTempRemovals([]);
  };

  const addAdjustment = () => {
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount === 0) return;

    const newAdjustment: Adjustment = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date(),
    };

    setAdjustments([...adjustments, newAdjustment]);
    setAdjustmentAmount('');
  };

  const removeAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(a => a.id !== id));
  };

  const handleComplete = () => {
    // Fermer automatiquement la modale
    onClose();
  };

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const total = itemsTotal + adjustmentsTotal;
  const tempRemovalsTotal = tempRemovals.reduce((sum, item) => sum + item.price, 0);
  const given = parseFloat(amountGiven) || 0;
  const change = given - total;

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const categories = [
    { value: 'boisson', label: 'BOISSONS' },
    { value: 'entree', label: 'ENTRÉES' },
    { value: 'plat', label: 'PLATS' },
    { value: 'dessert', label: 'DESSERTS' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 w-full max-w-6xl border-2 border-accent my-4 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent">⚡ PAIEMENT RAPIDE</h2>
          <button
            onClick={onClose}
            className="text-accent hover:text-accent-light text-2xl sm:text-3xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Menu Items */}
          <div className="space-y-4">
            <h3 className="text-accent font-bold text-xl border-b-2 border-accent pb-2">MENU</h3>
            
            {categories.map(({ value, label }) => {
              const categoryItems = groupedMenuItems[value] || [];
              if (categoryItems.length === 0) return null;

              return (
                <div key={value} className="bg-white shadow-md rounded-lg p-3 sm:p-4">
                  <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">{label}</h4>
                  <div className="space-y-2">
                    {categoryItems.map(menuItem => {
                      const item = items.find(i => i.menuItemId === menuItem.id);
                      const quantity = item?.quantity || 0;

                      return (
                        <div
                          key={menuItem.id}
                          className="flex items-center justify-between bg-gray-50 rounded p-2 sm:p-3 border border-accent"
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-gray-900 font-medium text-sm sm:text-base truncate">
                              {menuItem.name}
                            </p>
                            <p className="text-accent text-xs sm:text-sm">{menuItem.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(menuItem.id)}
                              className="bg-red-500 hover:opacity-90 text-white w-8 h-8 rounded font-bold text-lg"
                            >
                              −
                            </button>
                            <span className="text-accent font-bold text-base sm:text-lg w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addItem(menuItem.id)}
                              className="bg-accent-light hover:opacity-90 text-white w-8 h-8 rounded font-bold text-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Section */}
          <div className="space-y-4">
            <h3 className="text-accent font-bold text-xl border-b-2 border-accent pb-2">PAIEMENT</h3>

            {/* Articles */}
            <div className="bg-white shadow-md rounded-lg p-3 sm:p-4">
              <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">ARTICLES</h4>
              {items.length === 0 ? (
                <p className="text-gray-600 text-sm">Aucun article</p>
              ) : (
                <div className="space-y-2">
                  {items.map(item => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    if (!menuItem) return null;

                    return (
                      <div key={item.menuItemId} className="flex justify-between items-center text-gray-900 text-sm sm:text-base">
                        <div className="flex-1 flex justify-between items-center">
                          <span>{menuItem.name} x{item.quantity}</span>
                          <span className="text-accent font-semibold">
                            {(item.price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="ml-3 bg-red-500 hover:opacity-90 text-white w-7 h-7 rounded font-bold text-sm flex items-center justify-center"
                        >
                          −
                        </button>
                      </div>
                    );
                  })}
                  <div className="border-t border-accent pt-2 mt-2 flex justify-between font-bold text-sm sm:text-base">
                    <span className="text-gray-900">Sous-total</span>
                    <span className="text-accent">{itemsTotal.toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </div>

            {/* Retraits temporaires */}
            {tempRemovals.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-orange-600 font-semibold text-sm sm:text-base">RETRAITS EN COURS</h4>
                  <button
                    onClick={clearTempRemovals}
                    className="text-red-500 hover:text-red-700 text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  {tempRemovals.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-900 text-sm">
                      <span>{item.name}</span>
                      <span className="text-orange-600 font-semibold">
                        -{item.price.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-orange-400 pt-2 mt-2 flex justify-between font-bold">
                    <span className="text-gray-900">À payer</span>
                    <span className="text-orange-600 text-lg">{tempRemovalsTotal.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            )}

            {/* Adjustments */}
            <div className="bg-white shadow-md rounded-lg p-3 sm:p-4">
              <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">AJUSTEMENTS</h4>
              
              <div className="mb-4 space-y-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Montant (positif pour ajouter, négatif pour retirer)"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAdjustment()}
                  className="w-full bg-white text-gray-900 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-accent text-sm"
                />
                <button
                  onClick={addAdjustment}
                  className="w-full bg-accent hover:opacity-90 text-white py-2 rounded font-semibold transition text-sm"
                >
                  AJOUTER
                </button>
              </div>

              {adjustments.length === 0 ? (
                <p className="text-gray-600 text-sm">Aucun ajustement</p>
              ) : (
                <div className="space-y-2">
                  {adjustments.map(adj => (
                    <div key={adj.id} className="flex justify-between items-center bg-gray-50 rounded p-2 text-sm">
                      <div className="flex-1">
                        <p className="text-gray-600 text-xs">
                          {adj.timestamp.toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${adj.amount >= 0 ? 'text-accent-light' : 'text-red-500'}`}>
                          {adj.amount >= 0 ? '+' : ''}{adj.amount.toFixed(2)}€
                        </span>
                        <button
                          onClick={() => removeAdjustment(adj.id)}
                          className="text-red-500 hover:opacity-80"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diviser le paiement */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">DIVISER LE PAIEMENT</h4>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-gray-900 text-sm font-medium whitespace-nowrap">Nombre de personnes :</label>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="number"
                    min="1"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    placeholder="1"
                    className="w-20 bg-gray-50 text-gray-900 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-accent text-center font-bold"
                  />
                  <span className="text-gray-900 text-sm">→</span>
                  <div className="flex-1 bg-accent-light bg-opacity-10 rounded px-4 py-2 border-2 border-accent-light">
                    <span className="text-accent-light font-bold text-base sm:text-lg">
                      {numberOfPeople && parseInt(numberOfPeople) > 0 
                        ? (total / parseInt(numberOfPeople)).toFixed(2) 
                        : total.toFixed(2)}€ / pers.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-accent rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xl sm:text-2xl">TOTAL</span>
                <span className="text-white font-bold text-2xl sm:text-3xl">
                  {total.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Montant donné */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <label className="block text-accent font-semibold mb-3 text-sm sm:text-base">
                Montant donné
              </label>
              <input
                type="number"
                step="0.01"
                value={amountGiven}
                onChange={(e) => setAmountGiven(e.target.value)}
                placeholder="20.00"
                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-accent text-center text-xl font-bold"
              />
            </div>

            {/* Monnaie à rendre */}
            {amountGiven && given >= total && (
              <div className={`rounded-lg p-4 sm:p-6 ${change > 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold text-xl sm:text-2xl ${change > 0 ? 'text-green-700' : 'text-gray-700'}`}>
                    MONNAIE À RENDRE
                  </span>
                  <span className={`font-bold text-2xl sm:text-3xl ${change > 0 ? 'text-green-700' : 'text-gray-700'}`}>
                    {change.toFixed(2)}€
                  </span>
                </div>
              </div>
            )}

            {/* Montant insuffisant */}
            {amountGiven && given < total && (
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
                <p className="text-red-700 font-semibold text-center">
                  Montant insuffisant ! Il manque {(total - given).toFixed(2)}€
                </p>
              </div>
            )}

            {/* Bouton Terminer */}
            <button
              onClick={handleComplete}
              disabled={!amountGiven || given < total}
              className="w-full bg-accent hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition"
            >
              TERMINER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}