
import React from 'react';
import { Target, Eye, Heart, Shield } from 'lucide-react';

const ValueCard: React.FC<{ icon: React.ElementType, title: string, children: string }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <Icon size={32} className="text-emerald-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{children}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <section className="py-20 lg:py-28 bg-emerald-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold">Notre mission : rendre le soutien mental accessible à tous en Afrique.</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-emerald-100">
                        Nous croyons que chacun mérite un espace sûr pour s'exprimer et trouver de l'aide, peu importe où il se trouve.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="https://picsum.photos/seed/community/600/400" alt="Une communauté unie" className="rounded-lg shadow-xl" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Notre Histoire</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                MindCare Africa est né d'un constat simple : le besoin de soutien en santé mentale est immense, mais l'accès à des ressources de qualité est souvent limité par des barrières géographiques, financières et culturelles.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400">
                                Fondée par des professionnels de la santé, des ingénieurs et des membres de la communauté, notre plateforme a été conçue dès le départ pour être une solution mobile-first, accessible même avec une connexion internet limitée, et respectueuse des contextes culturels locaux. Notre objectif n'est pas de remplacer les soins traditionnels, mais de les compléter en offrant une première porte d'entrée, un soutien quotidien et un pont vers une aide plus spécialisée.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Nos Valeurs Fondamentales</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            Ce qui guide chacune de nos décisions et le développement de notre plateforme.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard icon={Heart} title="Empathie">
                            Nous plaçons l'écoute et la bienveillance au cœur de chaque interaction.
                        </ValueCard>
                        <ValueCard icon={Shield} title="Confidentialité">
                            Votre sécurité et votre anonymat sont notre priorité absolue. Vos données vous appartiennent.
                        </ValueCard>
                        <ValueCard icon={Target} title="Accessibilité">
                            Nous nous engageons à rendre nos outils disponibles pour le plus grand nombre, quelles que soient les contraintes.
                        </ValueCard>
                        <ValueCard icon={Eye} title="Inclusivité">
                            Nous célébrons la diversité et nous efforçons de créer un espace où chacun se sent respecté et compris.
                        </ValueCard>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
