import React, { useState, useEffect } from 'react';
import { MapPin, User, Shield, Loader2, X, Send, UserCheck, Clock, Check } from 'lucide-react';
import { ConnectionRequest } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';


interface Location {
    latitude: number;
    longitude: number;
}

interface NearbyUser {
    id: string;
    pseudonym: string;
    bio: string;
    position: {
        top: string;
        left: string;
    };
}

const fakePseudonyms = [
    'Ami_Solidaire', 'Étoile_Bienveillante', 'Rivage_Paisible', 'Ciel_Clair', 'Sentier_Serein',
    'Lueur_Douce', 'Vent_Calme', 'Horizon_Nouveau', 'Source_Vive', 'Forêt_Tranquille'
];

const fakeBios = [
    "Ici pour écouter et partager.",
    "Traverse des hauts et des bas, comme tout le monde.",
    "Cherche à trouver la paix intérieure.",
    "Passionné(e) par la croissance personnelle.",
    "Un jour à la fois.",
    "Crois au pouvoir de la communauté.",
];

// Helper to generate random users around the user (center of the map)
const generateNearbyUsers = (count: number): NearbyUser[] => {
    const users: NearbyUser[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let pseudonym = fakePseudonyms[Math.floor(Math.random() * fakePseudonyms.length)];
        while (usedNames.has(pseudonym)) {
            pseudonym = fakePseudonyms[Math.floor(Math.random() * fakePseudonyms.length)];
        }
        usedNames.add(pseudonym);
        
        users.push({
            id: `user-${i}-${Date.now()}`,
            pseudonym,
            bio: fakeBios[Math.floor(Math.random() * fakeBios.length)],
            position: {
                top: `${50 + (Math.random() - 0.5) * 80}%`,
                left: `${50 + (Math.random() - 0.5) * 80}%`,
            },
        });
    }
    return users;
};

type ConnectionStatus = 'none' | 'sent_pending' | 'received_pending' | 'connected';

