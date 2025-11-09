import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from "@google/genai";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getAIResponse, ai, systemInstruction } from '../../services/geminiService';
import { Message } from '../../types';

// --- Audio Utility Functions ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  // FIX: The for loop had a syntax error with four parts. It has been corrected to the standard three-part for loop.
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
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
// --- End Audio Utilities ---


const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>('mindcare-chat-history', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'connecting' | 'listening'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Refs for Live API session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef(0);
  
  // Refs for audio visualization
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Cleanup effect to close session and stop any audio on component unmount
  useEffect(() => {
    return () => {
      sessionPromiseRef.current?.then(session => session.close());
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Effect to ensure browser loads speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
       window.speechSynthesis.onvoiceschanged = () => {
          // Voices are loaded, no action needed but this is required for some browsers
       };
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a French voice for better quality
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang === 'fr-FR' || voice.lang === 'fr-CA');
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
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
  
  const stopRecording = useCallback(async () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMicStatus('idle');
    setAudioLevel(0);
    
    if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
    }

    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current;
        session.close();
        sessionPromiseRef.current = null;
    }
    
    analyserRef.current?.disconnect();
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        await inputAudioContextRef.current.close();
    }
     if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        await outputAudioContextRef.current.close();
    }

  }, []);

  const startRecording = async () => {
    setMicStatus('connecting');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTimeRef.current = 0;

        // Setup audio visualizer
        analyserRef.current = inputAudioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        audioDataArrayRef.current = new Uint8Array(bufferLength);
        
        const visualize = () => {
            if (analyserRef.current && audioDataArrayRef.current) {
                analyserRef.current.getByteFrequencyData(audioDataArrayRef.current);
                const sum = audioDataArrayRef.current.reduce((a, b) => a + b, 0);
                const avg = sum / audioDataArrayRef.current.length;
                setAudioLevel(Math.min(1, avg / 128.0)); // Normalize and cap at 1
            }
            animationFrameIdRef.current = requestAnimationFrame(visualize);
        };
        visualize();
        
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setMicStatus('listening');
                    mediaStreamSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);

                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob: GenAIBlob = {
                            data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    // Connect nodes: source -> analyser -> scriptProcessor -> destination
                    mediaStreamSourceRef.current.connect(analyserRef.current);
                    analyserRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                    }
                    if (message.serverContent?.inputTranscription) {
                        currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                    }

                    if (message.serverContent?.turnComplete) {
                        if (currentInputTranscriptionRef.current.trim()) {
                            const userMessage: Message = { id: Date.now().toString(), text: currentInputTranscriptionRef.current.trim(), sender: 'user', timestamp: new Date().toISOString() };
                            setMessages(prev => [...prev, userMessage]);
                        }
                        if (currentOutputTranscriptionRef.current.trim()) {
                            const aiMessage: Message = { id: (Date.now() + 1).toString(), text: currentOutputTranscriptionRef.current.trim(), sender: 'ai', timestamp: new Date().toISOString() };
                            setMessages(prev => [...prev, aiMessage]);
                        }
                        currentInputTranscriptionRef.current = '';
                        currentOutputTranscriptionRef.current = '';
                    }

                    const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (audioData) {
                        const outputCtx = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputCtx.destination);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Live session error:', e);
                    stopRecording();
                },
                onclose: (e: CloseEvent) => {
                    stream.getTracks().forEach(track => track.stop());
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: systemInstruction,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });
    } catch (error) {
        console.error("Failed to start recording:", error);
        setMicStatus('idle');
    }
  };
  
  const handleMicClick = () => {
      // Stop any browser speech synthesis before interacting with the mic
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if(micStatus === 'listening' || micStatus === 'connecting') {
          stopRecording();
      } else {
          startRecording();
      }
  }

  const getMicButtonClass = () => {
    switch(micStatus) {
        case 'connecting':
            return 'bg-amber-500 animate-pulse';
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

      {(micStatus === 'connecting' || micStatus === 'listening') && (
        <div className="flex items-center justify-center p-3 gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {micStatus === 'connecting' ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Connexion...</span>
            </>
          ) : (
            <>
              <div
                className="w-7 h-7 bg-rose-500/30 rounded-full flex items-center justify-center transition-transform duration-100"
                style={{ transform: `scale(${1 + audioLevel * 0.6})` }}
              >
                <div className="w-3 h-3 bg-rose-500 rounded-full" />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Je vous écoute...</span>
            </>
          )}
        </div>
      )}

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={micStatus !== 'idle' ? "Microphone actif..." : "Écrivez votre message..."}
            className="w-full pr-12 pl-4 py-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading || micStatus !== 'idle'}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || micStatus !== 'idle' || input.trim() === ''}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-emerald-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-emerald-700 transition-all transform hover:scale-110"
          >
            <Send size={20} />
          </button>
           <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={`p-2.5 rounded-full text-white transition-colors ${getMicButtonClass()}`}
          >
            {micStatus === 'idle' ? <Mic size={20} /> : <StopCircle size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;