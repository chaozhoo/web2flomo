import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload } from 'lucide-react';
import { NewNoteDialog } from './NewNoteDialog';
import { StorageDialog } from './StorageDialog';
import { useNotes } from '@/hooks/useNotes';
import { StatsFooter } from '@/components/layout/StatsFooter';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useState } from 'react';

export function LibrarySider() {
  const { addNote } = useNotes();
  const [activeTab, setActiveTab] = useState('active');
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const isCompact = width < 250;
  const isVeryCompact = width < 180;

  const handleSplitNotes = async (notes: string[]) => {
    for (const note of notes) {
      await addNote(note);
    }
  };

  const handleStorageSelect = (storage: 'local' | 'drive', file?: File) => {
    console.log('Selected storage:', storage, file);
  };

  const stats = [
    { label: "进行中", value: 0 },
    { label: "已完成", value: 0 },
    { label: "回收站", value: 0 },
  ];

  return (
    <div ref={ref} className="h-full flex flex-col bg-white">
      <div className="p-4 h-[120px]">
        <h2 className="text-lg font-semibold mb-4">库</h2>
        <div className="flex gap-2">
          <NewNoteDialog onSplit={handleSplitNotes}>
            <Button size="sm" className="w-full">
              {isVeryCompact ? (
                <Plus className="h-4 w-4" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  新建
                </>
              )}
            </Button>
          </NewNoteDialog>
          <StorageDialog
            mode="load"
            trigger={
              <Button size="sm" variant="outline" className="w-full">
                {isVeryCompact ? (
                  <Upload className="h-4 w-4" />
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    加载
                  </>
                )}
              </Button>
            }
            onSelect={handleStorageSelect}
          />
        </div>
      </div>

      {isCompact ? (
        <div className="px-4 py-2 bg-white">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="deleted">回收站</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 h-12 tabs-list">
            <TabsTrigger value="active">进行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
            <TabsTrigger value="deleted">回收站</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {/* Library list will go here */}
          </TabsContent>
          <TabsContent value="completed">
            {/* Completed libraries */}
          </TabsContent>
          <TabsContent value="deleted">
            {/* Deleted libraries */}
          </TabsContent>
        </Tabs>
      )}

      <div className="flex-1 overflow-auto p-4">
        {/* Library list will go here */}
      </div>

      <StatsFooter stats={stats} />
    </div>
  );
}