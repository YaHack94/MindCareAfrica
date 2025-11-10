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
import { NavigationItem, User, ReminderSettings, PublicView } from './types';
import DashboardPage from './components/dashboard/DashboardPage';
import Header from './components/public/Header';
import Footer from './components/public/Footer';
import HomePage from './components/public/HomePage';
import AboutPage from './components/public/AboutPage';
import SubscriptionPage from './components/public/SubscriptionPage';
import ContactPage from './components/public/ContactPage';
import PartnerPage from './components/public/PartnerPage';
import BlogPage from './components/public/BlogPage';
import LiveChatPage from './components/livechat/LiveChatPage';
import NearbyPage from './components/nearby/NearbyPage';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('mindcare-user', null);
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const [publicView, setPublicView] = useState<PublicView>('home');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [reminderSettings] = useLocalStorage<ReminderSettings>('mindcare-meditation-reminders', {
      enabled: false,
      time: '08:00',
      days: { lundi: true, mardi: true, mercredi: true, jeudi: true, vendredi: true, samedi: false, dimanche: false },
  });
  const [lastReminderTimestamp, setLastReminderTimestamp] = useLocalStorage<number>('mindcare-last-reminder-timestamp', 0);

  const [authStep, setAuthStep] = useState<'landing' | 'auth' | 'verify' | 'profile'>('landing');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [tempSignupData, setTempSignupData] = useState<Omit<User, 'id' | 'pseudonym' | 'isAnonymous'> | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(swReg => console.log('Service Worker registered:', swReg))
        .catch(error => console.error('Service Worker registration failed:', error));
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
        if (!reminderSettings.enabled || !('serviceWorker' in navigator) || Notification.permission !== 'granted') return;

        const now = new Date();
        const dayNames: (keyof ReminderSettings['days'])[] = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const currentDay = dayNames[now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5);
        const oneMinute = 60 * 1000;
        const timeSinceLastReminder = now.getTime() - lastReminderTimestamp;

        if (reminderSettings.days[currentDay] && reminderSettings.time === currentTime && timeSinceLastReminder > oneMinute) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('MindCare: C\'est l\'heure de méditer', {
                    body: 'Prenez quelques instants pour vous recentrer et respirer. ✨',
                    icon: 'vite.svg',
                    badge: 'vite.svg',
                    vibrate: [200, 100, 200],
                } as any);
                setLastReminderTimestamp(now.getTime());
            });
        }
    };
    
    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [reminderSettings, lastReminderTimestamp, setLastReminderTimestamp]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleNavigateToAuth = () => {
    setAuthStep('auth');
  };

  const handleSignup = (data: Omit<User, 'id' | 'pseudonym' | 'isAnonymous'>) => {
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
       setAuthStep('landing');
       setAuthIdentifier('');
    } else {
        alert("Erreur lors de la vérification. Veuillez vous reconnecter.");
        setAuthStep('auth');
    }
  };

  const handleProfileCreation = (pseudonym: string) => {
    if (!tempSignupData) return;
    
    const newUser: User = { ...tempSignupData, id: tempSignupData.email, pseudonym };
    setUser(newUser);
    setAuthStep('landing');
    setTempSignupData(null);
  };

  const handleAnonymousSignup = (pseudonym: string, pin: string) => {
    const newUser: User = {
      id: `anon_${pseudonym}_${Date.now()}`, pseudonym, pin,
      firstName: '', lastName: '', email: '', phone: '', dob: '', country: '', isAnonymous: true,
    };
    setUser(newUser);
    setAuthStep('landing');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthStep('landing');
    setPublicView('home');
  };

  // RENDER LOGIC
  if (user) {
    const renderContent = () => {
      switch (activeView) {
        case 'dashboard': return <DashboardPage pseudonym={user.pseudonym} setActiveView={setActiveView} isAnonymous={user.isAnonymous} />;
        case 'chat': return <ChatWindow />;
        case 'livechat': return <LiveChatPage />;
        case 'journal': return <JournalPage />;
        case 'resources': return <ResourcesPage />;
        case 'community': return <CommunityPage />;
        case 'professionals': return <ProfessionalsPage />;
        case 'nearby': return <NearbyPage />;
        default: return <DashboardPage pseudonym={user.pseudonym} setActiveView={setActiveView} isAnonymous={user.isAnonymous} />;
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
  }

  // Unauthenticated user flow
  switch (authStep) {
    case 'auth':
      return <AuthPage onSignup={handleSignup} onLogin={handleLogin} onAnonymousSignup={handleAnonymousSignup} onBackToHome={() => setAuthStep('landing')} />;
    case 'verify':
      return <VerificationScreen identifier={authIdentifier} onVerify={handleVerificationSuccess} />;
    case 'profile':
      return <CreateProfileScreen onCreateProfile={handleProfileCreation} />;
    case 'landing':
    default:
      const renderPublicPage = () => {
        switch(publicView) {
          case 'home': return <HomePage onNavigateToAuth={handleNavigateToAuth}/>;
          case 'about': return <AboutPage />;
          case 'subscription': return <SubscriptionPage onNavigateToAuth={handleNavigateToAuth} />;
          case 'contact': return <ContactPage />;
          case 'partner': return <PartnerPage />;
          case 'blog': return <BlogPage />;
          default: return <HomePage onNavigateToAuth={handleNavigateToAuth}/>;
        }
      };
      
      return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex flex-col">
          <Header
            setPublicView={setPublicView}
            onNavigateToAuth={handleNavigateToAuth}
            theme={theme}
            toggleTheme={toggleTheme}
            activeView={publicView}
          />
          <main className="flex-grow">
            {renderPublicPage()}
          </main>
          <Footer setPublicView={setPublicView} />
        </div>
      );
  }
};

export default App;