
import React, { useState, useEffect, useCallback } from 'react';
import { Surah, Ayah, Reciter } from './types';
import { getSurahs, getSurahWithAudio, getReciters } from './services/quranService';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import AudioPlayer from './components/AudioPlayer';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [reciters, setReciters] = useState<Reciter[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
    const [surahData, setSurahData] = useState<{ textAyahs: Ayah[], audioAyahs: Ayah[] } | null>(null);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSurahLoading, setIsSurahLoading] = useState(false);

    useEffect(() => {
        const initialFetch = async () => {
            try {
                setIsLoading(true);
                const [fetchedSurahs, fetchedReciters] = await Promise.all([getSurahs(), getReciters()]);
                setSurahs(fetchedSurahs);
                setReciters(fetchedReciters);
                if (fetchedReciters.length > 0) {
                    const defaultReciter = fetchedReciters.find(r => r.identifier === 'ar.alafasy') || fetchedReciters[0];
                    setSelectedReciter(defaultReciter);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initialFetch();
    }, []);

    const handleSelectSurah = useCallback(async (surah: Surah) => {
        if (!selectedReciter) return;
        setIsSurahLoading(true);
        setSelectedSurah(surah);
        try {
            const data = await getSurahWithAudio(surah.number, selectedReciter.identifier);
            setSurahData(data);
            setCurrentAyahIndex(0);
            setIsPlaying(false);
        } catch (error) {
            console.error(`Failed to fetch surah ${surah.number}:`, error);
        } finally {
            setIsSurahLoading(false);
        }
    }, [selectedReciter]);

    const handleReciterChange = useCallback(async (reciter: Reciter) => {
        setSelectedReciter(reciter);
        if (selectedSurah) {
            setIsSurahLoading(true);
            try {
                const data = await getSurahWithAudio(selectedSurah.number, reciter.identifier);
                setSurahData(data);
                // Keep current ayah if possible, reset if not
                setCurrentAyahIndex(prev => Math.min(prev, data.audioAyahs.length - 1));
                setIsPlaying(false);
            } catch (error) {
                console.error(`Failed to fetch surah ${selectedSurah.number} with new reciter:`, error);
            } finally {
                setIsSurahLoading(false);
            }
        }
    }, [selectedSurah]);


    const handleBack = () => {
        setSelectedSurah(null);
        setSurahData(null);
        setIsPlaying(false);
    };
    
    const playNextAyah = useCallback(() => {
        if (surahData && currentAyahIndex < surahData.audioAyahs.length - 1) {
            setCurrentAyahIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    }, [currentAyahIndex, surahData]);

    const playPrevAyah = () => {
        if (currentAyahIndex > 0) {
            setCurrentAyahIndex(prev => prev - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <LoadingSpinner />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 pb-28">
            <Header onBack={selectedSurah ? handleBack : undefined} title={selectedSurah ? selectedSurah.name : 'القرآن الكريم'} />
            <main className="container mx-auto p-4">
                {isSurahLoading ? (
                    <div className="flex items-center justify-center pt-20">
                       <LoadingSpinner />
                    </div>
                ) : !selectedSurah ? (
                    <SurahList surahs={surahs} onSelectSurah={handleSelectSurah} />
                ) : surahData ? (
                    <SurahDetail
                        surah={selectedSurah}
                        ayahs={surahData.textAyahs}
                        onAyahSelect={setCurrentAyahIndex}
                        currentAyahNumber={surahData.audioAyahs[currentAyahIndex]?.numberInSurah}
                    />
                ) : null}
            </main>
            {surahData && selectedReciter && (
                <AudioPlayer
                    ayah={surahData.audioAyahs[currentAyahIndex]}
                    reciters={reciters}
                    selectedReciter={selectedReciter}
                    onReciterChange={handleReciterChange}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    onNext={playNextAyah}
                    onPrev={playPrevAyah}
                    onEnded={playNextAyah}
                />
            )}
        </div>
    );
};

export default App;
