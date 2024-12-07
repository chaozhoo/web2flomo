import { AuthProvider } from '@/contexts/auth-context';
import { StorageProvider } from '@/contexts/storage-context';
import { Layout } from '@/components/layout';

export function App() {
  return (
    <AuthProvider>
      <StorageProvider>
        <Layout />
      </StorageProvider>
    </AuthProvider>
  );
}
