
import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { JournalEntry, Mood } from '../../types';
import { Smile, Frown, Meh, Laugh, Angry } from 'lucide-react';
import MeditationReminder from '../reminders/MeditationReminder';

const moodOptions: { mood: Mood; label: string; icon: React.ElementType, color: string }[] = [
  { mood: 'radieux', label: 'Radieux', icon: Laugh, color: 'text-yellow-400' },
  { mood: 'heureux', label: 'Heureux', icon: Smile, color: 'text-emerald-400' },
  { mood: 'neutre', label: 'Neutre', icon: Meh, color: 'text-sky-400' },
  { mood: 'triste', label: 'Triste', icon: Frown, color: 'text-blue-400' },
  { mood: 'terrible', label: 'Terrible', icon: Angry, color: 'text-red-400' },
];

const MoodTracker: React.FC<{ onAddEntry: (entry: JournalEntry) => void }> = ({ onAddEntry }) => {
    const [selectedMood, setSelectedMood] = React.useState<Mood | null>(null);
    const [note, setNote] = React.useState('');

    const handleSubmit = () => {
        if (!selectedMood) return;
        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
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

const JournalList: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
    if (entries.length === 0) {
        return <div className="text-center text-slate-500 dark:text-slate-400">Aucune entrée dans votre journal.</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Vos entrées précédentes</h2>
            {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => {
                const moodInfo = moodOptions.find(m => m.mood === entry.mood);
                const Icon = moodInfo?.icon || Meh;
                return (
                    <div key={entry.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-start space-x-4">
                        <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-700 ${moodInfo?.color}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{entry.mood}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            {entry.note && <p className="mt-2 text-slate-700 dark:text-slate-300">{entry.note}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const JournalPage: React.FC = () => {
    const [entries, setEntries] = useLocalStorage<JournalEntry[]>('mindcare-journal-entries', []);

    const addEntry = (entry: JournalEntry) => {
        setEntries(prev => [...prev, entry]);
    };

    return (
        <div>
            <MeditationReminder />
            <MoodTracker onAddEntry={addEntry} />
            <JournalList entries={entries} />
        </div>
    );
};

export default JournalPage;
