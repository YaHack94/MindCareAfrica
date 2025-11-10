
import React from 'react';
import { LayoutDashboard, MessageSquare, HeartPulse, BookOpen, Users, Stethoscope, Radio, Map } from 'lucide-react';
import { NavigationItem } from '../../types';

interface SidebarProps {
  activeView: NavigationItem;
  setActiveView: (view: NavigationItem) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat IA (Texte)', icon: MessageSquare },
  { id: 'livechat', label: 'Conversation IA', icon: Radio },
  { id: 'nearby', label: 'Proche de moi', icon: Map },
  { id: 'journal', label: 'Journal', icon: HeartPulse },
  { id: 'resources', label: 'Ressources', icon: BookOpen },
  { id: 'community', label: 'Forum', icon: Users },
  { id: 'professionals', label: 'Experts', icon: Stethoscope },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="hidden sm:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed h-full">
      <div className="h-16 flex items-center px-6">
         <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(item.id as NavigationItem);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeView === item.id
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <item.icon className="mr-3" size={20} />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;