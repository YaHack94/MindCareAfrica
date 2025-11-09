
import React, { useState } from 'react';
import { User } from '../../types';
import { Fingerprint } from 'lucide-react';

interface AuthPageProps {
  onSignup: (data: Omit<User, 'id' | 'pseudonym'>) => void;
  onLogin: (identifier: string, pin: string) => void;
}

const countries = [
    'Bénin', 'Burkina Faso', 'Cameroun', 'Côte d\'Ivoire', 'Mali', 'Niger', 'Sénégal', 'Togo', 'Autre'
];

const countryCodes: { [key: string]: string } = {
    'Bénin': '+229',
    'Burkina Faso': '+226',
    'Cameroun': '+237',
    'Côte d\'Ivoire': '+225',
    'Mali': '+223',
    'Niger': '+227',
    'Sénégal': '+221',
    'Togo': '+228',
};


const AuthPage: React.FC<AuthPageProps> = ({ onSignup, onLogin }) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState(countries[0]);
  const [pin, setPin] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
        alert('Le code PIN doit contenir au moins 4 chiffres.');
        return;
    }
    const fullPhoneNumber = `${countryCodes[country] || ''}${phone}`;
    onSignup({ firstName, lastName, email, phone: fullPhoneNumber, dob, country, pin });
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginIdentifier, loginPin);
  };
  
  const commonInputClass = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white";
  
  const renderSignupForm = () => (
    <form className="space-y-4" onSubmit={handleSignupSubmit}>
        <div className="flex space-x-4">
            <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Prénom</label>
                <input id="firstName" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={commonInputClass} />
            </div>
            <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nom</label>
                <input id="lastName" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={commonInputClass} />
            </div>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} />
        </div>
         <div>
             <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Pays</label>
             <select id="country" required value={country} onChange={e => setCountry(e.target.value)} className={commonInputClass}>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
        </div>
        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Téléphone</label>
            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400">
                    {countryCodes[country] || '+...'}
                </span>
                <input id="phone" type="tel" placeholder="61 23 45 67" required value={phone} onChange={e => setPhone(e.target.value)} className={`${commonInputClass} rounded-l-none`} />
            </div>
        </div>
        <div>
            <label htmlFor="dob" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Date de naissance</label>
            <input id="dob" type="date" required value={dob} onChange={e => setDob(e.target.value)} className={commonInputClass} />
        </div>
        <div>
            <label htmlFor="pin" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Code PIN (4 chiffres min.)</label>
            <input id="pin" type="password" required value={pin} onChange={e => setPin(e.target.value)} className={commonInputClass} />
        </div>
        <div>
            <button type="submit" className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
              Créer mon compte
            </button>
        </div>
    </form>
  );

  const renderLoginForm = () => (
     <form className="space-y-4" onSubmit={handleLoginSubmit}>
        <div>
            <label htmlFor="loginIdentifier" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email, téléphone ou pseudo</label>
            <input id="loginIdentifier" type="text" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} className={commonInputClass} placeholder="Votre identifiant" />
        </div>
        <div>
            <label htmlFor="loginPin" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Code PIN</label>
            <input id="loginPin" type="password" required value={loginPin} onChange={e => setLoginPin(e.target.value)} className={commonInputClass} placeholder="••••" />
        </div>
        <div className="pt-2">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
              Se connecter
            </button>
            <button type="button" onClick={() => alert('Fonctionnalité de connexion biométrique en cours de développement.')} className="w-full mt-3 flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                <Fingerprint className="mr-2" size={20} />
                Utiliser la biométrie
            </button>
        </div>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {mode === 'signup' ? 'Créez votre compte pour commencer.' : 'Content de vous revoir !'}
          </p>
        </div>

        <div className="flex justify-center bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
          <button onClick={() => setMode('signup')} className={`w-full py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}>
            S'inscrire
          </button>
          <button onClick={() => setMode('login')} className={`w-full py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}>
            Se connecter
          </button>
        </div>
        
        {mode === 'signup' ? renderSignupForm() : renderLoginForm()}

      </div>
    </div>
  );
};

export default AuthPage;
