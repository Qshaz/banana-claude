export interface Speaker {
  id: string;
  name: string;
  shortName: string;
  language?: string;
  thumbnail?: string;
}

export interface Clip {
  id: string;
  speakerId: string;
  title: string;
  youtubeId: string;    // YouTube video ID (empty = coming soon)
  durationSeconds: number;
  categories: string[];
  tags: string[];
}

export const SPEAKERS: Speaker[] = [
  { id: 'nouman', name: 'Nouman Ali Khan', shortName: 'NAK', language: 'en' },
  { id: 'tim-humble', name: 'Tim Humble', shortName: 'Tim H', language: 'en' },
  { id: 'aaisha-aamir', name: 'Aaisha Aamir', shortName: 'Aaisha', language: 'ur' },
  { id: 'belal-assad', name: 'Belal Assad', shortName: 'Belal A', language: 'en' },
  { id: 'abu-bakr-zoud', name: 'Abu Bakr Zoud', shortName: 'Abu Bakr', language: 'en' },
  { id: 'haifa-younis', name: 'Dr Haifa Younis', shortName: 'Dr Haifa', language: 'en' },
  { id: 'saad-tasleem', name: 'Saad Tasleem', shortName: 'Saad T', language: 'en' },
  { id: 'suleiman-hani', name: 'Suleiman Hani', shortName: 'Suleiman', language: 'en' },
  { id: 'iram-bint-safia', name: 'Iram bint Safia', shortName: 'Iram', language: 'en' },
];

