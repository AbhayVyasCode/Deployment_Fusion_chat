import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, Mic, ArrowRight } from 'lucide-react';
import FeatureCard from '../components/ui/FeatureCard';
import Button from '../components/ui/Button';

const HomePage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden pt-16 bg-gray-50 dark:bg-gray-900">
             {/* Background Layers - Absolute z-0 */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0 opacity-80" />
             <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700/30 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0" />
             
             {/* Animated Blobs - Refined for Visibility & Aesthetics */}
             <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -60, 0],
                    x: [0, -80, 0],
                    y: [0, 100, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-40 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 45, 0],
                    x: [0, 50, 0],
                    y: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 left-1/3 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />

            {/* Content Layer - Relative z-10 */}
            <div className="relative z-10">
                <header className="py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 drop-shadow-sm">
                                Social Connection & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                    AI Intelligence
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                        >
                            Seamlessly switch between chatting with friends and interacting with a powerful AI assistant. One unified platform for the future of conversation.
                        </motion.p>

                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-10 flex justify-center gap-4"
                        >
                            <Link to="/auth">
                                <Button size="lg" className="group shadow-lg shadow-blue-500/20">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="ghost" size="lg" className="hover:bg-white/50 dark:hover:bg-gray-800/50">Learn more</Button>
                            </Link>
                        </motion.div>
                    </div>
                </header>

                {/* Features Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
                            >
                                Why FusionChat?
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mt-4 text-xl text-gray-600 dark:text-gray-300"
                            >
                                Everything you need for modern communication.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                <FeatureCard 
                                    icon={<MessageCircle className="w-8 h-8" />} 
                                    title="Chat with Friends" 
                                    description="Real-time, private, and group messaging. Share images, links, and connect instantly with your circle." 
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <FeatureCard 
                                    icon={<Bot className="w-8 h-8" />} 
                                    title="Intelligent AI" 
                                    description="Your personal assistant. Get answers, generate creative content, and streamline your daily tasks." 
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <FeatureCard 
                                    icon={<Mic className="w-8 h-8" />} 
                                    title="Voice Interaction" 
                                    description="Speak naturally to your AI. Experience hands-free communication with advanced voice-to-text capabilities." 
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
