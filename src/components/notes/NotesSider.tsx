import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from 'jotai';
import { notesFilterAtom } from '@/store/notes';
import { NotesList } from './NotesList';
import { useNotes } from '@/hooks/useNotes';
import { StatsFooter } from '@/components/layout/StatsFooter';
import { useResizeObserver } from '@/hooks/useResizeObserver';

export function NotesSider() {
  const [filter, setFilter] = useAtom(notesFilterAtom);
  const { notes, selectedNotes } = useNotes();
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const isCompact = width < 250;

  const stats = [
    { label: "未导入", value: notes.filter((n) => !n.imported && !n.skipped).length },
    { label: "已导入", value: notes.filter((n) => n.imported).length },
    { label: "已跳过", value: notes.filter((n) => n.skipped).length },
  ];

  return (
    <div ref={ref} className="h-full flex flex-col bg-white">
      <div className="p-4 h-[120px]">
        <h2 className="text-lg font-semibold">笔记</h2>
        <p className="text-sm text-muted-foreground mt-2">
          notes-20240101.db
        </p>
        <div className="mt-2 text-sm">
          <span>总数: {notes.length}</span>
          <span className="ml-4">选中: {selectedNotes.size}</span>
        </div>
      </div>

      {isCompact ? (
        <div className="px-4 py-2 bg-white">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">未导入</SelectItem>
              <SelectItem value="imported">已导入</SelectItem>
              <SelectItem value="deleted">已跳过</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
          <TabsList className="w-full justify-start px-4 h-12 tabs-list">
            <TabsTrigger value="pending">未导入</TabsTrigger>
            <TabsTrigger value="imported">已导入</TabsTrigger>
            <TabsTrigger value="deleted">已跳过</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <NotesList />
          </TabsContent>
          <TabsContent value="imported">
            <NotesList />
          </TabsContent>
          <TabsContent value="deleted">
            <NotesList />
          </TabsContent>
        </Tabs>
      )}

      <div className="flex-1 overflow-hidden">
        {isCompact && <NotesList />}
      </div>

      <StatsFooter stats={stats} />
    </div>
  );
}