export const CLIPS: Clip[] = [
  // ── Nouman Ali Khan ──
  {
    id: 'nak-1', speakerId: 'nouman',
    title: 'Islamic Solutions to Overcome Depression and Anxiety',
    youtubeId: 'extEBKq_5e0', durationSeconds: 0,
    categories: ['depression', 'anxiety'], tags: ['mental health', 'quran', 'peace'],
  },
  {
    id: 'nak-2', speakerId: 'nouman',
    title: 'Struggling With Anxiety? This Will Change Your Life',
    youtubeId: 'qrI4a1JVBi4', durationSeconds: 0,
    categories: ['anxiety', 'stress'], tags: ['calm', 'overthinking', 'worry'],
  },

  // ── Tim Humble ──
  {
    id: 'tim-1', speakerId: 'tim-humble',
    title: 'Depression — The Cause and the Cure',
    youtubeId: 'bytWFF9eB4w', durationSeconds: 0,
    categories: ['depression', 'healing'], tags: ['mental health', 'ruqyah', 'recovery'],
  },
  {
    id: 'tim-2', speakerId: 'tim-humble',
    title: 'Feeling Depressed and Anxious',
    youtubeId: 'pCWC64DHo1c', durationSeconds: 0,
    categories: ['depression', 'anxiety', 'healing'], tags: ['emotional', 'faith', 'iman'],
  },

  // ── Aaisha Aamir (Urdu) ──
  {
    id: 'aaisha-1', speakerId: 'aaisha-aamir',
    title: 'Sabr aur Shukar',
    youtubeId: '', durationSeconds: 0,
    categories: ['patience', 'gratitude'], tags: ['urdu', 'sabr', 'shukar'],
  },
  {
    id: 'aaisha-2', speakerId: 'aaisha-aamir',
    title: 'Tawakkul — Allah par Bharosa',
    youtubeId: '', durationSeconds: 0,
    categories: ['trust-in-allah', 'rizq', 'anxiety'], tags: ['urdu', 'tawakkul', 'bharosa'],
  },

  // ── Belal Assad ──
  {
    id: 'belal-1', speakerId: 'belal-assad',
    title: 'Stop Doubting — Trust Allah With What You Cannot Control',
    youtubeId: '_RgShYqxFdk', durationSeconds: 0,
    categories: ['trust-in-allah', 'anxiety', 'stress'], tags: ['tawakkul', 'control', 'surrender'],
  },
  {
    id: 'belal-2', speakerId: 'belal-assad',
    title: 'The Ruling of Forgiveness in Islam',
    youtubeId: 'ZPFP4ixB6rA', durationSeconds: 0,
    categories: ['forgiveness', 'betrayal'], tags: ['afw', 'pardon', 'grudge'],
  },
  {
    id: 'belal-3', speakerId: 'belal-assad',
    title: 'Healing After Child Loss',
    youtubeId: 'g-CkKJWmLTk', durationSeconds: 0,
    categories: ['death-loss', 'childlessness', 'healing'], tags: ['grief', 'loss', 'sabr'],
  },
  {
    id: 'belal-4', speakerId: 'belal-assad',
    title: "You Spoke Behind Someone's Back? Here's How to Repent",
    youtubeId: 'E1bCjLsG5YU', durationSeconds: 0,
    categories: ['gossip', 'scandal', 'forgiveness'], tags: ['ghibah', 'tawbah', 'tongue'],
  },

  // ── Abu Bakr Zoud ──
  {
    id: 'abz-1', speakerId: 'abu-bakr-zoud',
    title: 'Patience — How to Deal With Tests',
    youtubeId: 'VtVEcg17NAY', durationSeconds: 0,
    categories: ['patience', 'stress', 'trust-in-allah'], tags: ['sabr', 'trial', 'hardship'],
  },
  {
    id: 'abz-2', speakerId: 'abu-bakr-zoud',
    title: 'How to Endure Calamities With Patience and Faith',
    youtubeId: 'DHlfK-ljWrs', durationSeconds: 0,
    categories: ['patience', 'death-loss', 'healing'], tags: ['sabr', 'calamity', 'iman'],
  },
  {
    id: 'abz-3', speakerId: 'abu-bakr-zoud',
    title: 'A Message of Hope From the Graveyard of Al-Baqee\'',
    youtubeId: 'J-MHZ9V1AAk', durationSeconds: 0,
    categories: ['death-loss', 'hope', 'fear-of-allah'], tags: ['akhira', 'hereafter', 'death'],
  },

  // ── Dr Haifa Younis ──
  {
    id: 'haifa-1', speakerId: 'haifa-younis',
    title: "Why Not Seek Forgiveness? | My Dear Heart",
    youtubeId: 'v42eeEHU6h0', durationSeconds: 0,
    categories: ['forgiveness', 'healing'], tags: ['tawbah', 'heart', 'mercy'],
  },
  {
    id: 'haifa-2', speakerId: 'haifa-younis',
    title: 'This Du\'a Will Help You Keep Your Heart Clean',
    youtubeId: 'Qjrca8NUyMQ', durationSeconds: 0,
    categories: ['healing', 'forgiveness', 'fear-of-allah'], tags: ['dua', 'heart', 'purify'],
  },
  {
    id: 'haifa-3', speakerId: 'haifa-younis',
    title: 'Purifying Our Hearts',
    youtubeId: 'aVezUg_BiJs', durationSeconds: 0,
    categories: ['healing', 'fear-of-allah', 'gratitude'], tags: ['tazkiyah', 'soul', 'purity'],
  },

  // ── Saad Tasleem ──
  {
    id: 'saad-1', speakerId: 'saad-tasleem',
    title: 'Extinguishing Burnout',
    youtubeId: 'KgCuKbG3JuM', durationSeconds: 0,
    categories: ['stress', 'anxiety', 'depression'], tags: ['burnout', 'exhaustion', 'rest'],
  },
  {
    id: 'saad-2', speakerId: 'saad-tasleem',
    title: 'How Social Media Is Hijacking Our Imaan',
    youtubeId: 'PtloYwc6fN8', durationSeconds: 0,
    categories: ['anxiety', 'loneliness', 'stress'], tags: ['social media', 'distraction', 'iman'],
  },

  // ── Suleiman Hani ──
  {
    id: 'sul-1', speakerId: 'suleiman-hani',
    title: 'When Your World Is Breaking — And How to Fix It',
    youtubeId: 'yvKuBQO2P6A', durationSeconds: 0,
    categories: ['stress', 'hopelessness', 'trust-in-allah'], tags: ['crisis', 'hardship', 'rebuilding'],
  },
  {
    id: 'sul-2', speakerId: 'suleiman-hani',
    title: 'When Allah Goes to War for You',
    youtubeId: '9gwe-HMwZv0', durationSeconds: 0,
    categories: ['trust-in-allah', 'hope', 'patience'], tags: ['quran', 'juz 10', 'reliance'],
  },

  // ── Iram bint Safia ──
  {
    id: 'iram-1', speakerId: 'iram-bint-safia',
    title: 'Do Not Over Think!',
    youtubeId: 'kNgTsSwvSuE', durationSeconds: 0,
    categories: ['anxiety', 'stress'], tags: ['overthinking', 'peace', 'calm'],
  },
  {
    id: 'iram-2', speakerId: 'iram-bint-safia',
    title: 'Ya Al-Mughni — Ramadan Reflections',
    youtubeId: 'Yz8dogPJDNc', durationSeconds: 0,
    categories: ['rizq', 'trust-in-allah', 'gratitude'], tags: ['allah names', 'provision', 'contentment'],
  },
];

export function getClipsForCategory(slug: string): Clip[] {
  return CLIPS.filter((c) => c.categories.includes(slug));
}

export function getSpeakerById(id: string): Speaker | undefined {
  return SPEAKERS.find((s) => s.id === id);
}
