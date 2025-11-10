
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { JournalEntry, Mood } from '../../types';
import { Smile, Frown, Meh, Laugh, Angry, Sparkles, Loader2 } from 'lucide-react';
import MeditationReminder from '../reminders/MeditationReminder';
import { getReflectiveResponse } from '../../services/geminiService';


const moodOptions: { mood: Mood; label: string; icon: React.ElementType, color: string }[] = [
  { mood: 'radieux', label: 'Radieux', icon: Laugh, color: 'text-yellow-400' },
  { mood: 'heureux', label: 'Heureux', icon: Smile, color: 'text-emerald-400' },
  { mood: 'neutre', label: 'Neutre', icon: Meh, color: 'text-sky-400' },
  { mood: 'triste', label: 'Triste', icon: Frown, color: 'text-blue-400' },
  { mood: 'terrible', label: 'Terrible', icon: Angry, color: 'text-red-400' },
];

const MoodTracker: React.FC<{ onAddEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void }> = ({ onAddEntry }) => {
    const [selectedMood, setSelectedMood] = React.useState<Mood | null>(null);
    const [note, setNote] = React.useState('');

    const handleSubmit = () => {
        if (!selectedMood) return;
        const newEntry: Omit<JournalEntry, 'id' | 'date'> = {
            mood: selectedMood,
            note: note,
        };
        onAddEntry(newEntry);
        setSelectedMood(null);
        setNote('');
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Comment vous sentez-vous aujourd'hui ?</h2>
            <div className="flex justify-around mb-4">
                {moodOptions.map(({ mood, icon: Icon, color }) => (
                    <button key={mood} onClick={() => setSelectedMood(mood)} className={`p-3 rounded-full transition-transform transform hover:scale-110 ${selectedMood === mood ? 'bg-emerald-100 dark:bg-emerald-900 ring-2 ring-emerald-500' : ''}`}>
                        <Icon size={32} className={color} />
                    </button>
                ))}
            </div>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajoutez une note sur votre journée..."
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                rows={3}
            />
            <button onClick={handleSubmit} disabled={!selectedMood} className="mt-4 w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                Enregistrer mon humeur
            </button>
        </div>
    );
};

const JournalEntryCard: React.FC<{
    entry: JournalEntry;
    onGetReflection: (entryId: string) => void;
    isLoadingReflection: boolean;
    currentReflectionId: string | null;
}> = ({ entry, onGetReflection, isLoadingReflection, currentReflectionId }) => {
    const moodInfo = moodOptions.find(m => m.mood === entry.mood);
    const Icon = moodInfo?.icon || Meh;
    const isThisEntryLoading = isLoadingReflection && currentReflectionId === entry.id;

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
             <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-700 ${moodInfo?.color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{entry.mood}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {entry.note && <p className="mt-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{entry.note}</p>}
                </div>
            </div>
            {entry.reflection ? (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg border-l-4 border-emerald-400">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center"><Sparkles size={16} className="mr-2"/> Réflexion de Mindy</h4>
                    <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300/90 whitespace-pre-wrap">{entry.reflection}</p>
                </div>
            ) : (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => onGetReflection(entry.id)}
                        disabled={isThisEntryLoading}
                        className="flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-900 disabled:opacity-50"
                    >
                        {isThisEntryLoading ? (
                            <>
                                <Loader2 size={14} className="animate-spin mr-2" />
                                Réflexion en cours...
                            </>
                        ) : (
                             <>
                                <Sparkles size={14} className="mr-2" />
                                Obtenir une réflexion de Mindy
                            </>
                        )}
                       
                    </button>
                </div>
            )}
        </div>
    )
}

const JournalList: React.FC<{ 
    entries: JournalEntry[]; 
    onGetReflection: (entryId: string) => void;
    isLoadingReflection: boolean;
    currentReflectionId: string | null;
}> = ({ entries, onGetReflection, isLoadingReflection, currentReflectionId }) => {
    if (entries.length === 0) {
        return <div className="text-center text-slate-500 dark:text-slate-400">Aucune entrée dans votre journal.</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Vos entrées précédentes</h2>
            {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                <JournalEntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onGetReflection={onGetReflection}
                    isLoadingReflection={isLoadingReflection}
                    currentReflectionId={currentReflectionId}
                />
            ))}
        </div>
    );
};


const JournalPage: React.FC = () => {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('mindcare-journal-entries', []);
    const [isLoadingReflection, setIsLoadingReflection] = useState(false);
    const [currentReflectionId, setCurrentReflectionId] = useState<string | null>(null);

    const addEntry = (newEntryData: Omit<JournalEntry, 'id' | 'date'>) => {
        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            ...newEntryData
        };
        setEntries(prev => [...prev, newEntry]);
    };

    const handleGetReflection = async (entryId: string) => {
        const entry = entries.find(e => e.id === entryId);
        if (!entry || entry.reflection) return;

        setIsLoadingReflection(true);
        setCurrentReflectionId(entryId);
        try {
            const reflectionText = await getReflectiveResponse(entry.note);
            setEntries(prevEntries => 
                prevEntries.map(e => 
                    e.id === entryId ? { ...e, reflection: reflectionText } : e
                )
            );
        } catch (error) {
            console.error("Failed to get reflection:", error);
            alert("Désolé, une erreur est survenue lors de la génération de la réflexion.");
        } finally {
            setIsLoadingReflection(false);
            setCurrentReflectionId(null);
        }
    };

    return (
        <div>
            <MeditationReminder />
            <MoodTracker onAddEntry={addEntry} />
            <JournalList 
                entries={entries} 
                onGetReflection={handleGetReflection}
                isLoadingReflection={isLoadingReflection}
                currentReflectionId={currentReflectionId}
            />
        </div>
    );
};

export default JournalPage;
