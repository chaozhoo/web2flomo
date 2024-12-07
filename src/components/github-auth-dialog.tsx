import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { verifyGithubToken, setStoredToken } from '@/lib/github-auth';
import { useToast } from '@/components/ui/use-toast';

interface GithubAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function GithubAuthDialog({ open, onOpenChange, onSuccess }: GithubAuthDialogProps) {
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!token) return;
    
    setIsVerifying(true);
    try {
      const isValid = await verifyGithubToken(token);
      if (isValid) {
        setStoredToken(token);
        toast({
          title: '验证成功',
          description: 'GitHub Token 已保存',
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: '验证失败',
          description: '请检查 Token 是否正确',
          variant: 'destructive',
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>GitHub 授权</DialogTitle>
          <DialogDescription>
            请输入 GitHub Personal Access Token
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="ghp_xxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleVerify} disabled={!token || isVerifying}>
            {isVerifying ? '验证中...' : '验证'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 