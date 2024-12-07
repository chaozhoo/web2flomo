import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HardDrive, Github } from 'lucide-react';
import { getStoredToken } from '@/lib/github-auth';
import { GithubAuthDialog } from '@/components/github-auth-dialog';

interface StorageDialogProps {
  mode: 'save' | 'load';
  trigger: React.ReactNode;
  onSelect: (type: 'local' | 'github', file?: File) => void;
}

export function StorageDialog({ mode, trigger, onSelect }: StorageDialogProps) {
  const [storage, setStorage] = useState<'local' | 'github'>('local');
  const [open, setOpen] = useState(false);
  const [showGithubAuth, setShowGithubAuth] = useState(false);

  const handleStorageSelect = async () => {
    if (storage === 'local') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onSelect('local', file);
          setOpen(false);
        }
      };
      input.click();
    } else {
      const token = getStoredToken();
      if (!token) {
        setShowGithubAuth(true);
        return;
      }
      onSelect('github');
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'save' ? '保存到' : '加载从'}</DialogTitle>
          </DialogHeader>
          <RadioGroup 
            value={storage} 
            onValueChange={(v) => setStorage(v as 'local' | 'github')} 
            className="grid grid-cols-2 gap-4 pt-4"
          >
            <div>
              <RadioGroupItem value="local" id="local" className="peer sr-only" />
              <Label
                htmlFor="local"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary"
              >
                <HardDrive className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">本地存储</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="github" id="github" className="peer sr-only" />
              <Label
                htmlFor="github"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary"
              >
                <Github className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">GitHub Gist</span>
              </Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={handleStorageSelect}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <GithubAuthDialog
        open={showGithubAuth}
        onOpenChange={setShowGithubAuth}
        onSuccess={() => handleStorageSelect()}
      />
    </>
  );
}
