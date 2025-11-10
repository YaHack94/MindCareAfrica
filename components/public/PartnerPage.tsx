
import React from 'react';
import { Handshake, Building, HeartPulse } from 'lucide-react';

// Dummy CheckCircle component for styling
const CheckCircle: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const PartnerCard: React.FC<{ icon: React.ElementType, title: string, children: string }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-1">
        <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full">
            <Icon size={40} />
        </div>
        <h3 className="text-2xl font-bold mt-6 text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="mt-4 text-slate-600 dark:text-slate-400">{children}</p>
    </div>
);

const PartnerPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">Ensemble, amplifions notre impact.</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        Nous sommes convaincus que la collaboration est la clé pour bâtir un avenir où le bien-être mental est une priorité pour tous. Rejoignez-nous.
                    </p>
                </div>
            </section>

            {/* Who We Partner With Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Nous collaborons avec</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            Des organisations qui partagent notre vision d'un soutien mental accessible et de qualité.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        <PartnerCard icon={Handshake} title="ONGs et Associations">
                            Intégrez nos outils dans vos programmes de soutien communautaire pour étendre votre portée et offrir un support numérique continu à vos bénéficiaires.
                        </PartnerCard>
                        <PartnerCard icon={Building} title="Entreprises & Employeurs">
                            Proposez MindCare Africa comme une ressource confidentielle de bien-être pour vos employés. Investissez dans leur santé mentale et améliorez leur épanouissement.
                        </PartnerCard>
                        <PartnerCard icon={HeartPulse} title="Professionnels de la santé">
                            Rejoignez notre réseau d'experts certifiés pour offrir des consultations en ligne ou utilisez notre plateforme comme un complément à votre pratique existante.
                        </PartnerCard>
                    </div>
                </div>
            </section>
            
            {/* Why Partner Section */}
            <section className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-6">
                     <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Pourquoi devenir partenaire ?</h2>
                             <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                                <li className="flex items-start">
                                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-3 mt-1" />
                                    <span><strong>Impact à grande échelle :</strong> Touchez des milliers de personnes à travers le continent grâce à une solution numérique.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-3 mt-1" />
                                    <span><strong>Technologie innovante :</strong> Profitez d'une plateforme robuste, sécurisée et conçue pour être accessible même avec une faible connectivité.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-3 mt-1" />
                                    <span><strong>Expertise locale :</strong> Collaborez avec une équipe qui comprend les nuances culturelles et les défis spécifiques de la région.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-emerald-500 mr-3 mt-1" />
                                    <span><strong>Visibilité et engagement :</strong> Associez votre marque à une cause sociale essentielle et démontrez votre engagement envers le bien-être communautaire.</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <img src="https://picsum.photos/seed/partner/600/450" alt="Collaboration pour le bien-être" className="rounded-lg shadow-xl" />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="bg-emerald-600">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold text-white">Prêt à faire la différence avec nous ?</h2>
                    <p className="mt-2 text-emerald-100 max-w-xl mx-auto">Contactez notre équipe dédiée aux partenariats pour discuter des possibilités de collaboration.</p>
                    <a
                        href="mailto:partenaires@mindcare.africa"
                        className="mt-8 inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-full hover:bg-emerald-50 transition-transform transform hover:scale-105 shadow-lg text-lg"
                    >
                        Contacter notre équipe
                    </a>
                </div>
            </section>
        </div>
    );
};

export default PartnerPage;
