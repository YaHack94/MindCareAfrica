import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getAIResponse } from '../../services/geminiService';
import { Message } from '../../types';

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = SpeechRecognition != null;


const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('mindcare-chat-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening'>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any | null>(null); // To hold SpeechRecognition instance

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Cleanup effect to stop recognition and speech on component unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Effect to load speech synthesis voices into state for reliable access
  useEffect(() => {
    if ('speechSynthesis' in window) {
       const loadVoices = () => {
           setVoices(window.speechSynthesis.getVoices());
       };
       window.speechSynthesis.onvoiceschanged = loadVoices;
       loadVoices(); // Also call it directly in case voices are already loaded
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a French voice for better quality, prioritizing fr-FR
      const frenchVoice = voices.find(voice => voice.lang === 'fr-FR') || voices.find(voice => voice.lang === 'fr-CA');
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      // Set language hint for the browser's synthesis engine
      utterance.lang = 'fr-FR';
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Browser does not support the Speech Synthesis API.");
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiText = await getAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      speak(aiText); // Convert AI text response to speech
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
  };
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  }, []);

  const startRecording = () => {
    if (!isSpeechRecognitionSupported) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
        return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'fr-FR';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
        setMicStatus('listening');
    };

    recognitionRef.current.onend = () => {
        setMicStatus('idle');
    };

    recognitionRef.current.onerror = (event: any) => {
        console.error("Erreur de reconnaissance vocale:", event.error);
        setMicStatus('idle');
    };

    recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
        setInput(transcript);
    };

    recognitionRef.current.start();
  };
  
  const handleMicClick = () => {
      // Stop any browser speech synthesis before interacting with the mic
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if(micStatus === 'listening') {
          stopRecording();
      } else {
          startRecording();
      }
  }

  const getMicButtonClass = () => {
    switch(micStatus) {
        case 'listening':
            return 'bg-rose-500 animate-pulse';
        case 'idle':
        default:
            return 'bg-sky-500 hover:bg-sky-600';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-lg shadow-md">
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
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={micStatus === 'listening' ? "Je vous écoute..." : "Écrivez votre message..."}
            className="w-full pr-12 pl-4 py-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-emerald-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-emerald-700 transition-all transform hover:scale-110"
          >
            <Send size={20} />
          </button>
           <button
            onClick={handleMicClick}
            disabled={isLoading || !isSpeechRecognitionSupported}
            className={`p-2.5 rounded-full text-white transition-colors ${getMicButtonClass()} disabled:bg-slate-400`}
            aria-label={micStatus === 'listening' ? 'Arrêter l\'enregistrement' : 'Commencer l\'enregistrement vocal'}
          >
            {micStatus === 'listening' ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;