
import React, { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Bell, BellOff } from 'lucide-react';

// This is a placeholder public VAPID key.
// In a real application, this key would be generated on your server and
// supplied to the frontend.
const VAPID_PUBLIC_KEY = 'BIPAl-xI9y-e2-I7dOC-MpaYv-3W5ldQEiARG1bOQ5nflUnu-sODp7mwp0Xh_6MDM-dnDQi2sVzLAD2cmeQY6sE';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface TopNavProps {
  pseudonym: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ pseudonym, onLogout, theme, toggleTheme }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>(Notification.permission);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
       setIsLoading(false);
       return;
    }
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        if (sub) {
          setIsSubscribed(true);
        }
        setPermission(Notification.permission);
        setIsLoading(false);
      });
    });
  }, []);

  const handleSubscription = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const reg = await navigator.serviceWorker.ready;

    if (isSubscribed) {
      // Unsubscribe
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        // In a real app, you would also send a request to your server to remove the subscription.
        setIsSubscribed(false);
        console.log('User unsubscribed.');
      }
    } else {
      // Subscribe
      if (Notification.permission === 'default') {
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
        if (newPermission !== 'granted') {
           setIsLoading(false);
           return;
        }
      }

      if (Notification.permission === 'granted') {
          try {
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log('User is subscribed:', sub);
            // In a real app, you would send this subscription object to your server to store.
            setIsSubscribed(true);
          } catch (error) {
             console.error('Failed to subscribe the user: ', error);
          }
      }
    }
    setIsLoading(false);
  };
  
  const getNotificationButton = () => {
      if (!('PushManager' in window)) {
        return null;
      }
      
      let icon = <Bell size={20} />;
      let label = 'Subscribe to notifications';
      let color = 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
      
      if (permission === 'denied') {
          icon = <BellOff size={20} />;
          label = 'Notification permissions are blocked';
          color = 'text-rose-500 dark:text-rose-400';
      } else if (isSubscribed) {
          icon = <Bell size={20} className="fill-current"/>;
          label = 'Unsubscribe from notifications';
          color = 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800';
      }
      
      return (
         <button
            onClick={handleSubscription}
            disabled={permission === 'denied' || isLoading}
            className={`p-2 rounded-full ${color} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={label}
            title={label}
          >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : icon}
          </button>
      )
  }

  return (
    <header className="fixed top-0 left-0 sm:left-64 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm z-10">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="sm:hidden">
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
          </h1>
        </div>
        <div className="hidden sm:block" />
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-300">
            Connecté en tant que: <strong className="font-medium">{pseudonym}</strong>
          </span>
          {getNotificationButton()}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-rose-800 text-rose-500 dark:text-rose-400 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
