
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import AuthPage from './components/auth/AuthPage';
import VerificationScreen from './components/auth/VerificationScreen';
import CreateProfileScreen from './components/auth/CreateProfileScreen';
import Layout from './components/layout/Layout';
import ChatWindow from './components/chat/ChatWindow';
import ResourcesPage from './components/resources/ResourcesPage';
import JournalPage from './components/journal/JournalPage';
import CommunityPage from './components/community/CommunityPage';
import ProfessionalsPage from './components/professionals/ProfessionalsPage';
import { NavigationItem, User } from './types';
import DashboardPage from './components/dashboard/DashboardPage';
import LandingPage from './components/landing/LandingPage';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('mindcare-user', null);
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  // State for the new authentication flow
  const [authStep, setAuthStep] = useState<'auth' | 'verify' | 'profile'>('auth');
  const [authIdentifier, setAuthIdentifier] = useState(''); // Stores email or phone for verification
  const [tempSignupData, setTempSignupData] = useState<Omit<User, 'id' | 'pseudonym'> | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(swReg => {
          console.log('Service Worker registered:', swReg);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleNavigateToAuth = () => {
    setShowLanding(false);
  };

  const handleSignup = (data: Omit<User, 'id' | 'pseudonym'>) => {
    setTempSignupData(data);
    setAuthStep('profile');
  };

  const handleLogin = (identifier: string, pin: string) => {
    const storedUser: User | null = JSON.parse(localStorage.getItem('mindcare-user') || 'null');
    
    if (storedUser && (storedUser.email === identifier || storedUser.phone === identifier || storedUser.pseudonym === identifier) && storedUser.pin === pin) {
        setAuthIdentifier(identifier);
        setAuthStep('verify');
    } else {
        alert("Identifiant ou code PIN incorrect.");
    }
  };
  
  const handleVerificationSuccess = () => {
    const storedUser: User | null = JSON.parse(localStorage.getItem('mindcare-user') || 'null');
     if (storedUser && (storedUser.email === authIdentifier || storedUser.phone === authIdentifier || storedUser.pseudonym === authIdentifier)) {
       setUser(storedUser);
       setAuthStep('auth');
       setAuthIdentifier('');
    } else {
        alert("Erreur lors de la vérification. Veuillez vous reconnecter.");
        setAuthStep('auth');
    }
  };

  const handleProfileCreation = (pseudonym: string) => {
    if (!tempSignupData) return;
    
    const newUser: User = {
        ...tempSignupData,
        id: tempSignupData.email,
        pseudonym: pseudonym,
    };
    
    setUser(newUser);
    setAuthStep('auth');
    setTempSignupData(null);
    setShowLanding(true);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthStep('auth');
    setShowLanding(true);
    // Keep user data for next login, but clear sensitive session data if any
    // localStorage.removeItem('mindcare-chat-history');
    // localStorage.removeItem('mindcare-journal-entries');
  };

  if (!user) {
    if (showLanding) {
      return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
    }
    switch (authStep) {
      case 'auth':
        return <AuthPage onSignup={handleSignup} onLogin={handleLogin} />;
      case 'verify':
        return <VerificationScreen identifier={authIdentifier} onVerify={handleVerificationSuccess} />;
      case 'profile':
        return <CreateProfileScreen onCreateProfile={handleProfileCreation} />;
      default:
         return <AuthPage onSignup={handleSignup} onLogin={handleLogin} />;
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage pseudonym={user.pseudonym} setActiveView={setActiveView} />;
      case 'chat':
        return <ChatWindow />;
      case 'journal':
        return <JournalPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'community':
        return <CommunityPage />;
      case 'professionals':
        return <ProfessionalsPage />;
      default:
        return <DashboardPage pseudonym={user.pseudonym} setActiveView={setActiveView} />;
    }
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      pseudonym={user.pseudonym}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
