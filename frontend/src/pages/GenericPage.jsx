import React from 'react';

const GenericPage = ({ title }) => (
    <div className="pt-16 bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">This page is under construction. Check back soon!</p>
        </div>
    </div>
);

export default GenericPage;
