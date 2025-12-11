import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Shield, Heart, Code, Globe } from 'lucide-react';

const AboutUsPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-20 pb-12 bg-gray-50 dark:bg-gray-900 leading-relaxed">
             {/* Background Layers */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0 opacity-80" />
             <div className="absolute inset-0 bg-grid-gray-200 dark:bg-grid-gray-700/30 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0" />
             
             {/* Animated Blobs */}
             <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />
            <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0], x: [0, -30, 0], y: [0, 50, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute top-40 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl z-0 pointer-events-none"
            />

            {/* Content Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div 
                    initial="initial"
                    animate="animate"
                    variants={fadeIn}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Connection</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                        Bridging the gap between human friendship and artificial intelligence. 
                        We believe the future of communication is hybrid, seamless, and intelligent.
                    </p>
                </motion.div>

                {/* Main Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                     <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-message p-8 rounded-2xl shadow-xl"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <Zap className="w-8 h-8 text-blue-500" />
                            Our Story
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <p>
                                FusionChat began with a simple observation: our digital lives are fragmented. We have apps for chatting with friends, apps for work, and separate tools for AI assistance.
                            </p>
                            <p>
                                We asked ourselves: <strong>Why not have it all in one place?</strong>
                            </p>
                            <p>
                                What if you could switch from sharing a joke with a best friend to asking a powerful AI to help you rewrite a resume, all within milliseconds? That vision is what drives us every day.
                            </p>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm shadow-lg text-center">
                            <Users className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Community</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Connecting people globally</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm shadow-lg text-center mt-8">
                            <Shield className="w-10 h-10 text-green-500 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Privacy</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Secure & Private</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm shadow-lg text-center -mt-8">
                            <Code className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Innovation</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Cutting-edge Tech</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm shadow-lg text-center">
                            <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Passion</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Built with Love</p>
                        </div>
                    </motion.div>
                </div>

                {/* Values Section */}
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "User First",
                                description: "Every feature we build starts with the question: 'Does this improve the user's life?'",
                                icon: <Heart className="w-6 h-6 text-pink-500" />
                            },
                            {
                                title: "Seamless AI",
                                description: "AI shouldn't be intrusive. It should be a helpful companion that's there when you need it.",
                                icon: <Zap className="w-6 h-6 text-yellow-500" />
                            },
                            {
                                title: "Global Reach",
                                description: "Breaking down language barriers with instant translation and voice capabilities.",
                                icon: <Globe className="w-6 h-6 text-blue-500" />
                            }
                        ].map((value, index) => (
                            <motion.div 
                                key={index}
                                variants={fadeIn}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-fit mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUsPage;
