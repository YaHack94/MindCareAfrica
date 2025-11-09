
import React from 'react';
import { ForumPost } from '../../types';
import { MessageSquare } from 'lucide-react';

const forumPosts: ForumPost[] = [
    {
        id: '1',
        author: 'Soleil_Calme',
        title: 'Comment gérez-vous le stress avant un événement important ?',
        content: 'J\'ai une présentation la semaine prochaine et je sens l\'anxiété monter. Des astuces pour rester serein ?',
        timestamp: 'Il y a 2 heures',
        replies: 12,
    },
    {
        id: '2',
        author: 'Rivière_Tranquille',
        title: 'Petites victoires de la semaine',
        content: 'Partageons quelque chose de positif qui nous est arrivé cette semaine, aussi petit soit-il ! Pour moi, j\'ai réussi à faire une promenade de 20 minutes chaque jour.',
        timestamp: 'Il y a 1 jour',
        replies: 45,
    },
    {
        id: '3',
        author: 'Étoile_Filante',
        title: 'Se sentir seul(e) même entouré(e)',
        content: 'Est-ce que ça vous arrive aussi ? Parfois, même avec des amis ou de la famille, je ressens un grand vide. Comment y faire face ?',
        timestamp: 'Il y a 3 jours',
        replies: 28,
    },
];

const ForumPostCard: React.FC<{ post: ForumPost }> = ({ post }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg text-emerald-700 dark:text-emerald-400">{post.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{post.content}</p>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500 dark:text-slate-500">
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
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Forums de discussion</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Un espace d'échange anonyme et bienveillant.</p>
            <div className="space-y-4">
                {forumPosts.map(post => (
                    <ForumPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;
