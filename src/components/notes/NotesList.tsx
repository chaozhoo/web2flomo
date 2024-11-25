import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotes } from '@/hooks/useNotes';

export function NotesList() {
  const { notes, selectedNotes, toggleNoteSelection } = useNotes();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-lg group"
          >
            <Checkbox
              checked={selectedNotes.has(note.id)}
              onCheckedChange={() => toggleNoteSelection(note.id)}
              className="mt-1"
            />
            <div className="flex-1 text-sm">
              <div className="line-clamp-2 whitespace-pre-line">{note.content}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}