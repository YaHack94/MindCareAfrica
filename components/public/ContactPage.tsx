
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('sent');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }, 1500);
    };

    return (
        <div className="animate-fade-in py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">Contactez-nous</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous répondre.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Envoyez-nous un message</h2>
                        {status === 'sent' ? (
                            <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg">
                                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Merci !</h3>
                                <p className="mt-2 text-emerald-600 dark:text-emerald-400">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
                            </div>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom complet</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Adresse e-mail</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sujet</label>
                                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                                <textarea id="message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={status === 'sending'} className="w-full py-3 px-6 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 disabled:bg-slate-400 flex items-center justify-center">
                                    {status === 'sending' && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>}
                                    {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </div>
                        </form>
                        )}
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
                            <Mail size={24} className="text-emerald-500 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Email</h3>
                                <p className="text-slate-600 dark:text-slate-400">support@mindcare.africa</p>
                            </div>
                        </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
                            <Phone size={24} className="text-emerald-500 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Téléphone</h3>
                                <p className="text-slate-600 dark:text-slate-400">+229 90 00 00 00</p>
                            </div>
                        </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-start space-x-4">
                            <MapPin size={24} className="text-emerald-500 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Adresse</h3>
                                <p className="text-slate-600 dark:text-slate-400">123 Rue de la Paix, Cotonou, Bénin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
