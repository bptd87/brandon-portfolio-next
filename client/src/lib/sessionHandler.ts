/**
 * Handle session token for browsers that block third-party cookies
 * This extracts the token from URL params and stores it for API requests
 */

const SESSION_TOKEN_KEY = 'app_session_token';

export function handleSessionToken() {
  // Check if we have a session_token in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const sessionToken = urlParams.get('session_token');

  if (sessionToken) {
    // Store in localStorage for future requests
    localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);

    // Clean up the URL
    urlParams.delete('session_token');
    const newSearch = urlParams.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
    window.history.replaceState({}, '', newUrl);

    // Reload to apply the session
    window.location.reload();
  }
}

export function getStoredSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearStoredSessionToken() {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}
