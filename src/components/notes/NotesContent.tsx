import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NotesContent() {
  const [content, setContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  const addToHistory = useCallback((newContent: string) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newContent]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    addToHistory(newContent);
  };

  const findAndReplace = () => {
    if (!searchText) {
      toast({
        title: "错误",
        description: "请输入要查找的内容",
        variant: "destructive",
      });
      return;
    }

    try {
      const searchPattern = useRegex ? new RegExp(searchText, 'g') : searchText;
      const newContent = content.replace(searchPattern, replaceText);
      
      if (newContent === content) {
        toast({
          title: "未找到匹配",
          description: "没有找到需要替换的内容",
        });
        return;
      }

      handleContentChange(newContent);
      toast({
        title: "替换完成",
        description: "内容已更新",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "正则表达式格式错误",
        variant: "destructive",
      });
    }
  };

  const removeEmptyLines = () => {
    const newContent = content
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
    
    if (newContent === content) {
      toast({
        title: "提示",
        description: "没有空行需要删除",
      });
      return;
    }

    handleContentChange(newContent);
    toast({
      title: "完成",
      description: "已删除所有空行",
    });
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label>笔记编辑</Label>
          <Textarea 
            className="min-h-[200px]" 
            placeholder="输入笔记内容..." 
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline">取消</Button>
            <Button>保存</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>flomo API</Label>
          <Input placeholder="请输入 Flomo API URL..." />
        </div>

        <div className="space-y-2">
          <Label>自定义标签</Label>
          <Input placeholder="#标签1 #标签2..." />
        </div>

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <span>高级选项</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>查找内容</Label>
              <Input 
                placeholder="输入要查找的内容..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>替换为</Label>
              <Input 
                placeholder="输入要替换为的内容..." 
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={findAndReplace}>查找替换</Button>
              <Button variant="outline" onClick={removeEmptyLines}>删除空行</Button>
              <Button 
                variant="outline" 
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                撤回
              </Button>
              <Button 
                variant="outline" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                重做
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="regex" 
                checked={useRegex}
                onCheckedChange={setUseRegex}
              />
              <Label htmlFor="regex">使用正则表达式</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button className="w-full">发送到 flomo</Button>
      </div>
    </div>
  );
}