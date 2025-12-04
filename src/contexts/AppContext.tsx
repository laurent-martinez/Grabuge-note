'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, MenuItem, NoteItem, Adjustment } from '@/types';

interface AppContextType {
  notes: Note[];
  menuItems: MenuItem[];
  addNote: (title: string) => void;
  updateNote: (noteId: string, items: NoteItem[], adjustments: Adjustment[]) => void;
  closeNote: (noteId: string) => void;
  reopenNote: (noteId: string) => void;
deleteClosedNotes: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis l'API au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Charger le menu
        const menuResponse = await fetch('/api/menu');
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          setMenuItems(menuData);
        }
        
        // Charger les notes
        const notesResponse = await fetch('/api/notes');
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          const notesWithDates = notesData.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            adjustments: note.adjustments.map((adj: any) => ({
              ...adj,
              timestamp: new Date(adj.timestamp),
            })),
          }));
          setNotes(notesWithDates);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder les notes dans l'API à chaque changement
  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await fetch('/api/notes/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotes),
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // Sauvegarder le menu dans l'API à chaque changement
  const saveMenu = async (updatedMenu: MenuItem[]) => {
    try {
      await fetch('/api/menu/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMenu),
      });
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  // Synchroniser les prix des notes avec les prix actuels du menu
  useEffect(() => {
    if (notes.length > 0 && menuItems.length > 0) {
      const updatedNotes = notes.map(note => {
        const updatedItems = note.items.map(item => {
          const currentMenuItem = menuItems.find(m => m.id === item.menuItemId);
          if (currentMenuItem) {
            return { ...item, price: currentMenuItem.price };
          }
          return item;
        });
        
        // Recalculer le total
        const itemsTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const adjustmentsTotal = note.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
        const total = itemsTotal + adjustmentsTotal;
        
        return { ...note, items: updatedItems, total };
      });
      
      // Ne mettre à jour que si des changements ont été détectés
      const hasChanges = updatedNotes.some((note, index) => 
        note.total !== notes[index].total || 
        note.items.some((item, itemIndex) => item.price !== notes[index].items[itemIndex]?.price)
      );
      
      if (hasChanges) {
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
      }
    }
  }, [menuItems]);

  const addNote = (title: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      items: [],
      adjustments: [],
      total: 0,
      status: 'ouvert',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateNote = (noteId: string, items: NoteItem[], adjustments: Adjustment[]) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
        const total = itemsTotal + adjustmentsTotal;
        
        return {
          ...note,
          items,
          adjustments,
          total,
          updatedAt: new Date(),
        };
      }
      return note;
    });
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const closeNote = (noteId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, status: 'cloture' as const, updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const reopenNote = (noteId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, status: 'ouvert' as const, updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

const deleteClosedNotes = async () => {
  const updatedNotes = notes.filter(note => note.status === 'ouvert');
  setNotes(updatedNotes);
  await saveNotes(updatedNotes);
};

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    const updatedMenu = [...menuItems, newItem];
    setMenuItems(updatedMenu);
    saveMenu(updatedMenu);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updatedMenu = menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setMenuItems(updatedMenu);
    saveMenu(updatedMenu);
  };

  const deleteMenuItem = (id: string) => {
    const updatedMenu = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedMenu);
    saveMenu(updatedMenu);
  };

  return (
    <AppContext.Provider value={{
      notes,
      menuItems,
      addNote,
      updateNote,
      closeNote,
      reopenNote,
      deleteClosedNotes,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
