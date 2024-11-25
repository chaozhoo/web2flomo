import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { splitNotes } from '@/lib/db';

interface NewNoteDialogProps {
  onSplit: (notes: string[]) => void;
  children: React.ReactNode;
}

export function NewNoteDialog({ onSplit, children }: NewNoteDialogProps) {
  const [content, setContent] = useState('');
  const [separator, setSeparator] = useState('◆');
  const [open, setOpen] = useState(false);

  const handleSplit = async () => {
    if (!content || !separator) return;
    const notes = await splitNotes(content, separator);
    onSplit(notes);
    setOpen(false);
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新建笔记</DialogTitle>
          <DialogDescription>
            将完整的笔记内容按分隔符拆分为多个笔记片段。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">笔记内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入或粘贴完整的笔记内容..."
              className="min-h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="separator">分隔符</Label>
            <Input
              id="separator"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="请输入分隔符..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSplit}>拆分</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}