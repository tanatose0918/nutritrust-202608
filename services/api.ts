const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function fetchProducts(params?: { search?: string; category?: string; brand?: string }) {
  try {
    const url = new URL(`${API_BASE_URL}/api/products`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.brand) url.searchParams.append('brand', params.brand);

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn('Fastify API fetchProducts fallback to local mockup:', error);
    return null;
  }
}

export async function fetchProductDetail(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn(`Fastify API fetchProductDetail('${id}') fallback to local mockup:`, error);
    return null;
  }
}

export async function searchAllCollections(query: string) {
  try {
    if (!query || query.trim() === '') {
      return { products: [], brands: [], ingredients: [] };
    }
    const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query.trim())}`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : { products: [], brands: [], ingredients: [] };
  } catch (error) {
    console.warn(`Fastify API searchAllCollections('${query}') fallback to local mockup:`, error);
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
  ratings?: {
    traceability?: number;
    compareEngine?: number;
    scienceEvidence?: number;
    bestDeals?: number;
  };
  feedback?: string;
  is_newsletter_subscriber?: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

export async function fetchWebAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/web-analytics`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.warn('API fetchWebAnalytics error:', error);
    return null;
  }
}

export function sendTelemetryEvent(eventType: string, sessionId?: string) {
  try {
    if (typeof window !== 'undefined') {
      const payload = JSON.stringify({ event_type: eventType, session_id: sessionId });
      
      // Use fetch with application/json header to ensure Fastify parses body correctly
      fetch(`${API_BASE_URL}/api/telemetry/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch((err) => {
        console.warn('Telemetry fetch error:', err);
      });
    }
  } catch {
    // Ignore telemetry errors
  }
}