const UserProfileModal: React.FC<{
    user: NearbyUser;
    onClose: () => void;
    connectionStatus: ConnectionStatus;
    onSendRequest: (user: NearbyUser) => void;
    onAcceptRequest: (user: NearbyUser) => void;
    onDeclineRequest: (user: NearbyUser) => void;
}> = ({ user, onClose, connectionStatus, onSendRequest, onAcceptRequest, onDeclineRequest }) => {
    
    const getActionButtons = () => {
        switch(connectionStatus) {
            case 'none':
                return (
                    <button onClick={() => onSendRequest(user)} className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                        <Send size={18} className="mr-2"/>
                        Envoyer une demande de connexion
                    </button>
                );
            case 'sent_pending':
                 return (
                    <button disabled className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-400 dark:bg-slate-600 text-white rounded-md cursor-not-allowed">
                        <Clock size={18} className="mr-2"/>
                        Demande envoyée
                    </button>
                );
            case 'connected':
                return (
                    <button disabled className="w-full flex items-center justify-center py-2.5 px-4 bg-sky-500 text-white rounded-md cursor-not-allowed">
                       <UserCheck size={18} className="mr-2"/>
                        Connecté(e)
                    </button>
                );
            case 'received_pending':
                return (
                    <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{user.pseudonym} souhaite se connecter avec vous.</p>
                        <div className="flex gap-2">
                             <button onClick={() => onAcceptRequest(user)} className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                                <Check size={18} className="mr-2"/>
                                Accepter
                            </button>
                             <button onClick={() => onDeclineRequest(user)} className="w-full flex items-center justify-center py-2.5 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors">
                                <X size={18} className="mr-2"/>
                                Refuser
                            </button>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                 <div className="p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                    <div className="w-24 h-24 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center mx-auto">
                        <User size={48} className="text-sky-600 dark:text-sky-400"/>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-200">{user.pseudonym}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 italic">"{user.bio}"</p>
                 </div>
                 <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {getActionButtons()}
                 </div>
            </div>
        </div>
    )
}

const NearbyPage: React.FC = () => {
    // For demo purposes, we'll hardcode the current user's ID and pseudonym.
    const currentUserId = 'current_user_id';
    const currentUserPseudonym = 'Vous';

    const [location, setLocation] = useState<Location | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);
    const [connectionRequests, setConnectionRequests] = useLocalStorage<ConnectionRequest[]>('mindcare-connection-requests', []);
    const [activeTab, setActiveTab] = useState<'incoming' | 'sent'>('incoming');


    useEffect(() => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setNearbyUsers(generateNearbyUsers(7)); // Generate 7 other users
                setStatus('success');
            },
            (geoError) => {
                switch (geoError.code) {
                    case geoError.PERMISSION_DENIED:
                        setError("Vous avez refusé l'accès à votre position. Cette fonctionnalité ne peut pas fonctionner sans.");
                        break;
                    case geoError.POSITION_UNAVAILABLE:
                        setError("Votre position n'a pas pu être déterminée.");
                        break;
                    case geoError.TIMEOUT:
                        setError("La demande de géolocalisation a expiré.");
                        break;
                    default:
                        setError("Une erreur est survenue lors de la récupération de votre position.");
                        break;
                }
                setStatus('error');
            }
        );
    }, []);
    
    const getRequestStatusForUser = (otherUser: NearbyUser): ConnectionStatus => {
        const sentRequest = connectionRequests.find(r => r.fromUserId === currentUserId && r.toUserId === otherUser.id);
        const receivedRequest = connectionRequests.find(r => r.fromUserId === otherUser.id && r.toUserId === currentUserId);

        if ((sentRequest?.status === 'accepted') || (receivedRequest?.status === 'accepted')) {
            return 'connected';
        }
        if (sentRequest?.status === 'pending') {
            return 'sent_pending';
        }
        if (receivedRequest?.status === 'pending') {
            return 'received_pending';
        }
        return 'none';
    };
    
    const handleSendRequest = (recipient: NearbyUser) => {
        const newRequest: ConnectionRequest = {
            id: `${currentUserId}-${recipient.id}-${Date.now()}`,
            fromUserId: currentUserId,
            fromUserPseudonym: currentUserPseudonym,
            toUserId: recipient.id,
            toUserPseudonym: recipient.pseudonym,
            status: 'pending'
        };
        setConnectionRequests(prev => [...prev, newRequest]);
        setSelectedUser(null);
    };

    const findRequestId = (user: NearbyUser, direction: 'sent' | 'received'): string | undefined => {
        const from = direction === 'sent' ? currentUserId : user.id;
        const to = direction === 'sent' ? user.id : currentUserId;
        return connectionRequests.find(r => r.fromUserId === from && r.toUserId === to)?.id;
    }

    const handleAcceptRequest = (user: NearbyUser) => {
        const requestId = findRequestId(user, 'received');
        if (!requestId) return;
        setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
        setSelectedUser(null);
    };

    const handleDeclineRequest = (user: NearbyUser) => {
         const requestId = findRequestId(user, 'received');
         if (!requestId) return;
        // You could set status to 'declined' or just remove it. Removing is simpler for this demo.
        setConnectionRequests(prev => prev.filter(r => r.id !== requestId));
        setSelectedUser(null);
    };
    
    const handleUpdateRequestStatus = (requestId: string, status: 'accepted' | 'declined') => {
        setConnectionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    }
    
    const handleCancelRequest = (requestId: string) => {
        setConnectionRequests(prev => prev.filter(r => r.id !== requestId));
    }

    const renderMap = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                        <Loader2 size={48} className="animate-spin text-emerald-500" />
                        <p className="mt-4">Recherche de votre position...</p>
                        <p className="text-sm">Veuillez autoriser l'accès à votre localisation.</p>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 p-6 rounded-lg">
                        <MapPin size={48} />
                        <p className="mt-4 font-semibold">Erreur de localisation</p>
                        <p className="text-sm">{error}</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="w-full aspect-square md:aspect-video max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-lg shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" title="Votre position (approximative)">
                             <span className="relative flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-800"></span>
                            </span>
                        </div>
                        {nearbyUsers.map(user => (
                            <div
                                key={user.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                                style={{ top: user.position.top, left: user.position.left }}
                                onClick={() => setSelectedUser(user)}
                            >
                                <User size={24} className="text-sky-600 dark:text-sky-400 group-hover:scale-125 transition-transform" />
                            </div>
                        ))}
                    </div>
                );
        }
    }
    
    const incomingRequests = connectionRequests.filter(r => r.toUserId === currentUserId && r.status === 'pending');
    const sentRequests = connectionRequests.filter(r => r.fromUserId === currentUserId);


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Personnes à proximité</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Visualisez la communauté MindCare autour de vous.</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/40 border-l-4 border-amber-500 rounded-r-lg" role="alert">
              <div className="flex items-start">
                  <Shield size={24} className="text-amber-700 dark:text-amber-300 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-200">Votre vie privée est notre priorité</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Les emplacements sont approximatifs pour protéger l'anonymat de chacun.
                    </p>
                  </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
                {renderMap()}
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Mes Connexions</h2>
                 <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button onClick={() => setActiveTab('incoming')} className={`px-4 py-2 text-sm font-semibold relative ${activeTab === 'incoming' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                        Demandes Reçues
                        {incomingRequests.length > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800"></span>}
                        {activeTab === 'incoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></div>}
                    </button>
                    <button onClick={() => setActiveTab('sent')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'sent' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                        Demandes Envoyées
                        {activeTab === 'sent' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></div>}
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    {activeTab === 'incoming' && (
                        incomingRequests.length > 0 ? incomingRequests.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                <p className="text-sm"><strong className="font-semibold">{req.fromUserPseudonym}</strong> souhaite se connecter.</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdateRequestStatus(req.id, 'accepted')} className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200">Accepter</button>
                                    <button onClick={() => handleUpdateRequestStatus(req.id, 'declined')} className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 rounded-full hover:bg-rose-200">Refuser</button>
                                </div>
                            </div>
                        )) : <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">Aucune nouvelle demande de connexion.</p>
                    )}
                     {activeTab === 'sent' && (
                        sentRequests.length > 0 ? sentRequests.map(req => (
                             <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                <p className="text-sm">Votre demande à <strong className="font-semibold">{req.toUserPseudonym}</strong></p>
                                {req.status === 'pending' && 
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">En attente</span>
                                        <button onClick={() => handleCancelRequest(req.id)} className="p-1 text-slate-400 hover:text-rose-500"><X size={14}/></button>
                                    </div>
                                }
                                {req.status === 'accepted' && <span className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Acceptée</span>}
                                {req.status === 'declined' && <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Refusée</span>}
                             </div>
                        )) : <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">Vous n'avez envoyé aucune demande.</p>
                    )}
                </div>
            </div>

            {selectedUser && (
                <UserProfileModal 
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    connectionStatus={getRequestStatusForUser(selectedUser)}
                    onSendRequest={handleSendRequest}
                    onAcceptRequest={handleAcceptRequest}
                    onDeclineRequest={handleDeclineRequest}
                />
            )}
        </div>
    );
};

export default NearbyPage;