
import React, { useState } from 'react';

interface LoginScreenProps {
  onSubmitIdentifier: (identifier: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSubmitIdentifier }) => {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      onSubmitIdentifier(identifier.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Votre espace sécurisé pour le bien-être mental.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email ou numéro de téléphone
            </label>
            <div className="mt-1">
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="exemple@mail.com ou +123456789"
              />
            </div>
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Ceci est utilisé pour sécuriser votre compte. Il ne sera pas partagé.
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105"
            >
              Continuer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;