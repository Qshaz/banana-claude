export interface Speaker {
  id: string;
  name: string;
  shortName: string;
  thumbnail?: string;
}

export interface Clip {
  id: string;
  speakerId: string;
  title: string;
  youtubeId: string;
  durationSeconds: number;
  categories: string[];
  tags: string[];
}

export const SPEAKERS: Speaker[] = [
  { id: 'nouman', name: 'Nouman Ali Khan', shortName: 'NAK' },
  { id: 'omar-suleiman', name: 'Omar Suleiman', shortName: 'Omar S' },
  { id: 'mufti-menk', name: 'Mufti Menk', shortName: 'Menk' },
  { id: 'yasmin-mogahed', name: 'Yasmin Mogahed', shortName: 'Yasmin' },
  { id: 'hamza-yusuf', name: 'Hamza Yusuf', shortName: 'Hamza Y' },
];

export const CLIPS: Clip[] = [
  { id: 'c1', speakerId: 'nouman', title: 'When You Feel Hopeless', youtubeId: '', durationSeconds: 240, categories: ['hopelessness', 'depression'], tags: ['hope', 'dark times'] },
  { id: 'c2', speakerId: 'omar-suleiman', title: 'Dealing with Anxiety', youtubeId: '', durationSeconds: 360, categories: ['anxiety', 'stress'], tags: ['peace', 'calm', 'overthinking'] },
  { id: 'c3', speakerId: 'yasmin-mogahed', title: 'Healing the Broken Heart', youtubeId: '', durationSeconds: 420, categories: ['healing', 'betrayal', 'forgiveness'], tags: ['heart', 'pain', 'release'] },
  { id: 'c4', speakerId: 'mufti-menk', title: "Trusting Allah's Plan", youtubeId: '', durationSeconds: 300, categories: ['trust-in-allah', 'hope'], tags: ['tawakkul', 'plan', 'faith'] },
  { id: 'c5', speakerId: 'hamza-yusuf', title: 'Patience in Hardship', youtubeId: '', durationSeconds: 480, categories: ['patience', 'death-loss', 'widowhood'], tags: ['sabr', 'trial', 'strength'] },
];

export function getClipsForCategory(slug: string): Clip[] {
  return CLIPS.filter((c) => c.categories.includes(slug));
}

export function getSpeakerById(id: string): Speaker | undefined {
  return SPEAKERS.find((s) => s.id === id);
}
