import { LibrarySider } from './library/LibrarySider';

export function Layout() {
  return (
    <div className="flex h-screen">
      <LibrarySider />
      <main className="flex-1 overflow-auto">
        {/* 主要内容区域 */}
      </main>
    </div>
  );
} 