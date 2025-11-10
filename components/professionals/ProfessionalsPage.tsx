import React, { useState, useMemo } from 'react';
import { Psychologist } from '../../types';

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
            <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Parler à un professionnel</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Trouvez un psychologue certifié pour une consultation en ligne sécurisée.</p>

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