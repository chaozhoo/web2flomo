import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HardDrive, Cloud } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { uploadToGoogleDrive, downloadFromGoogleDrive } from '@/lib/google-drive';

interface StorageDialogProps {
  mode: 'save' | 'load';
  trigger: React.ReactNode;
  onSelect: (storage: 'local' | 'drive', file?: File) => void;
}

export function StorageDialog({ mode, trigger, onSelect }: StorageDialogProps) {
  const [storage, setStorage] = useState<'local' | 'drive'>('local');
  const [open, setOpen] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      localStorage.setItem('googleDriveToken', response.access_token);
      if (storage === 'drive') {
        handleStorageSelect();
      }
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  const handleStorageSelect = async () => {
    if (storage === 'local') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.db';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onSelect('local', file);
          setOpen(false);
        }
      };
      input.click();
    } else {
      const token = localStorage.getItem('googleDriveToken');
      if (!token) {
        login();
        return;
      }
      // Handle Google Drive selection
      onSelect('drive');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'save' ? '保存到' : '加载从'}</DialogTitle>
          <DialogDescription>
            选择存储位置
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={storage} onValueChange={(v) => setStorage(v as 'local' | 'drive')} className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <RadioGroupItem value="local" id="local" className="peer sr-only" />
            <Label
              htmlFor="local"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <HardDrive className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">本地存储</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="drive" id="drive" className="peer sr-only" />
            <Label
              htmlFor="drive"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Cloud className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Google Drive</span>
            </Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleStorageSelect}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}