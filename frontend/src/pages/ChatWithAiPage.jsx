import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import useAssistantStore from '../store/useAssistantStore';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const TypingIndicator = () => (
  <div className="flex space-x-1.5 p-3 bg-white/50 dark:bg-gray-800/50 rounded-2xl rounded-bl-none w-fit border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
  </div>
);

const ChatWithAiPage = () => {
    const { messages, addMessage, setMessages } = useAssistantStore();
    const { authUser } = useAuthStore();
    const [inputValue, setInputValue] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const chatEndRef = useRef(null);
    
    // ... (keep existing useEffects and handlers same as before) ...

    // Clear message history when the page loads
    useEffect(() => {
        setMessages([]);
    }, [setMessages]);

    // Automatically scroll to the bottom of the chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isReplying]);

    const handleAction = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const askAI = async (command) => {
        if (!command.trim()) return;
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
            handleAction(data.url);

        } catch (error) {
            const errorMessage = "I'm sorry, I encountered an error. Please try again.";
            addMessage({ role: 'assistant', text: errorMessage });
        } finally {
            setIsReplying(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        askAI(inputValue);
        setInputValue('');
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-16 md:pt-20 pb-4 md:pb-12 bg-gray-50 dark:bg-gray-900 font-sans">
             {/* Background Layers */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0 opacity-80" />
             <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700/30 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0" />
             
             {/* Animated Blobs */}
             <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-blue-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />
            <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0], x: [0, -30, 0], y: [0, 50, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-40 right-10 w-64 h-64 md:w-96 md:h-96 bg-purple-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />

            {/* Main Chat Interface */}
            <div className="relative z-10 container mx-auto px-2 md:px-4 h-[calc(100dvh-80px)] md:h-[calc(100vh-140px)]">
                <div className="h-full flex flex-col bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-3 md:p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-10 shadow-sm relative shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                                <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {authUser?.assistantName || 'AI Assistant'}
                                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                                </h2>
                                <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-medium">Always here to help</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar scroll-smooth">
                        <AnimatePresence mode="popLayout">
                            {messages.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 opacity-90"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                                        {/* Adjusted Image Container to prevent cropping */}
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-xl border-4 border-white dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={authUser?.assistantImage || `https://ui-avatars.com/api/?name=${authUser.assistantName || 'AI'}&background=random`} 
                                                alt="Assistant" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                    </div>
                                    <div className="px-4">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Hello, {authUser?.fullName?.split(' ')[0]}!
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                                            I'm ready to assist you. Try asking me something!
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm px-4">
                                        {['Tell me a joke', 'Write a poem', 'Weather update', 'Study tips'].map((suggestion) => (
                                            <button 
                                                key={suggestion}
                                                onClick={() => setInputValue(suggestion)}
                                                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs md:text-sm text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {messages.map((msg, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-end gap-2 md:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="shrink-0">
                                            <img 
                                                src={authUser?.assistantImage || `https://ui-avatars.com/api/?name=${authUser.assistantName || 'AI'}&background=random`} 
                                                alt="AI" 
                                                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-white dark:border-gray-700 shadow-sm" 
                                            />
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 md:px-6 md:py-4 rounded-2xl shadow-sm text-sm md:text-[15px] leading-relaxed relative group ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none' 
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700/50'
                                    }`}>
                                       {msg.url ? (
                                            <a href={msg.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-2 hover:text-blue-200 font-medium transition-colors break-words">
                                                <Sparkles className="w-4 h-4 shrink-0" />
                                                <span>{msg.text}</span>
                                            </a>
                                       ) : (
                                            <div className="markdown-content whitespace-pre-wrap">{msg.text}</div>
                                       )}
                                    </div>
                                    
                                    {msg.role === 'user' && (
                                        <div className="shrink-0">
                                            <img 
                                                src={authUser.profilePic || `https://ui-avatars.com/api/?name=${authUser.fullName}&background=random`} 
                                                alt="User" 
                                                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-white dark:border-gray-700 shadow-sm" 
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            
                            {isReplying && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-end gap-3 justify-start"
                                >
                                    <img 
                                        src={authUser?.assistantImage || `https://ui-avatars.com/api/?name=${authUser.assistantName || 'AI'}&background=random`} 
                                        alt="AI" 
                                        className="w-8 h-8 rounded-full object-cover border border-white dark:border-gray-700" 
                                    />
                                    <TypingIndicator />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="p-3 md:p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-t border-gray-100 dark:border-gray-700/50 shrink-0">
                        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
                            <Input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Message..."
                                disabled={isReplying}
                                className="w-full pr-12 pl-5 py-3 md:py-4 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all text-sm md:text-base placeholder:text-gray-400"
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                                <Button
                                    type="submit"
                                    disabled={isReplying || !inputValue.trim()}
                                    className="rounded-full h-8 w-8 md:h-10 md:w-10 p-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transform transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWithAiPage;