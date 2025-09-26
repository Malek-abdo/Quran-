
import React, { useRef, useEffect, useState } from 'react';
import { Ayah, Reciter } from '../types';

interface AudioPlayerProps {
    ayah: Ayah | null;
    reciters: Reciter[];
    selectedReciter: Reciter;
    onReciterChange: (reciter: Reciter) => void;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
    onEnded: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);
const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);
const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);
const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
    </svg>
);


const AudioPlayer: React.FC<AudioPlayerProps> = ({ ayah, reciters, selectedReciter, onReciterChange, isPlaying, setIsPlaying, onNext, onPrev, onEnded }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current && ayah) {
            audioRef.current.src = ayah.audio;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [ayah, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };
    
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(e.target.value) / 100) * duration;
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-[0_-2px_5px_rgba(0,0,0,0.1)] p-4 z-30">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={onEnded}
                onLoadedMetadata={handleLoadedMetadata}
                preload="auto"
            />
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/3">
                    <select
                        value={selectedReciter.identifier}
                        onChange={(e) => {
                            const newReciter = reciters.find(r => r.identifier === e.target.value);
                            if (newReciter) onReciterChange(newReciter);
                        }}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-green-500 focus:border-green-500"
                    >
                        {reciters.map(reciter => (
                            <option key={reciter.identifier} value={reciter.identifier}>{reciter.name}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-auto flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                         <button onClick={onPrev} className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            <PrevIcon />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110">
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <button onClick={onNext} className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            <NextIcon />
                        </button>
                    </div>
                     <div className="w-64 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTime(audioRef.current?.currentTime ?? 0)}</span>
                        <input
                           type="range"
                           value={progress}
                           onChange={handleProgressChange}
                           className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
                
                <div className="w-full sm:w-1/3 text-center sm:text-left">
                     <p className="text-sm font-semibold truncate">آية رقم: {ayah?.numberInSurah ?? '-'}</p>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
