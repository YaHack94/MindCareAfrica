
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ai } from '../../services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { Mic, StopCircle, Loader2, Volume2, WifiOff } from 'lucide-react';

// Audio Encoding & Decoding functions (must be implemented manually)
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const LiveChatPage: React.FC = () => {
    type Status = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';
    const [status, setStatus] = useState<Status>('idle');
    const [transcripts, setTranscripts] = useState<{user: string, ai: string}[]>([]);
    const [currentInterim, setCurrentInterim] = useState({ user: '', ai: '' });
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    
    // Cleanup function
    const cleanup = useCallback(() => {
        console.log("Cleaning up resources...");
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        inputAudioContextRef.current?.close().catch(console.error);
        inputAudioContextRef.current = null;
        
        outputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current = null;
    }, []);

    // Effect for unmounting
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const startConversation = async () => {
        setStatus('connecting');
        setTranscripts([]);
        setCurrentInterim({ user: '', ai: '' });

        try {
            // Initialize audio contexts
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setStatus('listening');
                        
                        // Start streaming microphone audio
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInterim(prev => ({ ...prev, user: message.serverContent!.inputTranscription!.text }));
                        }
                        if (message.serverContent?.outputTranscription) {
                            setStatus('speaking');
                            setCurrentInterim(prev => ({ ...prev, ai: message.serverContent!.outputTranscription!.text }));
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscripts(prev => [...prev, {user: currentInterim.user, ai: currentInterim.ai}]);
                            setCurrentInterim({ user: '', ai: '' });
                            setStatus('listening');
                        }

                        // Handle audio playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                                if (audioSourcesRef.current.size === 0) {
                                    setStatus('listening');
                                }
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            audioSourcesRef.current.forEach(source => source.stop());
                            audioSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('error');
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        if (status !== 'error') setStatus('idle');
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: 'You are Mindy, an empathetic AI from MindCare Africa. Speak calmly and warmly in French. Keep your responses conversational and not too long.',
                },
            });

            await sessionPromiseRef.current;

        } catch (err) {
            console.error("Failed to start conversation:", err);
            setStatus('error');
            cleanup();
        }
    };

    // FIX: The 'action' variable was inferred to expect a function returning a Promise,
    // but `stopConversation` returned void. Making `stopConversation` async resolves this type mismatch.
    const stopConversation = async () => {
        console.log("Stopping conversation...");
        sessionPromiseRef.current?.then(session => session.close());
        setStatus('idle');
    };

    const MicButton = () => {
        let Icon = Mic;
        let label = "Démarrer la conversation";
        let action = startConversation;
        let ringClass = '';

        if (status === 'connecting') {
            Icon = Loader2;
            label = "Connexion...";
        } else if (status === 'listening' || status === 'speaking') {
            Icon = StopCircle;
            label = "Arrêter la conversation";
            action = stopConversation;
            if (status === 'speaking') {
                 ringClass = 'ring-sky-400';
            } else {
                 ringClass = 'ring-emerald-500';
            }
        } else if (status === 'error') {
            Icon = WifiOff;
            label = "Erreur. Réessayer ?";
            action = startConversation;
        }

        return (
            <button
                onClick={action}
                disabled={status === 'connecting'}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-colors text-white
                    ${status === 'error' ? 'bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-700'}
                    disabled:bg-slate-400`}
                aria-label={label}
            >
                <Icon size={40} className={status === 'connecting' ? 'animate-spin' : ''} />
                 { (status === 'listening' || status === 'speaking') &&
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75 ${ringClass.replace('ring-', 'bg-')}`}></span>
                 }
            </button>
        )
    }
    
    const getStatusText = () => {
        switch(status) {
            case 'idle': return "Appuyez pour démarrer une conversation vocale avec Mindy.";
            case 'connecting': return "Connexion au service de conversation en direct...";
            case 'listening': return "Je vous écoute...";
            case 'speaking': return "Mindy parle...";
            case 'error': return "La connexion a échoué. Veuillez vérifier votre connexion et réessayer.";
            default: return "";
        }
    }

    return (
        <div className="flex flex-col h-full items-center justify-between p-4">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-2xl font-bold">Conversation en direct</h1>
                <p className="text-slate-600 dark:text-slate-400">{getStatusText()}</p>
            </div>
            
             <div className="flex-grow w-full max-w-2xl overflow-y-auto my-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-4">
                {transcripts.map((t, i) => (
                    <div key={i}>
                        <p><strong>Vous:</strong> {t.user}</p>
                        <p className="text-emerald-700 dark:text-emerald-300"><strong>Mindy:</strong> {t.ai}</p>
                    </div>
                ))}
                {(status === 'listening' || status === 'speaking') && (
                    <div>
                        <p><strong>Vous:</strong> <span className="text-slate-500">{currentInterim.user}</span></p>
                        <p className="text-emerald-700 dark:text-emerald-300"><strong>Mindy:</strong> <span className="text-emerald-500/80">{currentInterim.ai}</span></p>
                    </div>
                )}
             </div>

            <div className="flex flex-col items-center justify-center">
                <MicButton />
            </div>
        </div>
    );
};

export default LiveChatPage;
