export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  sync_status?: 'synced' | 'pending' | 'error';
}

export interface GistContent {
  notes: Note[];
  version: number;
  lastSync: string;
}

export interface SyncMetadata {
  gistId: string;
  lastSync: string;
  version: string;
} 