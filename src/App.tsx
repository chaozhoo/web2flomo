import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Header } from '@/components/layout/Header';
import { Sider1 } from '@/components/layout/Sider1';
import { LibrarySider } from '@/components/library/LibrarySider';
import { LibraryContent } from '@/components/library/LibraryContent';
import { NotesSider } from '@/components/notes/NotesSider';
import { NotesContent } from '@/components/notes/NotesContent';
import type { NavItem } from '@/types';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const GOOGLE_CLIENT_ID = '736557561467-c3u2hk4u8mr5s0uth8r5qk9ebvr4d6vq.apps.googleusercontent.com';

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('library');

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="h-screen flex flex-col bg-background font-sans">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sider1 activeNav={activeNav} onNavChange={setActiveNav} />
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
              {activeNav === 'library' ? <LibrarySider /> : <NotesSider />}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              {activeNav === 'library' ? <LibraryContent /> : <NotesContent />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;