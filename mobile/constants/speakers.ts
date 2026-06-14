export interface Speaker {
  id: string;
  name: string;
  shortName: string;
  language?: string;   // 'en' | 'ur' | 'ar' etc — for filtering
  thumbnail?: string;
}

export interface Clip {
  id: string;
  speakerId: string;
  title: string;
  youtubeId: string;      // YouTube video ID only (not full URL). Empty = coming soon.
  durationSeconds: number;
  categories: string[];   // category slugs from categories.ts
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

// YouTube IDs are intentionally empty — fill these in with real video IDs
// when you have the official links. Cards show "Coming soon" until populated.
export const CLIPS: Clip[] = [
  {
    id: 'c1', speakerId: 'nouman', title: 'When You Feel Hopeless',
    youtubeId: '', durationSeconds: 0,
    categories: ['hopelessness', 'depression'], tags: ['hope', 'dark times'],
  },
  {
    id: 'c2', speakerId: 'nouman', title: 'The Quran and Anxiety',
    youtubeId: '', durationSeconds: 0,
    categories: ['anxiety', 'stress'], tags: ['peace', 'calm', 'overthinking'],
  },
  {
    id: 'c3', speakerId: 'tim-humble', title: 'Dealing with Depression Islamically',
    youtubeId: '', durationSeconds: 0,
    categories: ['depression', 'healing'], tags: ['mental health', 'ruqyah', 'recovery'],
  },
  {
    id: 'c4', speakerId: 'tim-humble', title: 'When Life Feels Too Hard',
    youtubeId: '', durationSeconds: 0,
    categories: ['patience', 'stress', 'hopelessness'], tags: ['sabr', 'hardship'],
  },
  {
    id: 'c5', speakerId: 'belal-assad', title: 'Trusting Allah in Dark Times',
    youtubeId: '', durationSeconds: 0,
    categories: ['trust-in-allah', 'hope', 'anxiety'], tags: ['tawakkul', 'faith'],
  },
  {
    id: 'c6', speakerId: 'belal-assad', title: 'Healing a Broken Heart',
    youtubeId: '', durationSeconds: 0,
    categories: ['betrayal', 'healing', 'forgiveness'], tags: ['heart', 'pain', 'release'],
  },
  {
    id: 'c7', speakerId: 'abu-bakr-zoud', title: 'The Power of Patience',
    youtubeId: '', durationSeconds: 0,
    categories: ['patience', 'death-loss'], tags: ['sabr', 'trial', 'strength'],
  },
  {
    id: 'c8', speakerId: 'abu-bakr-zoud', title: 'Never Lose Hope in Allah',
    youtubeId: '', durationSeconds: 0,
    categories: ['hopelessness', 'hope', 'trust-in-allah'], tags: ['rahma', 'mercy', 'promise'],
  },
  {
    id: 'c9', speakerId: 'haifa-younis', title: 'Women and Grief',
    youtubeId: '', durationSeconds: 0,
    categories: ['death-loss', 'widowhood', 'healing'], tags: ['grief', 'women', 'loss'],
  },
  {
    id: 'c10', speakerId: 'haifa-younis', title: 'Purifying the Heart from Resentment',
    youtubeId: '', durationSeconds: 0,
    categories: ['forgiveness', 'betrayal', 'healing'], tags: ['heart', 'grudge', 'tazkiyah'],
  },
  {
    id: 'c11', speakerId: 'saad-tasleem', title: 'Social Anxiety and Islam',
    youtubeId: '', durationSeconds: 0,
    categories: ['anxiety', 'loneliness', 'stress'], tags: ['social', 'nervous', 'confidence'],
  },
  {
    id: 'c12', speakerId: 'saad-tasleem', title: 'Finding Your People',
    youtubeId: '', durationSeconds: 0,
    categories: ['loneliness'], tags: ['community', 'belonging', 'friendship'],
  },
  {
    id: 'c13', speakerId: 'suleiman-hani', title: 'Overcoming Guilt and Shame',
    youtubeId: '', durationSeconds: 0,
    categories: ['scandal', 'forgiveness', 'fear-of-allah'], tags: ['tawbah', 'guilt', 'shame'],
  },
  {
    id: 'c14', speakerId: 'suleiman-hani', title: 'Rizq: Why Allah Delays Provision',
    youtubeId: '', durationSeconds: 0,
    categories: ['rizq', 'trust-in-allah', 'patience'], tags: ['money', 'job', 'provision', 'delay'],
  },
  {
    id: 'c15', speakerId: 'iram-bint-safia', title: 'Finding Peace in Difficult Times',
    youtubeId: '', durationSeconds: 0,
    categories: ['anxiety', 'stress', 'hope'], tags: ['peace', 'calm', 'resilience'],
  },
  {
    id: 'c16', speakerId: 'iram-bint-safia', title: 'The Gift of Gratitude',
    youtubeId: '', durationSeconds: 0,
    categories: ['gratitude'], tags: ['shukr', 'blessing', 'contentment'],
  },
  {
    id: 'c17', speakerId: 'aaisha-aamir', title: 'Sabr aur Shukar',
    youtubeId: '', durationSeconds: 0,
    categories: ['patience', 'gratitude'], tags: ['urdu', 'sabr', 'shukar'],
  },
  {
    id: 'c18', speakerId: 'aaisha-aamir', title: 'Tawakkul — Allah par Bharosa',
    youtubeId: '', durationSeconds: 0,
    categories: ['trust-in-allah', 'rizq', 'anxiety'], tags: ['urdu', 'tawakkul', 'bharosa'],
  },
];

export function getClipsForCategory(slug: string): Clip[] {
  return CLIPS.filter((c) => c.categories.includes(slug));
}

export function getSpeakerById(id: string): Speaker | undefined {
  return SPEAKERS.find((s) => s.id === id);
}
