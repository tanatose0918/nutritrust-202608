export interface IUserSession {
  _id: string;
  email: string;
  username?: string | null;
  role?: string;
  subject_type?: string | null;
  intake_routine?: string | null;
  health_goals?: string[];
  health_issues?: string | null;
  current_supplements?: string | null;
}


export const SESSION_KEY = 'ntt_user_session';
export const AUTH_STATE_EVENT = 'nutritrust_auth_state_changed';

/**
 * Get current logged in user session from storage
 */
export function getUserSession(): IUserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed._id ? parsed : null;
  } catch (err) {
    console.error('Error reading user session:', err);
    return null;
  }
}

/**
 * Set user session and dispatch state change event
 */
export function setUserSession(user: IUserSession): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify(user);
    localStorage.setItem(SESSION_KEY, payload);
    sessionStorage.setItem(SESSION_KEY, payload);
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: user }));
  } catch (err) {
    console.error('Error saving user session:', err);
  }
}

/**
 * Clear user session and dispatch state change event
 */
export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: null }));
  } catch (err) {
    console.error('Error clearing user session:', err);
  }
}
