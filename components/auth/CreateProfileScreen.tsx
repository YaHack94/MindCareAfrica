
import React, { useState } from 'react';

interface CreateProfileScreenProps {
  onCreateProfile: (pseudonym: string) => void;
}

const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({ onCreateProfile }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProfile(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Finalisez votre profil</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Votre compte est vérifié. Choisissez maintenant votre pseudonyme.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="pseudonym" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Choisissez un pseudonyme
            </label>
            <div className="mt-1">
              <input
                id="pseudonym"
                name="pseudonym"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Ex: CœurVaillant"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Ce nom garantit votre anonymat dans l'application.
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105"
            >
              Entrer dans l'espace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfileScreen;