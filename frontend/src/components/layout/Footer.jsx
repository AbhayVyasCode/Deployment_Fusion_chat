import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => (
    <footer className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">FusionChat</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>

                <div className="flex items-center space-x-6">
                    <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <span className="sr-only">GitHub</span>
                        <Github className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <span className="sr-only">LinkedIn</span>
                        <Linkedin className="h-5 w-5" />
                    </a>
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                    Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> By Abhay Vyas
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
