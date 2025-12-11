import React from 'react';
import Card from './Card';

const FeatureCard = ({ icon, title, description }) => (
    <Card className="flex flex-col items-start h-full p-8 border-transparent bg-white/60 dark:bg-gray-800/60 hover:border-blue-500/30 transition-all duration-300">
        <div className="text-blue-500 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </Card>
);

export default FeatureCard;
