import React, { useState, useMemo } from 'react';
import { Psychologist } from '../../types';
import { getGroundedResponseWithMaps } from '../../services/geminiService';
import { Search, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

const psychologists: Psychologist[] = [
    {
        id: '1',
        name: 'Dr. Amina Diallo',
        specialty: 'Thérapie Cognitivo-Comportementale (TCC)',
        imageUrl: 'https://picsum.photos/seed/pro1/200/200',
        description: 'Spécialisée dans la gestion de l\'anxiété, du stress et de la dépression. Approche pragmatique et orientée solutions.',
    },
    {
        id: '2',
        name: 'M. Koffi Anan',
        specialty: 'Psychologie Positive & Pleine Conscience',
        imageUrl: 'https://picsum.photos/seed/pro2/200/200',
        description: 'Aide à cultiver le bien-être, la résilience et à trouver un sens à sa vie. Séances individuelles et de groupe.',
    },
    {
        id: '3',
        name: 'Mme Fatou N\'diaye',
        specialty: 'Soutien psychologique & Thérapie familiale',
        imageUrl: 'https://picsum.photos/seed/pro3/200/200',
        description: 'Accompagnement pour les difficultés relationnelles, les transitions de vie et les problématiques familiales.',
    },
];

const specialties = ['Tous', ...Array.from(new Set(psychologists.map(p => p.specialty)))];

const PsychologistCard: React.FC<{ psychologist: Psychologist }> = ({ psychologist }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={psychologist.imageUrl} alt={psychologist.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
            <div className="text-center sm:text-left">
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">{psychologist.name}</h3>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{psychologist.specialty}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{psychologist.description}</p>
                <button className="mt-4 py-2 px-4 bg-emerald-600 text-white text-sm font-semibold rounded-md hover:bg-emerald-700 transition-colors">
                    Prendre rendez-vous
                </button>
            </div>
        </div>
    )
}

const GroundedSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse(null);

        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await getGroundedResponseWithMaps(query, { latitude, longitude });
                    setResponse(result);
                } catch (err: any) {
                    setError(err.message || "Une erreur est survenue lors de la recherche.");
                } finally {
                    setIsLoading(false);
                }
            },
            (geoError) => {
                setError(`Erreur de géolocalisation : ${geoError.message}. Veuillez autoriser l'accès à votre position.`);
                setIsLoading(false);
            }
        );
    };

    const groundingChunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                <MapPin className="mr-2 text-emerald-500"/>
                Qui peut m'aider près de chez moi ?
            </h2>
            <form onSubmit={handleSearch}>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="'psychologues près de moi', 'soutien anxiété'..."
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-slate-400 flex items-center justify-center w-28">
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                    </button>
                </div>
            </form>
            {error && <p className="text-rose-500 mt-4">{error}</p>}
            {response && (
                <div className="mt-6">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{response.text}</p>
                     {groundingChunks && groundingChunks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sources :</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {groundingChunks.map((chunk, index) => (
                                    chunk.maps && (
                                        <li key={index} className="text-sm">
                                            <a 
                                                href={chunk.maps.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
                                            >
                                                {chunk.maps.title}
                                                <ExternalLink size={12} className="ml-1.5" />
                                            </a>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const ProfessionalsPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');

    const filteredPsychologists = useMemo(() => {
        if (activeFilter === 'Tous') {
            return psychologists;
        }
        return psychologists.filter(p => p.specialty === activeFilter);
    }, [activeFilter]);

    return (
        <div>
            <GroundedSearch />

            <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Parler à un professionnel</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Trouvez un psychologue certifié de notre réseau pour une consultation en ligne sécurisée.</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {specialties.map(specialty => (
                    <button
                        key={specialty}
                        onClick={() => setActiveFilter(specialty)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            activeFilter === specialty
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        {specialty}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filteredPsychologists.length > 0 ? (
                    filteredPsychologists.map(pro => (
                        <PsychologistCard key={pro.id} psychologist={pro} />
                    ))
                ) : (
                     <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">Aucun professionnel ne correspond à votre filtre.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalsPage;
