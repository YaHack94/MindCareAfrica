
import React, { useState } from 'react';
import { PublicView } from '../../types';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
    setPublicView: (view: PublicView) => void;
    onNavigateToAuth: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    activeView: PublicView;
}

const navItems: { id: PublicView; label: string }[] = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À Propos' },
    { id: 'subscription', label: 'Abonnements' },
    { id: 'blog', label: 'Blog' },
    { id: 'partner', label: 'Partenaires' },
    { id: 'contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ setPublicView, onNavigateToAuth, theme, toggleTheme, activeView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (view: PublicView) => {
        setPublicView(view);
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div 
                        className="flex-shrink-0 cursor-pointer" 
                        onClick={() => handleNavClick('home')}
                    >
                        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:space-x-8">
                        {navItems.map(item => (
                             <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                                className={`text-sm font-medium transition-colors ${
                                    activeView === item.id 
                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={onNavigateToAuth}
                            className="hidden md:inline-block bg-emerald-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-emerald-700 transition-transform transform hover:scale-105 text-sm"
                        >
                            Se connecter
                        </button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-800">
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navItems.map(item => (
                             <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    activeView === item.id 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                        <button
                            onClick={() => { onNavigateToAuth(); setIsMenuOpen(false); }}
                            className="w-full text-left mt-2 bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-emerald-700 text-base"
                        >
                            Se connecter / S'inscrire
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
