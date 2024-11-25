import { Minus, Square, X } from 'lucide-react';

export function Header() {
  return (
    <div className="h-10 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 select-none">
      <div className="flex-1 app-region-drag" />
      <div className="flex gap-2">
        <button className="p-1 hover:bg-muted rounded-md">
          <Minus className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-muted rounded-md">
          <Square className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-destructive/10 rounded-md">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}