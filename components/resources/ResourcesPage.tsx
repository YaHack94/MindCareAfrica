import React, { useState } from 'react';
import { Resource } from '../../types';
import { Video, Mic, FileText, Star } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const resources: Resource[] = [
  {
    id: '1',
    type: 'video',
    title: 'Introduction à la pleine conscience',
    description: 'Une séance guidée de 10 minutes pour débutants.',
    imageUrl: 'https://picsum.photos/seed/mindfulness/400/225',
    source: 'Chaîne YouTube "Bien-être pour tous"',
  },
  {
    id: '2',
    type: 'podcast',
    title: 'Gérer l\'anxiété au quotidien',
    description: 'Conseils pratiques d\'un psychologue clinicien.',
    imageUrl: 'https://picsum.photos/seed/anxiety/400/225',
    source: 'Podcast "Psycho-Logique"',
  },
  {
    id: '3',
    type: 'article',
    title: 'L\'importance du sommeil pour la santé mentale',
    description: 'Découvrez pourquoi bien dormir est crucial.',
    imageUrl: 'https://picsum.photos/seed/sleep/400/225',
    source: 'Blog de l\'Institut de Santé Mentale',
  },
    {
    id: '4',
    type: 'article',
    title: 'Techniques de Respiration pour Calmer le Stress',
    description: 'Apprenez des exercices simples et efficaces.',
    imageUrl: 'https://picsum.photos/seed/breathing/400/225',
    source: 'MindCare Africa Blog',
  },
];

const ResourceIcon = ({ type }: { type: Resource['type'] }) => {
    switch(type) {
        case 'video': return <Video className="w-5 h-5 text-rose-500" />;
        case 'podcast': return <Mic className="w-5 h-5 text-sky-500" />;
        case 'article': return <FileText className="w-5 h-5 text-emerald-500" />;
        default: return null;
    }
}

const ResourceCard: React.FC<{ resource: Resource; isFavorite: boolean; onToggleFavorite: () => void; }> = ({ resource, isFavorite, onToggleFavorite }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 relative">
       <img src={resource.imageUrl} alt={resource.title} className="w-full h-40 object-cover" />
       
       <button 
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-colors z-10"
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Star 
          size={20} 
          className={`transition-all ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 dark:text-slate-400'}`} 
        />
      </button>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
            <ResourceIcon type={resource.type} />
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{resource.type}</span>
        </div>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{resource.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{resource.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">Source: {resource.source}</p>
      </div>
    </div>
  );
};

const ResourcesPage: React.FC = () => {
  const [favoritedIds, setFavoritedIds] = useLocalStorage<string[]>('mindcare-favorite-resources-ids', []);
  const [offlineResources, setOfflineResources] = useLocalStorage<Resource[]>('mindcare-offline-resources', []);
  const [view, setView] = useState<'all' | 'favorites'>('all');

  const handleToggleFavorite = (resource: Resource) => {
    const isFavorited = favoritedIds.includes(resource.id);
    if (isFavorited) {
      // Remove from favorites
      setFavoritedIds(prevIds => prevIds.filter(id => id !== resource.id));
      setOfflineResources(prevOffline => prevOffline.filter(r => r.id !== resource.id));
    } else {
      // Add to favorites
      setFavoritedIds(prevIds => [...prevIds, resource.id]);
      setOfflineResources(prevOffline => [...prevOffline, resource]);
    }
  };

  const resourcesToShow = view === 'all' ? resources : offlineResources;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Ressources</h1>
        
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-full">
          <button
            onClick={() => setView('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'all' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}
          >
            Toutes
          </button>
          <button
            onClick={() => setView('favorites')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === 'favorites' ? 'bg-white dark:bg-slate-800 shadow text-emerald-600' : 'text-slate-500'}`}
          >
            Favoris
          </button>
        </div>
      </div>
      
      {view === 'favorites' && resourcesToShow.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg">
            <Star size={48} className="mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">Aucun favori pour le moment</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Cliquez sur l'étoile sur une ressource pour l'ajouter ici et y accéder hors ligne.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourcesToShow.map((resource) => (
          <ResourceCard 
            key={resource.id} 
            resource={resource}
            isFavorite={favoritedIds.includes(resource.id)}
            onToggleFavorite={() => handleToggleFavorite(resource)}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;