'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MenuItem } from '@/types';

export default function MenuManager({ onClose }: { onClose: () => void }) {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'plat' as MenuItem['category'],
  });

  const categories = [
    { value: 'boisson', label: 'Boisson' },
    { value: 'entree', label: 'Entrée' },
    { value: 'plat', label: 'Plat' },
    { value: 'dessert', label: 'Dessert' },
  ];

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (isAdding) {
      addMenuItem({
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
      });
      setIsAdding(false);
    } else if (editingId) {
      updateMenuItem(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
      });
      setEditingId(null);
    }

    setFormData({ name: '', price: '', category: 'plat' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', price: '', category: 'plat' });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', price: '', category: 'plat' });
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-primary rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-4xl border-2 border-accent my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent">GESTION DU MENU</h2>
          <button
            onClick={onClose}
            className="text-accent hover:text-accent-light text-2xl sm:text-3xl"
          >
            ✕
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-accent hover:bg-accent-light text-primary py-3 rounded font-semibold transition mb-6 text-sm sm:text-base"
        >
          + AJOUTER UN ARTICLE
        </button>

        {(isAdding || editingId) && (
          <div className="bg-primary-dark p-4 rounded-lg mb-6 border-2 border-accent">
            <h3 className="text-accent font-bold mb-4 text-lg">
              {isAdding ? 'NOUVEL ARTICLE' : 'MODIFIER L\'ARTICLE'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white mb-2 text-sm">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-primary text-white border-2 border-accent rounded px-3 py-2 focus:outline-none focus:border-accent-light text-sm"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2 text-sm">Prix (€)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-primary text-white border-2 border-accent rounded px-3 py-2 focus:outline-none focus:border-accent-light text-sm"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-white mb-2 text-sm">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
                  className="w-full bg-primary text-white border-2 border-accent rounded px-3 py-2 focus:outline-none focus:border-accent-light text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded font-semibold transition text-sm"
              >
                ANNULER
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-accent hover:bg-accent-light text-primary py-2 rounded font-semibold transition text-sm"
              >
                ENREGISTRER
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {categories.map(({ value, label }) => {
            const items = groupedItems[value] || [];
            if (items.length === 0) return null;

            return (
              <div key={value} className="bg-primary-dark rounded-lg p-4">
                <h3 className="text-accent font-bold mb-3 text-base sm:text-lg uppercase">
                  {label}
                </h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-primary rounded p-3 border border-accent"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate text-sm sm:text-base">
                          {item.name}
                        </p>
                        <p className="text-accent text-sm sm:text-base">{item.price.toFixed(2)}€</p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-white hover:bg-accent-light text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer "${item.name}" ?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="bg-accent-coral hover:bg-accent-orange text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
