
import React from 'react';
import { LayoutDashboard, MessageSquare, HeartPulse, BookOpen, Users, Stethoscope, Radio, Map } from 'lucide-react';
import { NavigationItem } from '../../types';

interface BottomNavProps {
  activeView: NavigationItem;
  setActiveView: (view: NavigationItem) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat IA', icon: MessageSquare },
  { id: 'livechat', label: 'Live Chat', icon: Radio },
  { id: 'nearby', label: 'Proximité', icon: Map },
  { id: 'journal', label: 'Journal', icon: HeartPulse },
  { id: 'resources', label: 'Ressources', icon: BookOpen },
  { id: 'community', label: 'Forum', icon: Users },
  { id: 'professionals', label: 'Pros', icon: Stethoscope },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 sm:hidden z-20">
      <div className="flex justify-around">
        {navItems.map((item) => {
           // Hide some items on very small screens if necessary
           const isHidden = ['resources', 'community', 'professionals', 'nearby'].includes(item.id) && window.innerWidth < 380;
           if (isHidden) return null;
           // Or reduce the number of items shown
           if (navItems.length > 6 && ['resources', 'community', 'journal'].includes(item.id) && window.innerWidth < 420 ) return null;


          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as NavigationItem)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs transition-colors duration-200 ${
                activeView === item.id
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-300'
              }`}
            >
              <item.icon size={24} strokeWidth={activeView === item.id ? 2.5 : 2} />
              <span className="mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  );
};

export default BottomNav;