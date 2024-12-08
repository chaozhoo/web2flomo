import { useGoogleLogin } from '@react-oauth/google';

export async function initGoogleDrive() {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;
      // Store the access token securely
      localStorage.setItem('googleDriveToken', accessToken);
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return login;
}

export async function uploadToGoogleDrive(file: File) {
  const token = localStorage.getItem('googleDriveToken');
  if (!token) throw new Error('Not authenticated with Google Drive');

  const metadata = {
    name: file.name,
    mimeType: file.type,
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  return response.json();
}

export async function downloadFromGoogleDrive(fileId: string) {
  const token = localStorage.getItem('googleDriveToken');
  if (!token) throw new Error('Not authenticated with Google Drive');

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.blob();
}