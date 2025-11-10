import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, StopCircle, Loader2, MessageSquare } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getAIResponse, getAIAudioResponse, transcribeAudio } from '../../services/geminiService';
import { Message } from '../../types';

// Audio decoding helpers for Gemini TTS
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

const availableVoices = [
  { id: 'Kore', name: 'Voix Calme (Féminine)' },
  { id: 'Zephyr', name: 'Voix Douce (Féminine)' },
  { id: 'Puck', name: 'Voix Amicale (Masculine)' },
  { id: 'Charon', name: 'Voix Grave (Masculine)' },
  { id: 'Fenrir', name: 'Voix Profonde (Masculine)' },
];


const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('mindcare-chat-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'processing'>('idle');
  const [selectedVoice, setSelectedVoice] = useLocalStorage<string>('mindcare-chat-voice', 'Kore');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);
  
  useEffect(() => {
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      outputAudioContextRef.current?.close();
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!outputAudioContextRef.current || !text) return;

    const base64Audio = await getAIAudioResponse(text, selectedVoice);
    if (base64Audio) {
      try {
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(
          audioData,
          outputAudioContextRef.current,
          24000,
          1
        );
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContextRef.current.destination);
        source.start();
      } catch (error) {
        console.error("Failed to decode or play AI audio:", error);
      }
    }
  }, [selectedVoice]);

  const handleSend = useCallback(async (text: string) => {
    const textToSend = text.trim();
    if (textToSend === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const conversationHistory = updatedMessages.slice(-6);

    try {
      const aiText = await getAIResponse(conversationHistory);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      await speak(aiText);
    } catch (error) {
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur est survenue avec le chat textuel. Veuillez réessayer.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, setMessages, speak]);

  const handleTextInputSend = () => handleSend(input);
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("L'enregistrement audio n'est pas supporté par votre navigateur.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const options = { mimeType: 'audio/webm;codecs=opus' };
        const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        recorder.onstop = async () => {
            setMicStatus('processing');
            setInput("Transcription en cours...");

            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            
            if (audioBlob.size === 0) {
                setInput(''); setMicStatus('idle'); return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(',')[1];
                try {
                    const transcribedText = await transcribeAudio(base64Audio, mimeType);
                    if (transcribedText && !transcribedText.includes("Désolé, je n'ai pas pu comprendre")) {
                        handleSend(transcribedText);
                    } else {
                        setInput('');
                        alert("Je n'ai pas réussi à transcrire l'audio. Veuillez réessayer.");
                    }
                } catch (error) {
                    console.error("Transcription failed:", error);
                    alert("Une erreur est survenue lors de la transcription.");
                    setInput('');
                } finally {
                    setMicStatus('idle');
                }
            };
            reader.onerror = () => {
                 alert("Erreur lors de la lecture du fichier audio.");
                 setInput(''); setMicStatus('idle');
            }
        };

        recorder.start();
        setMicStatus('listening');
        setInput("Enregistrement en cours...");
    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Impossible d'accéder au microphone. Veuillez vérifier les autorisations de votre navigateur.");
        setMicStatus('idle');
    }
  };
  
  const handleMicClick = () => {
      if (outputAudioContextRef.current?.state === 'running') {
        outputAudioContextRef.current.suspend();
      }
      
      if (micStatus === 'listening') {
          stopRecording();
      } else if (micStatus === 'idle') {
          startRecording();
      }
  }

  const getMicButtonClass = () => {
    switch(micStatus) {
        case 'listening': return 'bg-rose-500 animate-pulse';
        case 'processing': return 'bg-slate-400';
        case 'idle': default: return 'bg-sky-500 hover:bg-sky-600';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-lg shadow-md">
       <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center">
            <MessageSquare size={20} className="text-emerald-600 dark:text-emerald-400 mr-3" />
            <h2 className="font-semibold text-lg">Conversation avec Mindy</h2>
        </div>
        <div>
            <label htmlFor="voice-select" className="sr-only">Choisir une voix</label>
            <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm p-1.5 focus:ring-emerald-500 focus:border-emerald-500"
            >
                {availableVoices.map(voice => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
            </select>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold self-start">M</div>}
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold self-start">M</div>
              <div className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                 <div className="flex items-center justify-center space-x-1.5 h-5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextInputSend()}
            placeholder={
                micStatus === 'listening' ? "Enregistrement en cours..." :
                micStatus === 'processing' ? "Transcription en cours..." :
                "Écrivez votre message..."
            }
            className="w-full pr-12 pl-4 py-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading || micStatus !== 'idle'}
          />
          <button
            onClick={handleTextInputSend}
            disabled={isLoading || input.trim() === '' || micStatus !== 'idle'}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-emerald-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-emerald-700 transition-all transform hover:scale-110"
          >
            <Send size={20} />
          </button>
           <button
            onClick={handleMicClick}
            disabled={isLoading || micStatus === 'processing'}
            className={`p-2.5 rounded-full text-white transition-colors ${getMicButtonClass()} disabled:bg-slate-400`}
            aria-label={micStatus === 'listening' ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement vocal'}
          >
            {micStatus === 'processing' ? <Loader2 size={20} className="animate-spin" /> : 
             micStatus === 'listening' ? <StopCircle size={20} /> : 
             <Mic size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;