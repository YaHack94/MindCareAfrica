
import React, { useState, useMemo } from 'react';
import { BlogPost } from '../../types';
import { Search } from 'lucide-react';

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: '5 Techniques de respiration pour calmer l\'anxiété instantanément',
        excerpt: 'Découvrez des exercices simples mais puissants que vous pouvez faire n\'importe où pour retrouver votre calme lorsque le stress monte.',
        imageUrl: 'https://picsum.photos/seed/blog1/400/250',
        author: 'Dr. Amina Diallo',
        date: '15 juillet 2024',
        category: 'Gestion du stress',
    },
    {
        id: '2',
        title: 'Briser la solitude : Comment créer des liens authentiques',
        excerpt: 'Se sentir seul est une expérience humaine courante. Cet article explore des stratégies pour surmonter l\'isolement et bâtir des relations significatives.',
        imageUrl: 'https://picsum.photos/seed/blog2/400/250',
        author: 'M. Koffi Anan',
        date: '10 juillet 2024',
        category: 'Relations',
    },
    {
        id: '3',
        title: 'L\'importance de célébrer vos petites victoires',
        excerpt: 'Apprenez pourquoi reconnaître vos plus petits succès est crucial pour votre motivation et votre estime de soi à long terme.',
        imageUrl: 'https://picsum.photos/seed/blog3/400/250',
        author: 'L\'équipe MindCare',
        date: '5 juillet 2024',
        category: 'Bien-être',
    },
    {
        id: '4',
        title: 'Le sommeil, votre allié N°1 pour la santé mentale',
        excerpt: 'Nous sous-estimons souvent le pouvoir d\'une bonne nuit de sommeil. Découvrez le lien direct entre le sommeil et votre équilibre émotionnel.',
        imageUrl: 'https://picsum.photos/seed/blog4/400/250',
        author: 'Dr. Amina Diallo',
        date: '1 juillet 2024',
        category: 'Santé',
    },
     {
        id: '5',
        title: 'Déculpabiliser : Pourquoi il est normal de ne pas aller bien',
        excerpt: 'Dans une société qui prône la positivité constante, il est essentiel de se rappeler que toutes les émotions sont valides. Apprenons à accepter nos jours sans.',
        imageUrl: 'https://picsum.photos/seed/blog5/400/250',
        author: 'L\'équipe MindCare',
        date: '25 juin 2024',
        category: 'Réflexion',
    },
      {
        id: '6',
        title: 'Poser ses limites : un acte d\'amour-propre',
        excerpt: 'Dire non n\'est pas égoïste, c\'est nécessaire. Cet article vous donne des clés pour définir et communiquer vos limites de manière saine.',
        imageUrl: 'https://picsum.photos/seed/blog6/400/250',
        author: 'M. Koffi Anan',
        date: '20 juin 2024',
        category: 'Relations',
    },
];

const categories = ['Toutes', ...Array.from(new Set(blogPosts.map(p => p.category)))];

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden group cursor-pointer transition-transform transform hover:-translate-y-1">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-1 rounded-full">{post.category}</span>
            <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-200 mt-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{post.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{post.excerpt}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">{post.author} • {post.date}</p>
        </div>
    </div>
);

const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Toutes');

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(post => {
            const matchesCategory = selectedCategory === 'Toutes' || post.category === selectedCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    return (
        <div className="animate-fade-in py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">Notre Blog</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        Des articles, des conseils et des réflexions pour vous accompagner dans votre parcours de bien-être.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${selectedCategory === category ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => <BlogPostCard key={post.id} post={post} />)}
                    </div>
                ) : (
                    <div className="text-center py-16">
                         <p className="text-slate-500 dark:text-slate-400">Aucun article ne correspond à votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
