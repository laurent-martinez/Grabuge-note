'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      onClose();
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 w-full max-w-md border-2 border-accent">
        <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-6 text-center">CONNEXION</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-900 mb-2 text-sm sm:text-base font-medium">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 border-2 border-gray-300 rounded px-4 py-2 sm:py-3 focus:outline-none focus:border-accent text-sm sm:text-base"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-gray-900 mb-2 text-sm sm:text-base font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 border-2 border-gray-300 rounded px-4 py-2 sm:py-3 focus:outline-none focus:border-accent text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 hover:opacity-90 text-white py-2 sm:py-3 rounded font-semibold transition text-sm sm:text-base"
            >
              ANNULER
            </button>
            <button
              type="submit"
              className="flex-1 bg-accent hover:opacity-90 text-white py-2 sm:py-3 rounded font-semibold transition text-sm sm:text-base"
            >
              CONNEXION
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs sm:text-sm text-gray-600 text-center">
          Utilisateur : admin / Mot de passe : admin123
        </p>
      </div>
    </div>
  );
}