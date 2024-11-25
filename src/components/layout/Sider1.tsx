import { Library, NotebookPen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';

interface Sider1Props {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
}

export function Sider1({ activeNav, onNavChange }: Sider1Props) {
  return (
    <div className="w-16 border-r bg-background/80 backdrop-blur-sm flex flex-col items-center py-4 gap-2">
      <button
        onClick={() => onNavChange('library')}
        className={cn(
          'p-2 rounded-lg hover:bg-muted transition-colors',
          activeNav === 'library' && 'bg-muted'
        )}
        title="库"
      >
        <Library className="h-5 w-5" />
      </button>
      <button
        onClick={() => onNavChange('notes')}
        className={cn(
          'p-2 rounded-lg hover:bg-muted transition-colors',
          activeNav === 'notes' && 'bg-muted'
        )}
        title="笔记"
      >
        <NotebookPen className="h-5 w-5" />
      </button>
    </div>
  );
}