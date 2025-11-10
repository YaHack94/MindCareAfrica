
import React from 'react';
import { Bot, UserCheck, Users, Crown, ArrowRight } from 'lucide-react';
import { NavigationItem } from '../../types';

interface DashboardPageProps {
  pseudonym: string;
  setActiveView: (view: NavigationItem) => void;
  isAnonymous?: boolean;
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
  bgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon: Icon, onClick, color, bgColor }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between ${bgColor}`}
  >
    <div>
      <div className={`p-3 rounded-full inline-block ${color}`}>
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">{description}</p>
    </div>
    <div className="flex items-center justify-end mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
      Accéder <ArrowRight size={16} className="ml-1" />
    </div>
  </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ pseudonym, setActiveView, isAnonymous }) => {
  return (
    <div className="animate-fade-in">
       {isAnonymous && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 rounded-r-lg" role="alert">
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Mode Anonyme Actif</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Vos données sont enregistrées uniquement sur cet appareil. Pour les sauvegarder sur plusieurs appareils,{' '}
                <a 
                    href="#" 
                    onClick={(e) => { 
                        e.preventDefault(); 
                        alert('La fonctionnalité de mise à niveau du compte est en cours de développement. Veuillez vous déconnecter et créer un nouveau compte complet.'); 
                    }} 
                    className="font-semibold underline hover:text-yellow-800 dark:hover:text-yellow-200"
                >
                    créez un compte complet
                </a>.
              </p>
            </div>
          )}
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
        Bonjour, <span className="text-emerald-600 dark:text-emerald-400">{pseudonym}</span>.
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Nous sommes là pour vous accompagner. Que souhaitez-vous faire aujourd'hui ?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <DashboardCard
          title="Discuter avec Mindy"
          description="Votre compagnon IA est disponible 24/7 pour une conversation de soutien."
          icon={Bot}
          onClick={() => setActiveView('chat')}
          bgColor="bg-sky-100 dark:bg-sky-900/50"
          color="bg-sky-500"
        />
        <DashboardCard
          title="Parler à un expert"
          description="Prenez rendez-vous avec un psychologue certifié pour une aide professionnelle."
          icon={UserCheck}
          onClick={() => setActiveView('professionals')}
          bgColor="bg-emerald-100 dark:bg-emerald-900/50"
          color="bg-emerald-500"
        />
        <DashboardCard
          title="Rejoindre un groupe"
          description="Échangez avec d'autres membres dans nos forums de discussion anonymes."
          icon={Users}
          onClick={() => setActiveView('community')}
          bgColor="bg-amber-100 dark:bg-amber-900/50"
          color="bg-amber-500"
        />
        <DashboardCard
          title="Gérer l'abonnement"
          description="Accédez à des fonctionnalités premium et soutenez notre mission."
          icon={Crown}
          onClick={() => alert('La page d\'abonnement est en cours de construction.')}
          bgColor="bg-purple-100 dark:bg-purple-900/50"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
