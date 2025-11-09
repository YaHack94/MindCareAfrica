
import React, { useState } from 'react';

interface VerificationScreenProps {
  identifier: string;
  onVerify: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ identifier, onVerify }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to a backend.
    // Here, we simulate success with a hardcoded code.
    if (code === '123456') {
      onVerify();
    } else {
      alert('Code de vérification incorrect. Veuillez essayer 123456.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
        <div className="text-center">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Confirmez votre connexion</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Pour votre sécurité, un code à 6 chiffres a été envoyé à vos contacts enregistrés (email/téléphone).
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Code de vérification
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-center tracking-[1em] border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="_ _ _ _ _ _"
              />
            </div>
             <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
              Pour la démo, utilisez le code: <strong>123456</strong>
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105"
            >
              Vérifier et Se Connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationScreen;
