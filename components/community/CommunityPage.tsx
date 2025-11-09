
import React, { useState, useMemo } from 'react';
import { ForumPost } from '../../types';
import { MessageSquare, Search, TrendingUp, Clock } from 'lucide-react';

const forumPosts: ForumPost[] = [
    {
        id: '1',
        author: 'Soleil_Calme',
        title: 'Comment gérez-vous le stress avant un événement important ?',
        content: 'J\'ai une présentation la semaine prochaine et je sens l\'anxiété monter. Des astuces pour rester serein ?',
        timestamp: 'Il y a 2 heures',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        replies: 12,
        category: 'Gestion du stress',
    },
    {
        id: '2',
        author: 'Rivière_Tranquille',
        title: 'Petites victoires de la semaine',
        content: 'Partageons quelque chose de positif qui nous est arrivé cette semaine, aussi petit soit-il ! Pour moi, j\'ai réussi à faire une promenade de 20 minutes chaque jour.',
        timestamp: 'Il y a 1 jour',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        replies: 45,
        category: 'Petites victoires',
    },
    {
        id: '3',
        author: 'Étoile_Filante',
        title: 'Se sentir seul(e) même entouré(e)',
        content: 'Est-ce que ça vous arrive aussi ? Parfois, même avec des amis ou de la famille, je ressens un grand vide. Comment y faire face ?',
        timestamp: 'Il y a 3 jours',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 28,
        category: 'Relations',
    },
     {
        id: '4',
        author: 'Ami_Soutien',
        title: 'Besoin de parler',
        content: 'Je traverse une période difficile et j\'aurais juste besoin de quelqu\'un à qui parler, sans jugement. Merci de m\'écouter.',
        timestamp: 'Il y a 5 jours',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 35,
        category: 'Soutien',
    },
];

const categories = ['Toutes', ...Array.from(new Set(forumPosts.map(p => p.category)))];


const ForumPostCard: React.FC<{ post: ForumPost }> = ({ post }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-1 rounded-full">{post.category}</span>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mt-3">{post.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{post.content}</p>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Par <strong>{post.author}</strong> • {post.timestamp}</span>
                <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{post.replies} réponses</span>
                </div>
            </div>
        </div>
    );
}

const CommunityPage: React.FC = () => {
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

    const filteredAndSortedPosts = useMemo(() => {
        let posts = [...forumPosts];

        // 1. Filter by category
        if (selectedCategory !== 'Toutes') {
            posts = posts.filter(p => p.category === selectedCategory);
        }

        // 2. Filter by search term
        if (searchTerm.trim() !== '') {
            posts = posts.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 3. Sort
        if (sortBy === 'latest') {
            posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === 'popular') {
            posts.sort((a, b) => b.replies - a.replies);
        }

        return posts;
    }, [sortBy, searchTerm, selectedCategory]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Forums de discussion</h1>
                <p className="text-slate-600 dark:text-slate-400">Un espace d'échange anonyme et bienveillant.</p>
            </div>

            {/* Filter and Sort Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-6 space-y-4">
                 {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Rechercher un sujet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Category Filters */}
                 <div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                             <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${selectedCategory === category ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Trier par:</span>
                    <button onClick={() => setSortBy('latest')} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${sortBy === 'latest' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                       <Clock size={16} />
                       <span>Plus récents</span>
                    </button>
                     <button onClick={() => setSortBy('popular')} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${sortBy === 'popular' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                       <TrendingUp size={16} />
                       <span>Plus populaires</span>
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                {filteredAndSortedPosts.length > 0 ? (
                    filteredAndSortedPosts.map(post => (
                        <ForumPostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">Aucune publication ne correspond à vos critères.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;