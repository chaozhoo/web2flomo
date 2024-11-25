export async function getGoogleOAuthCredentials() {
  try {
    const response = await fetch('/api/auth/google/credentials');
    if (!response.ok) {
      throw new Error('Failed to fetch OAuth credentials');
    }
    const { clientId, clientSecret } = await response.json();
    return { clientId, clientSecret };
  } catch (error) {
    console.error('Error fetching OAuth credentials:', error);
    throw error;
  }
}

export async function initGoogleAuth() {
  const { clientId } = await getGoogleOAuthCredentials();
  return new GoogleOAuthProvider({ clientId });
} 