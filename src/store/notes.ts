import { atom } from 'jotai';
import type { Note } from '@/lib/db';

export const dbPathAtom = atom<string | null>(null);
export const selectedNotesAtom = atom<Set<number>>(new Set());
export const activeNoteAtom = atom<Note | null>(null);
export const notesFilterAtom = atom<'pending' | 'imported' | 'deleted'>('pending');
export const flomoApiUrlAtom = atom<string>('');
export const customTagsAtom = atom<string>('#wr2flomo');