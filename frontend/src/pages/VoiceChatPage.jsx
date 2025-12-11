import React, { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaCog } from 'react-icons/fa';
import { Mic, Settings, StopCircle } from 'lucide-react'; 
import toast from 'react-hot-toast';
import useAssistantStore from '../store/useAssistantStore';
import useAuthStore from '../store/useAuthStore';
import Modal from '../components/ui/Modal';
import AssistantSettingsForm from '../components/forms/AssistantSettingsForm';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import Card from '../components/ui/Card';

const VoiceChatPage = () => {
    const { messages, addMessage, setMessages } = useAssistantStore();
    const { authUser } = useAuthStore();
    const { transcript, listening, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isReplying, setIsReplying] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const chatEndRef = useRef(null);
    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        setMessages([]);
    }, [setMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isReplying]);
    
    const handleAction = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const askAI = async (command) => {
        if (!command) return;
        setIsReplying(true);
        addMessage({ role: 'user', text: command });

        try {
            const res = await fetch('/api/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'API Error');

            addMessage({ role: 'assistant', text: data.response, url: data.url });
            speak(data.response); 
            handleAction(data.url);
        } catch (error) {
            const errorMessage = "I'm sorry, I encountered an error.";
            addMessage({ role: 'assistant', text: errorMessage });
            speak(errorMessage);
            toast.error("AI response failed");
        } finally {
            setIsReplying(false);
        }
    };

    useEffect(() => {
        if (finalTranscript) {
            askAI(finalTranscript);
            resetTranscript();
        }
    }, [finalTranscript, resetTranscript]);

    if (!browserSupportsSpeechRecognition) {
        return <div className="text-center text-red-500 mt-10">Browser doesn't support speech recognition.</div>;
    }

    return (
        <>
            <div className="h-[calc(100vh-120px)] flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                        Voice Chat with {authUser?.assistantName || 'AI'}
                    </h2>
                    <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-blue-500">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 && (
                             <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center text-gray-400 flex flex-col items-center justify-center h-full space-y-4"
                             >
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center p-1 animate-pulse">
                                    <img src={authUser?.assistantImage || `https://ui-avatars.com/api/?name=${authUser.assistantName || 'AI'}&background=random`} alt="Assistant" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Hello, {authUser?.fullName}!</p>
                                    <p className="text-gray-500 dark:text-gray-400">Tap the microphone to start speaking.</p>
                                </div>
                            </motion.div>
                        )}
                        {messages.map((msg, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <img src={authUser?.assistantImage || `https://ui-avatars.com/api/?name=${authUser.assistantName || 'AI'}&background=random`} alt="AI" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700" />
                                )}
                                <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm text-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
                                }`}>
                                   {msg.url ? (
                                        <a href={msg.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 font-medium">
                                            {msg.text} (Click to open)
                                        </a>
                                   ) : (
                                        msg.text
                                   )}
                                </div>
                                {msg.role === 'user' && (
                                    <img src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.fullName}&background=random`} alt="User" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700" />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                     <div ref={chatEndRef} />
                </div>
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
                    <div className="text-center min-h-[40px] mb-4">
                        <AnimatePresence mode="wait">
                            {listening ? (
                                <motion.p 
                                    key="listening"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-blue-500 font-medium animate-pulse"
                                >
                                    {transcript || "Listening..."}
                                </motion.p>
                            ) : (
                                <motion.p 
                                    key="idle"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="text-gray-500 dark:text-gray-400 font-medium"
                                >
                                    Click the microphone to speak
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-center">
                        <button 
                            onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening()} 
                            disabled={isReplying} 
                            className={`p-6 rounded-full shadow-lg transition-all ${
                                listening 
                                    ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 scale-110' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50 hover:scale-105'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {listening ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Customize Your Assistant">
                <AssistantSettingsForm onSuccess={() => setIsSettingsModalOpen(false)} />
            </Modal>
        </>
    );
};

export default VoiceChatPage;