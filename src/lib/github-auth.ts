import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN_KEY = 'github_token';
const GIST_ID_KEY = 'gist_id';

export function getStoredToken(): string | null {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
}

export function getStoredGistId(): string | null {
  return localStorage.getItem(GIST_ID_KEY);
}

export function setStoredGistId(id: string) {
  localStorage.setItem(GIST_ID_KEY, id);
}

export async function verifyGithubToken(token: string): Promise<boolean> {
  try {
    const octokit = new Octokit({ auth: token });
    await octokit.users.getAuthenticated();
    return true;
  } catch {
    return false;
  }
} 



