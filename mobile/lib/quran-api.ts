import type { Verse, TafsirData } from '../types';

const BASE = 'https://api.quran.com/api/v4';
const TRANSLATION_ID = 131; // Saheeh International
const TAFSIR_ID = 169;      // Ibn Kathir English

// EveryAyah CDN for audio — reliable, no API key needed
const RECITER_SLUGS: Record<string, string> = {
  afasy: 'Alafasy_64kbps',
  dosari: 'Yasser_Ad-Dussary_128kbps',
  rifai: 'Hani_Rifai_192kbps',
  abdulbaset: 'Abdul_Basit_Mujawwad_128kbps',
  minshawi: 'Minshawy_Murattal_128kbps',
};

export function getAudioUrl(surah: number, ayah: number, reciter = 'afasy'): string {
  const slug = RECITER_SLUGS[reciter] ?? RECITER_SLUGS.afasy;
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return `https://everyayah.com/data/${slug}/${s}${a}.mp3`;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Quran API error: ${res.status}`);
  return res.json() as Promise<T>;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export async function searchVerses(query: string): Promise<Verse[]> {
  const data = await get<any>(`/search?q=${encodeURIComponent(query)}&size=8&page=1`);
  const results = data?.search?.results ?? [];
  return results.map((r: any) => ({
    verse_key: r.verse_key,
    surah_number: r.chapter_id,
    ayah_number: r.verse_number,
    text_arabic: r.text_uthmani ?? '',
    translation: stripHtml(r.translations?.[0]?.text ?? ''),
    surah_name: r.surah_name ?? `Surah ${r.chapter_id}`,
  }));
}

export async function getVerse(surah: number, ayah: number): Promise<Verse> {
  const key = `${surah}:${ayah}`;
  const data = await get<any>(
    `/verses/by_key/${key}?words=true&translations=${TRANSLATION_ID}&tafsirs=${TAFSIR_ID}`
  );
  const v = data?.verse;
  return {
    verse_key: key,
    surah_number: surah,
    ayah_number: ayah,
    text_arabic: v?.text_uthmani ?? '',
    translation: stripHtml(v?.translations?.[0]?.text ?? ''),
    surah_name: `Surah ${surah}`,
  };
}

export async function getTafsir(surah: number, ayah: number): Promise<TafsirData | null> {
  try {
    const key = `${surah}:${ayah}`;
    const data = await get<any>(`/tafsirs/${TAFSIR_ID}/by_ayah/${key}`);
    const raw = data?.tafsir?.text ?? '';
    return { verse_key: key, text: stripHtml(raw).slice(0, 1200) };
  } catch {
    return null;
  }
}

export async function getSurahName(surah: number): Promise<string> {
  try {
    const data = await get<any>(`/chapters/${surah}?language=en`);
    return data?.chapter?.name_simple ?? `Surah ${surah}`;
  } catch {
    return `Surah ${surah}`;
  }
}
