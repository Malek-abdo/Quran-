
import React from 'react';
import { Surah, Ayah } from '../types';

interface SurahDetailProps {
    surah: Surah;
    ayahs: Ayah[];
    onAyahSelect: (index: number) => void;
    currentAyahNumber: number;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surah, ayahs, onAyahSelect, currentAyahNumber }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            <div className="text-center mb-8 border-b-2 border-green-200 dark:border-green-700 pb-4">
                 <h2 className="font-amiri text-3xl font-bold text-green-800 dark:text-green-300 mb-2">{surah.name}</h2>
                 {surah.number !== 1 && surah.number !== 9 && (
                    <p className="font-amiri text-2xl text-gray-700 dark:text-gray-300">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                 )}
            </div>
            <div className="space-y-6">
                {ayahs.map((ayah, index) => (
                    <div
                        key={ayah.number}
                        onClick={() => onAyahSelect(index)}
                        className={`p-4 rounded-md cursor-pointer transition-colors duration-300 ${
                            ayah.numberInSurah === currentAyahNumber
                                ? 'bg-green-100 dark:bg-green-900/50'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        <p className="font-amiri text-2xl md:text-3xl leading-loose text-right text-gray-800 dark:text-gray-100">
                           {ayah.text} <span className="text-green-600 dark:text-green-400 font-sans text-xl">({ayah.numberInSurah})</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SurahDetail;
