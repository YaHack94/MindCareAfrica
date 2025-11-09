
import React from 'react';
import { ShieldCheck, MessageCircle, Users, Stethoscope } from 'lucide-react';

interface LandingPageProps {
    onNavigateToAuth: () => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
        <div className="inline-block p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        {/* Header */}
        <header className="py-4 px-6 md:px-12">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                MindCare<span className="text-slate-500 dark:text-slate-400">Africa</span>
            </h1>
        </header>

        {/* Hero Section */}
        <main className="text-center py-20 px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Un soutien pour votre bien-être mental, <br />
                <span className="text-emerald-500">à portée de main.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-8">
                MindCare Africa est votre espace sécurisé pour parler, réfléchir et trouver des ressources. Anonyme, accessible et toujours à votre écoute.
            </p>
            <button
                onClick={onNavigateToAuth}
                className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-transform transform hover:scale-105 shadow-lg"
            >
                Rejoindre la communauté
            </button>
        </main>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-800">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold text-center mb-12">Ce que nous offrons</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard icon={ShieldCheck} title="Anonymat Garanti">
                        Exprimez-vous librement. Votre identité reste protégée, toujours.
                    </FeatureCard>
                    <FeatureCard icon={MessageCircle} title="Chat IA Empathique">
                        Discutez 24/7 avec Mindy, une IA conçue pour écouter sans juger.
                    </FeatureCard>
                    <FeatureCard icon={Users} title="Communauté Solidaire">
                        Échangez avec d'autres personnes qui comprennent ce que vous vivez.
                    </FeatureCard>
                     <FeatureCard icon={Stethoscope} title="Accès à des Experts">
                        Consultez des psychologues certifiés quand vous en avez besoin.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} MindCare Africa. Tous droits réservés.</p>
        </footer>
    </div>
  );
};

export default LandingPage;
