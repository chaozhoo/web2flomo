import { Octokit } from '@octokit/rest';
import type { Note, GistContent } from '@/lib/types';

export class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'notesDB';
  private readonly STORE_NAME = 'notes';
  private octokit: Octokit | null = null;
  private gistId: string | null = null;

  // IndexedDB 初始化
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  // 本地存储操作
  async saveLocal(note: Note): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({
        ...note,
        sync_status: 'pending'
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLocal(id: string): Promise<Note | null> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllLocal(): Promise<Note[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // GitHub Gist 操作
  async initGist(token: string) {
    this.octokit = new Octokit({ auth: token });
    const gistId = localStorage.getItem('gistId');
    
    if (gistId) {
      this.gistId = gistId;
    } else {
      this.gistId = await this.createGist();
      localStorage.setItem('gistId', this.gistId);
    }
  }

  private async createGist(): Promise<string> {
    if (!this.octokit) throw new Error('GitHub not initialized');

    const response = await this.octokit.gists.create({
      description: 'Notes App Sync',
      public: false,
      files: {
        'notes.json': {
          content: JSON.stringify({
            notes: [],
            version: Date.now(),
            lastSync: new Date().toISOString()
          })
        }
      }
    });

    return response.data.id;
  }

  async syncToGist(): Promise<void> {
    if (!this.octokit || !this.gistId) {
      throw new Error('GitHub not initialized');
    }

    const notes = await this.getAllLocal();
    const content: GistContent = {
      notes,
      version: Date.now(),
      lastSync: new Date().toISOString()
    };

    await this.octokit.gists.update({
      gist_id: this.gistId,
      files: {
        'notes.json': {
          content: JSON.stringify(content, null, 2)
        }
      }
    });

    // 更新所有笔记的同步状态
    const db = await this.initDB();
    const transaction = db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    
    for (const note of notes) {
      await store.put({
        ...note,
        sync_status: 'synced'
      });
    }
  }

  async restoreFromGist(): Promise<void> {
    if (!this.octokit || !this.gistId) {
      throw new Error('GitHub not initialized');
    }

    const response = await this.octokit.gists.get({
      gist_id: this.gistId
    });

    const content = response.data.files?.['notes.json']?.content;
    if (!content) return;

    const data = JSON.parse(content) as GistContent;
    const db = await this.initDB();
    const transaction = db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    for (const note of data.notes) {
      await store.put({
        ...note,
        sync_status: 'synced'
      });
    }
  }
}

export const storageService = new StorageService(); 