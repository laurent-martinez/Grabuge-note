'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Note, NoteItem, Adjustment } from '@/types';

export default function NoteEditor({ note, onClose }: { note: Note; onClose: () => void }) {
  const { menuItems, updateNote, closeNote, reopenNote } = useApp();
  
  // ⚠️ VÉRIFICATION ULTRA STRICTE TOUT EN HAUT
  if (!menuItems) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><p className="text-gray-900 text-xl">Chargement...</p></div></div>;
  }
  
  if (!Array.isArray(menuItems)) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><p className="text-gray-900 text-xl">Erreur: menuItems n'est pas un tableau</p></div></div>;
  }
  
  if (menuItems.length === 0) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><p className="text-gray-900 text-xl">Menu vide...</p></div></div>;
  }
  
  const [items, setItems] = useState<NoteItem[]>(note.items);
  const [adjustments, setAdjustments] = useState<Adjustment[]>(note.adjustments);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('');
  const [tempRemovals, setTempRemovals] = useState<{menuItemId: string, name: string, price: number}[]>([]);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showDivision, setShowDivision] = useState(false);

  useEffect(() => {
    updateNote(note.id, items, adjustments);
  }, [items, adjustments]);

  const addItem = (menuItemId: string) => {
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!menuItem) return;
    const existingItem = items.find(i => i.menuItemId === menuItemId);
    if (existingItem) {
      setItems(items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1, price: menuItem.price } : i));
    } else {
      setItems([...items, { menuItemId, quantity: 1, price: menuItem.price }]);
    }
  };

  const removeItem = (menuItemId: string) => {
    const existingItem = items.find(i => i.menuItemId === menuItemId);
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!existingItem || !menuItem) return;
    setTempRemovals([...tempRemovals, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price }]);
    if (existingItem.quantity > 1) {
      setItems(items.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setItems(items.filter(i => i.menuItemId !== menuItemId));
    }
  };

  const clearTempRemovals = () => setTempRemovals([]);
  
  const addAdjustment = () => {
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount === 0) return;
    setAdjustments([...adjustments, { id: Date.now().toString(), amount, timestamp: new Date() }]);
    setAdjustmentAmount('');
  };

  const removeAdjustment = (id: string) => setAdjustments(adjustments.filter(a => a.id !== id));
  
  const handleCloseNote = () => {
    if (confirm('Clôturer cette note ?')) { closeNote(note.id); onClose(); }
  };

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const total = itemsTotal + adjustmentsTotal;
  const tempRemovalsTotal = tempRemovals.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 w-full max-w-6xl border-2 border-accent my-4 max-h-[95vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-accent truncate">{note.title}</h2>
            <p className="text-gray-600 text-xs sm:text-sm">{note.status === 'ouvert' ? '🟢 Ouvert' : '🔴 Clôturé'}</p>
          </div>
          <button onClick={onClose} className="text-accent hover:text-accent-light text-2xl sm:text-3xl">✕</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <h3 className="text-accent font-bold text-xl border-b-2 border-accent pb-2">MENU</h3>
            {['boisson', 'entree', 'plat', 'dessert'].map(cat => {
              const items = menuItems.filter(m => m.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="bg-white shadow-md rounded-lg p-3 sm:p-4">
                  <h4 className="text-accent font-semibold mb-3 text-sm sm:text-base">{cat.toUpperCase()}</h4>
                  {items.map(menuItem => (
                    <div key={menuItem.id} className="flex items-center justify-between bg-gray-50 rounded p-2 mb-2 border border-accent">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">{menuItem.name}</p>
                        <p className="text-accent text-xs">{menuItem.price.toFixed(2)}€</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeItem(menuItem.id)} disabled={note.status === 'cloture'} className="bg-red-500 text-white w-8 h-8 rounded font-bold disabled:bg-gray-300">−</button>
                        <span className="text-accent font-bold w-6 text-center">{note.items.find(i => i.menuItemId === menuItem.id)?.quantity || 0}</span>
                        <button onClick={() => addItem(menuItem.id)} disabled={note.status === 'cloture'} className="bg-accent-light text-white w-8 h-8 rounded font-bold disabled:bg-gray-300">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h3 className="text-accent font-bold text-xl border-b-2 border-accent pb-2">RÉSUMÉ</h3>
            <div className="bg-accent rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xl">TOTAL</span>
                <span className="text-white font-bold text-2xl">{total.toFixed(2)}€</span>
              </div>
            </div>
            {note.status === 'ouvert' ? (
              <button onClick={handleCloseNote} className="w-full bg-red-500 text-white py-3 rounded font-semibold">CLÔTURER LA NOTE</button>
            ) : (
              <button onClick={() => reopenNote(note.id)} className="w-full bg-accent-light text-white py-3 rounded font-semibold">ROUVRIR LA NOTE</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}