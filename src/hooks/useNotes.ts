import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { notesFilterAtom, selectedNotesAtom } from '@/store/notes';
import {
  getNotes,
  createNote,
  updateNote,
  markNoteAs,
  deleteNote,
  type Note,
} from '@/lib/db';

export function useNotes() {
  const [filter] = useAtom(notesFilterAtom);
  const [selectedNotes, setSelectedNotes] = useAtom(selectedNotesAtom);
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', filter],
    queryFn: () => getNotes(filter),
  });

  const { mutate: addNote } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutate: editNote } = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutate: markAs } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'imported' | 'skipped' }) =>
      markNoteAs(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNotes(new Set());
    },
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNotes(new Set());
    },
  });

  const toggleNoteSelection = (id: number) => {
    const newSelection = new Set(selectedNotes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedNotes(newSelection);
  };

  const selectAll = () => {
    setSelectedNotes(new Set(notes.map((note) => note.id)));
  };

  const clearSelection = () => {
    setSelectedNotes(new Set());
  };

  return {
    notes,
    isLoading,
    selectedNotes,
    addNote,
    editNote,
    markAs,
    removeNote,
    toggleNoteSelection,
    selectAll,
    clearSelection,
  };
}