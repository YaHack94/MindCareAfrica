
import React from 'react';
import { Check } from 'lucide-react';

interface SubscriptionPageProps {
    onNavigateToAuth: () => void;
}

const PricingCard: React.FC<{
    plan: string;
    price: string;
    description: string;
    features: string[];
    isFeatured?: boolean;
    onSelect: () => void;
}> = ({ plan, price, description, features, isFeatured, onSelect }) => {
    return (
        <div className={`border rounded-lg p-8 flex flex-col ${isFeatured ? 'border-emerald-500 ring-2 ring-emerald-500 bg-white dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{plan}</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{description}</p>
            <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{price}</span>
                <span className="text-base font-medium text-slate-500 dark:text-slate-400">/mois</span>
            </div>
            <ul className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="flex-shrink-0 w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={onSelect}
                className={`mt-10 block w-full py-3 px-6 text-center rounded-md font-semibold text-sm ${isFeatured ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600'}`}
            >
                {plan === "Découverte" ? "Commencer gratuitement" : "Choisir Sérénité"}
            </button>
        </div>
    );
};

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onNavigateToAuth }) => {
    return (
        <div className="animate-fade-in py-20 lg:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">Des offres adaptées à vos besoins</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        Commencez gratuitement et explorez nos outils, ou passez à la vitesse supérieure pour un accompagnement plus approfondi.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
                    <PricingCard
                        plan="Découverte"
                        price="0 CFA"
                        description="L'essentiel pour commencer votre parcours de bien-être."
                        features={[
                            "Accès illimité au chat avec l'IA Mindy",
                            "Journal d'humeur personnel",
                            "Accès aux forums de la communauté",
                            "Bibliothèque de ressources de base (articles, podcasts)"
                        ]}
                        onSelect={onNavigateToAuth}
                    />
                    <PricingCard
                        plan="Sérénité"
                        price="3,000 CFA"
                        description="Pour un soutien complet et des fonctionnalités avancées."
                        features={[
                            "Tous les avantages du plan Découverte",
                            "Consultations prioritaires avec des professionnels",
                            "Ateliers de groupe mensuels en ligne",
                            "Contenus exclusifs (méditations guidées, programmes)",
                            "Soutien à la mission de MindCare Africa"
                        ]}
                        isFeatured={true}
                        onSelect={() => alert("Le paiement pour le plan Sérénité sera bientôt disponible. Merci pour votre intérêt !")}
                    />
                </div>
                <p className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
                    Votre soutien nous aide à maintenir la plateforme accessible pour tous.
                </p>
            </div>
        </div>
    );
};

export default SubscriptionPage;
