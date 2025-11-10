
import React, { useState } from 'react';
import { User } from '../../types';
import { Fingerprint, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onSignup: (data: Omit<User, 'id' | 'pseudonym' | 'isAnonymous'>) => void;
  onLogin: (identifier: string, pin: string) => void;
  onAnonymousSignup: (pseudonym: string, pin: string) => void;
  onBackToHome: () => void;
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


const AuthPage: React.FC<AuthPageProps> = ({ onSignup, onLogin, onAnonymousSignup, onBackToHome }) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'forgotPinIdentifier' | 'forgotPinConfirm' | 'anonymous'>('signup');

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
  
  // Reset fields
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPin, setNewPin] = useState('');

  // Anonymous fields
  const [anonymousPseudonym, setAnonymousPseudonym] = useState('');
  const [anonymousPin, setAnonymousPin] = useState('');

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

  const handleAnonymousSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (anonymousPseudonym.trim().length < 3) {
        alert('Le pseudonyme doit contenir au moins 3 caractères.');
        return;
    }
    if (anonymousPin.length < 4) {
        alert('Le code PIN doit contenir au moins 4 chiffres.');
        return;
    }
    onAnonymousSignup(anonymousPseudonym.trim(), anonymousPin);
  };
  
  const handleRequestResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser: User | null = JSON.parse(localStorage.getItem('mindcare-user') || 'null');

    if (storedUser && (storedUser.email === resetIdentifier || storedUser.phone === resetIdentifier)) {
        alert("Un code de réinitialisation a été envoyé (pour la démo, utilisez '123456').");
        setMode('forgotPinConfirm');
    } else {
        alert("Aucun compte trouvé avec cet identifiant.");
    }
  };
  
  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode !== '123456') {
        alert("Code de réinitialisation incorrect.");
        return;
    }
    if (newPin.length < 4) {
        alert("Le nouveau code PIN doit contenir au moins 4 chiffres.");
        return;
    }

    const storedUser: User | null = JSON.parse(localStorage.getItem('mindcare-user') || 'null');

    if (storedUser && (storedUser.email === resetIdentifier || storedUser.phone === resetIdentifier)) {
        const updatedUser = { ...storedUser, pin: newPin };
        localStorage.setItem('mindcare-user', JSON.stringify(updatedUser));
        alert("Votre code PIN a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.");
        setLoginIdentifier(resetIdentifier); // Pre-fill login form
        setLoginPin('');
        setResetIdentifier('');
        setResetCode('');
        setNewPin('');
        setMode('login');
    } else {
        alert("Une erreur s'est produite. Veuillez recommencer.");
        setMode('forgotPinIdentifier');
    }
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
             <div className="text-right mt-2">
                <button
                    type="button"
                    onClick={() => setMode('forgotPinIdentifier')}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Code PIN oublié ?
                </button>
            </div>
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

  const renderAnonymousForm = () => (
    <form className="space-y-4" onSubmit={handleAnonymousSubmit}>
        <div>
            <label htmlFor="anonymousPseudonym" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Choisissez un pseudonyme
            </label>
            <input 
                id="anonymousPseudonym" 
                type="text" 
                required 
                value={anonymousPseudonym} 
                onChange={e => setAnonymousPseudonym(e.target.value)} 
                className={commonInputClass}
                placeholder="Ex: CœurVaillant" 
            />
             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Ce nom garantit votre anonymat dans l'application.
            </p>
        </div>
        <div>
            <label htmlFor="anonymousPin" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Créez un code PIN (4 chiffres min.)
            </label>
            <input 
                id="anonymousPin" 
                type="password" 
                required 
                value={anonymousPin} 
                onChange={e => setAnonymousPin(e.target.value)} 
                className={commonInputClass}
                placeholder="••••"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Pour vous reconnecter à votre session anonyme plus tard.
            </p>
        </div>
        <div>
            <button type="submit" className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
            Entrer dans l'espace
            </button>
        </div>
    </form>
  );
  
    const renderForgotPinIdentifierForm = () => (
    <form className="space-y-4" onSubmit={handleRequestResetCode}>
        <div>
            <label htmlFor="resetIdentifier" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email ou téléphone</label>
            <input id="resetIdentifier" type="text" required value={resetIdentifier} onChange={e => setResetIdentifier(e.target.value)} className={commonInputClass} placeholder="Votre identifiant de compte" />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Nous enverrons un code de réinitialisation à cet identifiant.
            </p>
        </div>
        <div className="pt-2">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Envoyer le code
            </button>
        </div>
    </form>
  );
  
   const renderForgotPinConfirmForm = () => (
    <form className="space-y-4" onSubmit={handleResetPin}>
        <div>
            <label htmlFor="resetCode" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Code de réinitialisation</label>
            <input id="resetCode" type="text" maxLength={6} required value={resetCode} onChange={e => setResetCode(e.target.value)} className={commonInputClass} placeholder="Code à 6 chiffres" />
             <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
              Pour la démo, utilisez le code : <strong>123456</strong>
            </p>
        </div>
        <div>
            <label htmlFor="newPin" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Nouveau code PIN (4 chiffres min.)</label>
            <input id="newPin" type="password" required value={newPin} onChange={e => setNewPin(e.target.value)} className={commonInputClass} placeholder="••••" />
        </div>
        <div className="pt-2">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Réinitialiser le code PIN
            </button>
        </div>
    </form>
  );

  const getHeaderContent = () => {
    switch(mode) {
        case 'signup':
            return { title: 'Créez votre compte pour commencer.', subtitle: null, showTabs: true };
        case 'login':
            return { title: 'Content de vous revoir !', subtitle: null, showTabs: true };
        case 'anonymous':
            return { title: 'Accès Anonyme', subtitle: 'Vos données resteront sur cet appareil.', showTabs: false };
        case 'forgotPinIdentifier':
            return { title: 'Réinitialiser votre code PIN', subtitle: 'Entrez votre identifiant pour recevoir un code.', showTabs: false };
        case 'forgotPinConfirm':
            return { title: 'Vérifiez votre identité', subtitle: 'Entrez le code et votre nouveau code PIN.', showTabs: false };
        default:
            return { title: '', subtitle: null, showTabs: true };
    }
  };

  const { title, subtitle, showTabs } = getHeaderContent();

  const renderContent = () => {
    switch(mode) {
        case 'signup': return renderSignupForm();
        case 'login': return renderLoginForm();
        case 'anonymous': return renderAnonymousForm();
        case 'forgotPinIdentifier': return renderForgotPinIdentifierForm();
        case 'forgotPinConfirm': return renderForgotPinConfirmForm();
        default: return renderLoginForm();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-slate-800 relative">
        <button onClick={onBackToHome} className="absolute top-4 left-4 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400" aria-label="Retour à l'accueil">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center pt-6">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {title}
          </p>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>

        {showTabs && (
            <div className="flex justify-center bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
            <button onClick={() => setMode('signup')} className={`w-full py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}>
                S'inscrire
            </button>
            <button onClick={() => setMode('login')} className={`w-full py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}>
                Se connecter
            </button>
            </div>
        )}
        
        <div className="animate-fade-in">
          {renderContent()}
        </div>

        {(mode === 'signup' || mode === 'login') && (
          <>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Ou</span>
                </div>
            </div>
            <div>
                <button 
                    type="button" 
                    onClick={() => setMode('anonymous')}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    <ShieldCheck className="mr-2" size={20} />
                    Continuer en mode anonyme
                </button>
            </div>
          </>
        )}

        {(mode === 'forgotPinIdentifier' || mode === 'forgotPinConfirm') && (
            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Retour à la connexion
                </button>
            </div>
        )}

         {mode === 'anonymous' && (
            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Retourner pour créer un compte complet
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default AuthPage;
