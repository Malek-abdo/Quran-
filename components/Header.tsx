
import React from 'react';

interface HeaderProps {
    title: string;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                 {onBack && (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
                <h1 className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 flex-grow text-center">{title}</h1>
                 {onBack && <div className="w-10"></div>}
            </div>
        </header>
    );
};

export default Header;
