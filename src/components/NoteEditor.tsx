'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Note, NoteItem, Adjustment } from '@/types';

export default function NoteEditor({ note, onClose }: { note: Note; onClose: () => void }) {
  const { menuItems, updateNote, closeNote, reopenNote } = useApp();
  const [items, setItems] = useState<NoteItem[]>(note.items);
  const [adjustments, setAdjustments] = useState<Adjustment[]>(note.adjustments);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  useEffect(() => {
    updateNote(note.id, items, adjustments);
  }, [items, adjustments]);

  // Mettre à jour les prix des items si les prix du menu changent
  useEffect(() => {
    const updatedItems = items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (menuItem && menuItem.price !== item.price) {
        return { ...item, price: menuItem.price };
      }
      return item;
    });
    
    // Vérifier si des prix ont changé
    const pricesChanged = updatedItems.some((item, index) => item.price !== items[index].price);
    if (pricesChanged) {
      setItems(updatedItems);
    }
  }, [menuItems]);

  const addItem = (menuItemId: string) => {
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!menuItem) return;

    const existingItem = items.find(i => i.menuItemId === menuItemId);
    if (existingItem) {
      setItems(items.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity + 1, price: menuItem.price }
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
    if (!existingItem) return;

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

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const total = itemsTotal + adjustmentsTotal;

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
      <div className="bg-primary rounded-lg p-4 sm:p-6 w-full max-w-6xl border-2 border-accent my-4 max-h-[95vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-accent truncate">{note.title}</h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              {note.status === 'ouvert' ? '🟢 Ouvert' : '🔴 Clôturé'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-accent hover:text-accent-light text-2xl sm:text-3xl self-end sm:self-auto"
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
                <div key={value} className="bg-primary-dark rounded-lg p-3 sm:p-4">
                  <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">{label}</h4>
                  <div className="space-y-2">
                    {categoryItems.map(menuItem => {
                      const noteItem = items.find(i => i.menuItemId === menuItem.id);
                      const quantity = noteItem?.quantity || 0;

                      return (
                        <div
                          key={menuItem.id}
                          className="flex items-center justify-between bg-primary rounded p-2 sm:p-3 border border-accent"
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-white font-medium text-sm sm:text-base truncate">
                              {menuItem.name}
                            </p>
                            <p className="text-accent text-xs sm:text-sm">{menuItem.price.toFixed(2)}€</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(menuItem.id)}
                              disabled={note.status === 'cloture'}
                              className="bg-accent-coral hover:bg-accent-orange disabled:bg-gray-600 disabled:cursor-not-allowed text-white w-8 h-8 rounded font-bold text-lg"
                            >
                              −
                            </button>
                            <span className="text-accent font-bold text-base sm:text-lg w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addItem(menuItem.id)}
                              disabled={note.status === 'cloture'}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white w-8 h-8 rounded font-bold text-lg"
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

          {/* Note Summary */}
          <div className="space-y-4">
            <h3 className="text-accent font-bold text-xl border-b-2 border-accent pb-2">RÉSUMÉ</h3>

            {/* Items in note */}
            <div className="bg-primary-dark rounded-lg p-3 sm:p-4">
              <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">ARTICLES</h4>
              {items.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun article</p>
              ) : (
                <div className="space-y-2">
                  {items.map(item => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    if (!menuItem) return null;

                    return (
                      <div key={item.menuItemId} className="flex justify-between text-white text-sm sm:text-base">
                        <span>{menuItem.name} x{item.quantity}</span>
                        <span className="text-accent font-semibold">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t border-accent pt-2 mt-2 flex justify-between font-bold text-sm sm:text-base">
                    <span className="text-white">Sous-total</span>
                    <span className="text-accent">{itemsTotal.toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </div>

            {/* Adjustments */}
            <div className="bg-primary-dark rounded-lg p-3 sm:p-4">
              <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">AJUSTEMENTS</h4>
              
              {note.status === 'ouvert' && (
                <div className="mb-4 space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Montant (positif pour ajouter, négatif pour retirer)"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAdjustment()}
                    className="w-full bg-primary text-white border-2 border-accent rounded px-3 py-2 focus:outline-none focus:border-accent-light text-sm"
                  />
                  <button
                    onClick={addAdjustment}
                    className="w-full bg-accent hover:bg-accent-light text-primary py-2 rounded font-semibold transition text-sm"
                  >
                    AJOUTER
                  </button>
                </div>
              )}

              {adjustments.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun ajustement</p>
              ) : (
                <div className="space-y-2">
                  {adjustments.map(adj => (
                    <div key={adj.id} className="flex justify-between items-center bg-primary rounded p-2 text-sm">
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs">
                          {new Date(adj.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${adj.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {adj.amount >= 0 ? '+' : ''}{adj.amount.toFixed(2)}€
                        </span>
                        {note.status === 'ouvert' && (
                          <button
                            onClick={() => removeAdjustment(adj.id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="bg-accent rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-xl sm:text-2xl">TOTAL</span>
                <span className="text-primary font-bold text-2xl sm:text-3xl">
                  {total.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {note.status === 'ouvert' ? (
                <button
                  onClick={() => {
                    if (confirm('Clôturer cette note ?')) {
                      closeNote(note.id);
                    }
                  }}
                  className="w-full bg-accent-coral hover:bg-accent-orange text-white py-3 rounded font-semibold transition text-sm sm:text-base"
                >
                  CLÔTURER LA NOTE
                </button>
              ) : (
                <button
                  onClick={() => reopenNote(note.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition text-sm sm:text-base"
                >
                  ROUVRIR LA NOTE
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
