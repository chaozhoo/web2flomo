import { useState, useEffect } from 'react';
import { storageService } from '@/services/StorageService';
import type { Note } from '@/lib/types';

export function useNoteStorage(noteId: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadNote() {
      try {
        const localNote = await storageService.getLocal(noteId);
        if (localNote) {
          setNote(localNote);
        }
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    loadNote();
  }, [noteId]);

  const saveNote = async (updatedNote: Note) => {
    try {
      await storageService.saveLocal(updatedNote);
      setNote(updatedNote);

      if (navigator.onLine) {
        await storageService.syncToGist();
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { note, loading, error, saveNote };
} 