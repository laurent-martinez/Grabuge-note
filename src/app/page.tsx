'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import NoteEditor from '@/components/NoteEditor';
import MenuManager from '@/components/MenuManager';
import LoginModal from '@/components/LoginModal';
import { Note } from '@/types';

export default function Home() {
  const { notes, addNote, isLoading, deleteClosedNotes } = useApp();
  const { isAuthenticated, logout } = useAuth();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showMenuManager, setShowMenuManager] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ouvert' | 'cloture'>('all');

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    addNote(newNoteTitle);
    setNewNoteTitle('');
    setShowNewNoteForm(false);
  };

  const handleDeleteClosedNotes = () => {
    const closedCount = notes.filter(n => n.status === 'cloture').length;
    if (closedCount === 0) {
      alert('Aucune note clôturée à supprimer.');
      return;
    }
    
    if (confirm(`Voulez-vous vraiment supprimer les ${closedCount} note(s) clôturée(s) ? Cette action est irréversible.`)) {
      deleteClosedNotes();
    }
  };

  const filteredNotes = notes.filter(note => {
    if (filter === 'all') return true;
    return note.status === filter;
  });

  return (
    <div className="min-h-screen bg-primary p-4 sm:p-6 lg:p-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-accent text-xl font-bold">CHARGEMENT...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">
            RESTAURANT NOTES
          </h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowMenuManager(true)}
                  className="flex-1 sm:flex-none bg-accent hover:bg-accent-light text-primary px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
                >
                  ⚙️ GÉRER LE MENU
                </button>
                <button
                  onClick={logout}
                  className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
                >
                  DÉCONNEXION
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex-1 sm:flex-none bg-accent hover:bg-accent-light text-primary px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
              >
                🔒 CONNEXION
              </button>
            )}
          </div>
        </div>

        {/* New Note Form */}
        {showNewNoteForm ? (
          <div className="bg-primary-dark rounded-lg p-4 sm:p-6 mb-6 border-2 border-accent">
            <h2 className="text-accent font-bold text-xl mb-4">NOUVELLE NOTE</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Titre de la note (ex: Table 5)"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                className="flex-1 bg-primary text-white border-2 border-accent rounded px-4 py-3 focus:outline-none focus:border-accent-light text-sm sm:text-base"
                autoFocus
              />
              <button
                onClick={handleAddNote}
                className="bg-accent hover:bg-accent-light text-primary px-6 py-3 rounded font-semibold transition text-sm sm:text-base"
              >
                CRÉER
              </button>
              <button
                onClick={() => {
                  setShowNewNoteForm(false);
                  setNewNoteTitle('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold transition text-sm sm:text-base"
              >
                ANNULER
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewNoteForm(true)}
            className="w-full bg-accent hover:bg-accent-light text-primary py-4 rounded-lg font-bold text-lg sm:text-xl mb-6 transition"
          >
            + NOUVELLE NOTE
          </button>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                filter === 'all'
                  ? 'bg-accent text-primary'
                  : 'bg-primary-dark text-white border-2 border-accent'
              }`}
            >
              TOUTES ({notes.length})
            </button>
            <button
              onClick={() => setFilter('ouvert')}
              className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                filter === 'ouvert'
                  ? 'bg-accent text-primary'
                  : 'bg-primary-dark text-white border-2 border-accent'
              }`}
            >
              🟢 OUVERTES ({notes.filter(n => n.status === 'ouvert').length})
            </button>
            <button
              onClick={() => setFilter('cloture')}
              className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                filter === 'cloture'
                  ? 'bg-accent text-primary'
                  : 'bg-primary-dark text-white border-2 border-accent'
              }`}
            >
              🔴 CLÔTURÉES ({notes.filter(n => n.status === 'cloture').length})
            </button>
          </div>
          
          {notes.filter(n => n.status === 'cloture').length > 0 && (
            <button
              onClick={handleDeleteClosedNotes}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition whitespace-nowrap text-sm sm:text-base"
            >
              🗑️ SUPPRIMER LES NOTES CLÔTURÉES
            </button>
          )}
        </div>

        {/* Notes List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg sm:text-xl">
              {filter === 'all' 
                ? 'Aucune note. Créez-en une pour commencer !'
                : filter === 'ouvert'
                ? 'Aucune note ouverte'
                : 'Aucune note clôturée'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="bg-primary-dark rounded-lg p-4 sm:p-6 border-2 border-accent hover:border-accent-light cursor-pointer transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-accent font-bold text-lg sm:text-xl group-hover:text-accent-light transition truncate flex-1">
                    {note.title}
                  </h3>
                  <span className="ml-2 text-lg">
                    {note.status === 'ouvert' ? '🟢' : '🔴'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between text-white">
                    <span>Articles:</span>
                    <span className="font-semibold">
                      {note.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-accent font-bold text-lg sm:text-xl">
                    <span>Total:</span>
                    <span>{note.total.toFixed(2)}€</span>
                  </div>
                  
                  <div className="text-gray-400 text-xs sm:text-sm pt-2 border-t border-gray-700">
                    {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Modals */}
      {selectedNote && (
        <NoteEditor
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {showMenuManager && (
        <MenuManager onClose={() => setShowMenuManager(false)} />
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}
