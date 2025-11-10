
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ReminderSettings } from '../../types';
import { Bell, BellOff, Clock } from 'lucide-react';

const dayLabels = {
    lundi: 'L',
    mardi: 'M',
    mercredi: 'M',
    jeudi: 'J',
    vendredi: 'V',
    samedi: 'S',
    dimanche: 'D',
};

const dayKeys: (keyof ReminderSettings['days'])[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const MeditationReminder: React.FC = () => {
    const [settings, setSettings] = useLocalStorage<ReminderSettings>('mindcare-meditation-reminders', {
        enabled: false,
        time: '08:00',
        days: {
            lundi: true,
            mardi: true,
            mercredi: true,
            jeudi: true,
            vendredi: true,
            samedi: false,
            dimanche: false,
        },
    });
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

    useEffect(() => {
        // Re-check permission if it changes in browser settings
        const interval = setInterval(() => {
            if (Notification.permission !== notificationPermission) {
                setNotificationPermission(Notification.permission);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [notificationPermission]);

    const handleToggleEnable = async () => {
        let permission = notificationPermission;
        if (!settings.enabled && permission === 'default') {
            permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }

        if (permission === 'granted') {
            setSettings(s => ({ ...s, enabled: !s.enabled }));
        } else if (!settings.enabled && permission === 'denied') {
            alert("Les notifications sont bloquées. Veuillez les autoriser dans les paramètres de votre navigateur pour utiliser cette fonctionnalité.");
        } else {
            // This will handle turning it off when enabled
            setSettings(s => ({ ...s, enabled: false }));
        }
    };

    const handleDayToggle = (day: keyof ReminderSettings['days']) => {
        setSettings(s => ({
            ...s,
            days: { ...s.days, [day]: !s.days[day] }
        }));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({ ...s, time: e.target.value }));
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <Clock size={20} className="mr-2 text-purple-500" />
                        Rappels de Méditation
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Prenez un moment pour vous, chaque jour.
                    </p>
                </div>
                <button onClick={handleToggleEnable} className={`p-2 rounded-full transition-colors ${settings.enabled ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {settings.enabled ? <Bell size={20} /> : <BellOff size={20} />}
                </button>
            </div>

            {settings.enabled && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="reminder-time" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                            Heure du rappel
                        </label>
                        <input
                            type="time"
                            id="reminder-time"
                            value={settings.time}
                            onChange={handleTimeChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <p className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            Jours de la semaine
                        </p>
                        <div className="flex justify-between space-x-1">
                            {dayKeys.map(day => (
                                <button
                                    key={day}
                                    onClick={() => handleDayToggle(day)}
                                    className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${settings.days[day] ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    aria-label={day}
                                >
                                    {dayLabels[day as keyof typeof dayLabels]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {notificationPermission === 'denied' && (
                 <p className="text-xs text-rose-500 mt-3">
                    Les permissions de notification sont bloquées. Vous devez les activer dans les paramètres de votre navigateur.
                 </p>
            )}
        </div>
    );
};

export default MeditationReminder;
