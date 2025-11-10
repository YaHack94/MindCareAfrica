
import React from 'react';
import { PublicView } from '../../types';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
    setPublicView: (view: PublicView) => void;
}

const Footer: React.FC<FooterProps> = ({ setPublicView }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, view: PublicView) => {
        e.preventDefault();
        setPublicView(view);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
                        </h2>
                        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
                            Votre espace sécurisé pour le bien-être mental. Anonyme, accessible et toujours à votre écoute.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wider uppercase">Navigation</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'about')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">À Propos</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'blog')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Blog</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'subscription')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Abonnements</a></li>
                        </ul>
                    </div>
                    
                    {/* Support Links */}
                     <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wider uppercase">Soutien</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'contact')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Contactez-nous</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'partner')} className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Devenir Partenaire</a></li>
                             <li><a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">FAQ</a></li>
                        </ul>
                    </div>

                     {/* Legal Links */}
                     <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wider uppercase">Légal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Confidentialité</a></li>
                            <li><a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400">Conditions d'utilisation</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 order-2 sm:order-1 mt-4 sm:mt-0">
                        &copy; {new Date().getFullYear()} MindCare Africa. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6 order-1 sm:order-2">
                        <a href="#" className="text-slate-400 hover:text-emerald-500"><span className="sr-only">Twitter</span><Twitter size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-emerald-500"><span className="sr-only">Facebook</span><Facebook size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-emerald-500"><span className="sr-only">Instagram</span><Instagram size={20} /></a>
                         <a href="#" className="text-slate-400 hover:text-emerald-500"><span className="sr-only">LinkedIn</span><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
