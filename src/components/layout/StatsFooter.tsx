import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface StatsItem {
  label: string;
  value: number;
}

interface StatsFooterProps {
  stats: StatsItem[];
  className?: string;
}

export function StatsFooter({ stats, className }: StatsFooterProps) {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const isCompact = width < 200;

  if (isCompact) {
    return (
      <div ref={ref} className={cn("p-4 border-t", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 hover:bg-muted rounded-md">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="start">
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">{stat.label}:</span>
                    <span className="text-xs font-medium min-w-[4ch] text-right">{stat.value}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("p-4 border-t", className)}>
      <div className="flex gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs text-muted-foreground truncate">{stat.label}:</span>
            <span className="text-xs font-medium min-w-[4ch] text-right">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}