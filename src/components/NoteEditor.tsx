import { useNoteStorage } from '../hooks/useNoteStorage';

export function NoteEditor({ noteId }: { noteId: string }) {
  const { note, loading, error, saveNote } = useNoteStorage(noteId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!note) return <div>Note not found</div>;

  const handleSave = async (content: string) => {
    const updatedNote = {
      ...note,
      content,
      updatedAt: Date.now()
    };
    await saveNote(updatedNote);
  };

  return (
    <div>
      <textarea
        value={note.content}
        onChange={(e) => handleSave(e.target.value)}
      />
    </div>
  );
} 