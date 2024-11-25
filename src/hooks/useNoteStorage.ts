import { useState, useEffect } from 'react';
import { storageService } from '../services/StorageService';

export function useNoteStorage(noteId: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载笔记
  useEffect(() => {
    async function loadNote() {
      try {
        // 先从本地加载
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

  // 保存笔记
  const saveNote = async (updatedNote: Note) => {
    try {
      // 先保存到本地
      await storageService.saveLocal(updatedNote);
      setNote(updatedNote);

      // 如果在线，尝试同步到 Gist
      if (navigator.onLine) {
        const allNotes = [updatedNote]; // 实际使用时需要获取所有笔记
        await storageService.syncToGist(allNotes);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { note, loading, error, saveNote };
} 