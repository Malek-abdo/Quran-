
import React from 'react';
import { Surah } from '../types';

interface SurahListProps {
    surahs: Surah[];
    onSelectSurah: (surah: Surah) => void;
}

const SurahCard: React.FC<{ surah: Surah; onSelect: () => void }> = ({ surah, onSelect }) => (
    <div
        onClick={onSelect}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-4 flex items-center justify-between"
    >
        <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full h-10 w-10 flex items-center justify-center font-bold">
                {surah.number}
            </div>
            <div className="mr-4">
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{surah.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishName}</p>
            </div>
        </div>
        <div className="text-left">
            <p className="text-sm text-gray-600 dark:text-gray-300">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{surah.numberOfAyahs} آيات</p>
        </div>
    </div>
);


const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surahs.map(surah => (
                <SurahCard key={surah.number} surah={surah} onSelect={() => onSelectSurah(surah)} />
            ))}
        </div>
    );
};

export default SurahList;
