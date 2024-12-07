import { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '@/services/StorageService';
import { useAuth } from './auth-context';

interface StorageContextType {
  isInitialized: boolean;
  syncNow: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType>({
  isInitialized: false,
  syncNow: async () => {},
});

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token && !isInitialized) {
      storageService.initGist(token).then(() => {
        setIsInitialized(true);
      });
    }
  }, [token, isInitialized]);

  const syncNow = async () => {
    if (!isInitialized) return;
    await storageService.syncToGist();
  };

  return (
    <StorageContext.Provider value={{ isInitialized, syncNow }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
} 