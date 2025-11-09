
import React from 'react';
import { Resource } from '../../types';
import { Video, Mic, FileText } from 'lucide-react';

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

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <img src={resource.imageUrl} alt={resource.title} className="w-full h-40 object-cover" />
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
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Ressources pour votre bien-être</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
