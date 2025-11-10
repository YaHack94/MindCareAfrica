
import React from 'react';
import { ShieldCheck, Bot, Users, BarChart, Heart, ArrowRight } from 'lucide-react';
import { blogPosts } from './BlogPage'; // Import mock data

interface HomePageProps {
    onNavigateToAuth: () => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-left transition-transform transform hover:-translate-y-1">
        <div className="inline-block p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-semibold mt-4 text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, author: string, image: string }> = ({ quote, author, image }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
        <img src={image} alt={author} className="w-16 h-16 rounded-full object-cover mb-4" />
        <p className="text-slate-600 dark:text-slate-400 italic">"{quote}"</p>
        <cite className="mt-4 font-semibold text-slate-700 dark:text-slate-300 not-italic">- {author}</cite>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigateToAuth }) => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-20 lg:py-32 px-4 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-slate-800 dark:text-slate-100 leading-tight">
                        Un soutien pour votre bien-être mental, <br />
                        <span className="text-emerald-500">à portée de main.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-8">
                        MindCare Africa est votre espace sécurisé pour parler, réfléchir et trouver des ressources. Anonyme, accessible et toujours à votre écoute.
                    </p>
                    <button
                        onClick={onNavigateToAuth}
                        className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 transition-transform transform hover:scale-105 shadow-lg text-lg"
                    >
                        Commencer mon parcours
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 lg:py-24 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Un espace conçu pour vous</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            Découvrez des outils et une communauté pour vous accompagner à chaque étape de votre cheminement.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={ShieldCheck} title="Anonymat et Sécurité">
                            Exprimez-vous librement. Votre identité et vos conversations restent privées, toujours.
                        </FeatureCard>
                        <FeatureCard icon={Bot} title="Chat IA Empathique">
                            Discutez 24/7 avec Mindy, une IA conçue pour écouter sans jugement et offrir un soutien immédiat.
                        </FeatureCard>
                        <FeatureCard icon={Users} title="Communauté Solidaire">
                            Échangez avec d'autres personnes qui comprennent ce que vous vivez dans des forums bienveillants.
                        </FeatureCard>
                         <FeatureCard icon={Heart} title="Journal d'Humeur">
                            Suivez vos émotions et vos progrès personnels pour mieux vous comprendre au fil du temps.
                        </FeatureCard>
                         <FeatureCard icon={BarChart} title="Ressources Pratiques">
                           Accédez à des articles, podcasts et exercices pour cultiver votre bien-être mental.
                        </FeatureCard>
                        <FeatureCard icon={ArrowRight} title="Et bien plus encore">
                            De la méditation guidée à la possibilité de parler à des experts, votre parcours est complet.
                        </FeatureCard>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Ils ont trouvé du réconfort</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Des parcours réels, des vies changées.</p>
                    </div>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        <TestimonialCard 
                            quote="Avoir un espace pour parler sans crainte d'être jugé a tout changé pour moi. Mindy est une oreille attentive à toute heure."
                            author="Aïcha K."
                            image="https://picsum.photos/seed/person1/100/100"
                        />
                         <TestimonialCard 
                            quote="Le journal d'humeur m'a permis de voir des schémas que je n'avais jamais remarqués. C'est un outil simple mais si puissant."
                            author="Moussa B."
                            image="https://picsum.photos/seed/person2/100/100"
                        />
                         <TestimonialCard 
                            quote="Je me sentais tellement seul. Lire les témoignages sur le forum m'a fait comprendre que je n'étais pas le seul. Ça m'a donné de la force."
                            author="Fatou D."
                            image="https://picsum.photos/seed/person3/100/100"
                        />
                    </div>
                </div>
            </section>

            {/* Blog Preview Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Depuis notre blog</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Conseils et réflexions pour votre bien-être.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.slice(0, 3).map(post => (
                             <div key={post.id} className="bg-white dark:bg-slate-850 rounded-lg shadow-md overflow-hidden group">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-1 rounded-full">{post.category}</span>
                                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mt-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{post.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{post.excerpt}</p>
                                    <p className="text-xs text-slate-500 mt-4">{post.author} • {post.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Final CTA */}
            <section className="bg-emerald-600 dark:bg-emerald-700">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold text-white">Prêt à prendre soin de vous ?</h2>
                    <p className="mt-2 text-emerald-100 max-w-xl mx-auto">Rejoignez des milliers de personnes qui ont déjà commencé leur parcours vers un meilleur bien-être mental.</p>
                    <button
                        onClick={onNavigateToAuth}
                        className="mt-8 bg-white text-emerald-600 font-bold py-3 px-8 rounded-full hover:bg-emerald-50 transition-transform transform hover:scale-105 shadow-lg text-lg"
                    >
                        Créer mon compte gratuit
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
