import { create } from 'zustand';
import type { Verse, SessionStep, Visibility } from '../types';

interface SessionStore {
  category: string | null;
  step: SessionStep;
  candidateVerses: Verse[];
  selectedVerse: Verse | null;
  tafsir: string | null;
  currentQuestionIndex: number;
  journalText: string;
  audioUri: string | null;
  visibility: Visibility;

  setCategory: (c: string) => void;
  setStep: (s: SessionStep) => void;
  setCandidateVerses: (v: Verse[]) => void;
  setSelectedVerse: (v: Verse) => void;
  setTafsir: (t: string | null) => void;
  nextQuestion: () => void;
  setJournalText: (t: string) => void;
  appendJournalText: (t: string) => void;
  setAudioUri: (u: string | null) => void;
  setVisibility: (v: Visibility) => void;
  reset: () => void;
}

const initialState = {
  category: null,
  step: 'verses' as SessionStep,
  candidateVerses: [],
  selectedVerse: null,
  tafsir: null,
  currentQuestionIndex: 0,
  journalText: '',
  audioUri: null,
  visibility: 'private' as Visibility,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,
  setCategory: (c) => set({ category: c }),
  setStep: (s) => set({ step: s }),
  setCandidateVerses: (v) => set({ candidateVerses: v }),
  setSelectedVerse: (v) => set({ selectedVerse: v }),
  setTafsir: (t) => set({ tafsir: t }),
  nextQuestion: () => set((s) => ({ currentQuestionIndex: s.currentQuestionIndex + 1 })),
  setJournalText: (t) => set({ journalText: t }),
  appendJournalText: (t) => set((s) => ({ journalText: s.journalText ? `${s.journalText}\n\n${t}` : t })),
  setAudioUri: (u) => set({ audioUri: u }),
  setVisibility: (v) => set({ visibility: v }),
  reset: () => set(initialState),
}));
