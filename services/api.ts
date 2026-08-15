export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://nutritrust-backend-production.up.railway.app'
    : 'http://localhost:5000');

export async function fetchProducts(searchQuery?: string) {
  try {
    const url = searchQuery && searchQuery !== 'all' 
      ? `${API_BASE_URL}/api/products?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/api/products`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.warn('API fetchProducts error:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn(`API fetchProductBySlug('${slug}') error:`, error);
    return null;
  }
}

export async function fetchProductDetail(idOrSlug: string) {
  return fetchProductBySlug(idOrSlug);
}

export async function searchAllCollections(query: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn('API searchAllCollections error:', error);
    return null;
  }
}


export async function compareProducts(ids: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: ids })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn('API compareProducts error:', error);
    return null;
  }
}

export async function submitUserProfile(formData: {
  email: string;
  username?: string;
  role?: string;
  health_goals?: string[];
  health_issues?: string;
  current_supplements?: string;
  subject_type?: string;
  intake_routine?: string;
  ratings?: any;
  feedback?: string;
  is_newsletter_subscriber?: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to save user profile');
    }
    return result;
  } catch (error) {
    console.warn('API submitUserProfile error:', error);
    return null;
  }
}

export async function fetchUserById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/id/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn(`API fetchUserById('${id}') error:`, error);
    return null;
  }
}

export async function updateUserProfileById(id: string, payload: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/id/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn(`API updateUserProfileById('${id}') error:`, error);
    return null;
  }
}

export async function loginUser(identifier: string, password?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error: any) {
    console.warn('API loginUser error:', error);
    return { success: false, message: error.message || 'Network error during login' };
  }
}

export async function fetchWebAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/web-analytics`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) return null;
    // Return full response so component can check loading flag
    return data;
  } catch (error) {
    console.warn('API fetchWebAnalytics error:', error);
    return null;
  }
}

export function sendTelemetryEvent(eventType: string, sessionId?: string) {
  try {
    fetch(`${API_BASE_URL}/api/web-analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, session_id: sessionId || 'anon_session' })
    }).catch(() => {});

    if (eventType === 'search' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nutritrust_search_performed'));
    }
  } catch (e) {
    // Silent telemetry fail
  }
}
