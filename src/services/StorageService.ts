interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'notesDB';
  private readonly STORE_NAME = 'notes';
  private githubToken: string | null = null;

  // 初始化 IndexedDB
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

  // 保存到本地
  async saveLocal(note: Note): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(note);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 从本地获取
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

  // 同步到 GitHub Gist
  async syncToGist(notes: Note[]): Promise<string> {
    if (!this.githubToken) {
      throw new Error('GitHub token not set');
    }

    const content = JSON.stringify(notes);
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Notes Backup',
        public: false,
        files: {
          'notes.json': {
            content
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to sync with GitHub');
    }

    const data = await response.json();
    return data.id; // 返回 Gist ID
  }

  // 从 GitHub Gist 恢复
  async restoreFromGist(gistId: string): Promise<Note[]> {
    if (!this.githubToken) {
      throw new Error('GitHub token not set');
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${this.githubToken}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to restore from GitHub');
    }

    const data = await response.json();
    const content = data.files['notes.json'].content;
    return JSON.parse(content);
  }

  // 设置 GitHub token
  setGithubToken(token: string) {
    this.githubToken = token;
  }
}

export const storageService = new StorageService(); 