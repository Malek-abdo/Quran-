
import { Surah, Ayah, Reciter } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

// A curated list of high-quality, verse-by-verse reciters
const PREFERRED_RECITERS = [
    'ar.alafasy',
    'ar.abdulbasitmurattal',
    'ar.abdullahbasfar',
    'ar.ahmedajamy',
    'ar.hudhaify',
    'ar.mahermuaiqly',
    'ar.minshawi',
    'ar.saoodshuraym',
    'ar.sudais'
];

export const getSurahs = async (): Promise<Surah[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/surah`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch surahs:", error);
        throw error;
    }
};

export const getReciters = async (): Promise<Reciter[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/edition?format=audio&language=ar&type=versebyverse`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Filter to only include the preferred, high-quality reciters
        return data.data.filter((reciter: Reciter) => PREFERRED_RECITERS.includes(reciter.identifier));
    } catch (error) {
        console.error("Failed to fetch reciters:", error);
        throw error;
    }
}

export const getSurahWithAudio = async (surahNumber: number, audioIdentifier: string): Promise<{ textAyahs: Ayah[], audioAyahs: Ayah[] }> => {
    try {
        const textIdentifier = 'quran-uthmani';
        const [textResponse, audioResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/surah/${surahNumber}`),
            fetch(`${API_BASE_URL}/surah/${surahNumber}/${audioIdentifier}`)
        ]);

        if (!textResponse.ok || !audioResponse.ok) {
            throw new Error('Network response was not ok for one or more surah requests');
        }

        const textData = await textResponse.json();
        const audioData = await audioResponse.json();

        return {
            textAyahs: textData.data.ayahs,
            audioAyahs: audioData.data.ayahs,
        };
    } catch (error) {
        console.error(`Failed to fetch surah ${surahNumber} with audio ${audioIdentifier}:`, error);
        throw error;
    }
};
