
import React from 'react';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { NavigationItem } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: NavigationItem;
  setActiveView: (view: NavigationItem) => void;
  pseudonym: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, pseudonym, onLogout, theme, toggleTheme }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col sm:ml-64">
        <TopNav pseudonym={pseudonym} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow container mx-auto px-4 pt-20 pb-24 sm:pb-8">
          {children}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </div>
  );
};

export default Layout;
