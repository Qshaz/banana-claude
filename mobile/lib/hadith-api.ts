const BASE = 'https://api.sunnah.com/v1';

function sunnahHeaders() {
  return { 'X-API-Key': process.env.EXPO_PUBLIC_SUNNAH_KEY ?? '' };
}

export interface HadithRef {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
}

export interface Hadith {
  collection: string;
  hadithNumber: string;
  body: string;      // English text
  grades: { name: string; grade: string }[];
}

export async function fetchHadith(ref: HadithRef): Promise<Hadith | null> {
  try {
    const url = `${BASE}/collections/${ref.collection}/books/${ref.bookNumber}/hadiths/${ref.hadithNumber}`;
    const res = await fetch(url, { headers: sunnahHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    // API returns { hadiths: [ { hadithNumber, collection, book, grades, hadith: [{ body, lang }] } ] }
    const h = data?.hadiths?.[0];
    if (!h) return null;
    const english = h.hadith?.find((x: any) => x.lang === 'en');
    return {
      collection: h.collection,
      hadithNumber: h.hadithNumber,
      body: english?.body ?? '',
      grades: h.grades ?? [],
    };
  } catch {
    return null;
  }
}

export async function fetchCategoryHadith(slug: string): Promise<Hadith[]> {
  const refs = CATEGORY_HADITH[slug] ?? [];
  const results = await Promise.all(refs.map(fetchHadith));
  return results.filter(Boolean) as Hadith[];
}

// Curated hadith references per category — verified from sunnah.com collections
// collection names: 'bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik', 'riyadussalihin'
const CATEGORY_HADITH: Record<string, HadithRef[]> = {
  patience: [
    { collection: 'muslim', bookNumber: '55', hadithNumber: '2999' },   // "Wonderful is the affair of the believer..."
    { collection: 'bukhari', bookNumber: '70', hadithNumber: '5641' },  // "No fatigue, nor disease, nor sorrow..."
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2399' }, // "The greatest reward comes with the greatest trial"
  ],
  hope: [
    { collection: 'bukhari', bookNumber: '97', hadithNumber: '7405' },  // "I am as My servant expects Me to be"
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2675' },   // "Allah is more pleased with the repentance of His slave"
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2346' }, // "Were you to rely on Allah as He should be relied on..."
  ],
  hopelessness: [
    { collection: 'bukhari', bookNumber: '97', hadithNumber: '7405' },
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2675' },
    { collection: 'abudawud', bookNumber: '8', hadithNumber: '1514' },  // Du'a for distress
  ],
  anxiety: [
    { collection: 'bukhari', bookNumber: '80', hadithNumber: '6369' },  // Du'a for anxiety
    { collection: 'tirmidhi', bookNumber: '46', hadithNumber: '3524' }, // "Allahumma inni a'udhu bika minal hammi wal hazan"
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2664' },   // "No calamity befalls a Muslim..."
  ],
  depression: [
    { collection: 'bukhari', bookNumber: '80', hadithNumber: '6369' },
    { collection: 'muslim', bookNumber: '55', hadithNumber: '2999' },
    { collection: 'tirmidhi', bookNumber: '46', hadithNumber: '3524' },
  ],
  stress: [
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2346' },
    { collection: 'bukhari', bookNumber: '80', hadithNumber: '6369' },
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2664' },
  ],
  'trust-in-allah': [
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2346' }, // "Were you to rely on Allah..."
    { collection: 'ibnmajah', bookNumber: '36', hadithNumber: '4164' }, // Tawakkul hadith
    { collection: 'bukhari', bookNumber: '97', hadithNumber: '7405' },
  ],
  love: [
    { collection: 'bukhari', bookNumber: '2', hadithNumber: '15' },     // "None of you truly believes until..."
    { collection: 'muslim', bookNumber: '1', hadithNumber: '45' },
    { collection: 'tirmidhi', bookNumber: '27', hadithNumber: '1847' }, // Love for the sake of Allah
  ],
  gratitude: [
    { collection: 'abudawud', bookNumber: '43', hadithNumber: '4811' }, // "He who does not thank people..."
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2314' }, // Shukr increases blessings
    { collection: 'muslim', bookNumber: '55', hadithNumber: '2999' },
  ],
  rizq: [
    { collection: 'ibnmajah', bookNumber: '36', hadithNumber: '4166' }, // Provision is written
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2346' },
    { collection: 'bukhari', bookNumber: '55', hadithNumber: '2840' },  // Seek your provision
  ],
  childlessness: [
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2664' },
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2399' },
    { collection: 'bukhari', bookNumber: '97', hadithNumber: '7405' },
  ],
  widowhood: [
    { collection: 'bukhari', bookNumber: '70', hadithNumber: '5641' },
    { collection: 'muslim', bookNumber: '55', hadithNumber: '2999' },
    { collection: 'riyadussalihin', bookNumber: '1', hadithNumber: '18' },
  ],
  gossip: [
    { collection: 'muslim', bookNumber: '45', hadithNumber: '2589' },   // Definition of backbiting
    { collection: 'abudawud', bookNumber: '43', hadithNumber: '4874' }, // Guarding the tongue
    { collection: 'tirmidhi', bookNumber: '27', hadithNumber: '2416' },
  ],
  betrayal: [
    { collection: 'bukhari', bookNumber: '43', hadithNumber: '2442' },  // Do not oppress
    { collection: 'muslim', bookNumber: '45', hadithNumber: '2564' },
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2399' },
  ],
  scandal: [
    { collection: 'muslim', bookNumber: '45', hadithNumber: '2589' },
    { collection: 'bukhari', bookNumber: '78', hadithNumber: '6064' },  // Protecting honour
    { collection: 'abudawud', bookNumber: '43', hadithNumber: '4874' },
  ],
  loneliness: [
    { collection: 'bukhari', bookNumber: '97', hadithNumber: '7405' },
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2346' },
    { collection: 'riyadussalihin', bookNumber: '1', hadithNumber: '1' },
  ],
  forgiveness: [
    { collection: 'muslim', bookNumber: '49', hadithNumber: '2675' },
    { collection: 'tirmidhi', bookNumber: '48', hadithNumber: '3537' }, // Allah forgives all sins
    { collection: 'ibnmajah', bookNumber: '37', hadithNumber: '4251' },
  ],
  healing: [
    { collection: 'bukhari', bookNumber: '76', hadithNumber: '5678' },  // "For every disease there is a cure"
    { collection: 'muslim', bookNumber: '39', hadithNumber: '2204' },
    { collection: 'tirmidhi', bookNumber: '46', hadithNumber: '3524' },
  ],
  'death-loss': [
    { collection: 'bukhari', bookNumber: '23', hadithNumber: '1283' },  // Inna lillahi wa inna ilayhi raji'un
    { collection: 'muslim', bookNumber: '11', hadithNumber: '924' },    // On visiting the sick + death
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2399' },
  ],
  'fear-of-allah': [
    { collection: 'bukhari', bookNumber: '2', hadithNumber: '15' },
    { collection: 'tirmidhi', bookNumber: '37', hadithNumber: '2317' }, // Taqwa
    { collection: 'riyadussalihin', bookNumber: '1', hadithNumber: '61' },
  ],
};
