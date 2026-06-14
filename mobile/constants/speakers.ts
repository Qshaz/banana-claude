// Populate with YouTube speaker data when ready
export interface Speaker {
  id: string;
  name: string;
  channel?: string;
}

export interface Clip {
  youtubeId: string;
  title: string;
  speakerId: string;
  categories: string[];
  durationSeconds: number;
  thumbnailUrl?: string;
}

export const SPEAKERS: Speaker[] = [
  // e.g. { id: 'omar-suleiman', name: 'Omar Suleiman', channel: 'Yaqeen Institute' }
];

export const CLIPS: Clip[] = [
  // e.g. { youtubeId: 'abc123', title: 'Finding Hope in Hard Times', speakerId: 'omar-suleiman', categories: ['hope', 'anxiety'], durationSeconds: 180 }
];
