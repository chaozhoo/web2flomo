export interface Note {
  id: string;
  content: string;
  imported: boolean;
  skipped: boolean;
  created_at: string;
  updated_at: string;
  sync_status?: 'synced' | 'pending' | 'error';
}

export interface SyncMetadata {
  last_sync: string;
  file_id?: string;
  version?: string;
} 