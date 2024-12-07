import { useEffect, useState } from 'react';
import { Cloud, CloudOff } from 'lucide-react';
import { useStorage } from '@/contexts/storage-context';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function SyncStatus() {
  const { isInitialized, syncNow } = useStorage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date>();

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await syncNow();
      setLastSync(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          disabled={!isInitialized || isSyncing}
          onClick={handleSync}
        >
          {isInitialized ? (
            <Cloud className="h-4 w-4" />
          ) : (
            <CloudOff className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isInitialized
          ? `上次同步: ${lastSync?.toLocaleString() || '从未'}`
          : '未连接到云端'}
      </TooltipContent>
    </Tooltip>
  );
} 