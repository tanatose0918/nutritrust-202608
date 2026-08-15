export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://nutritrust-backend-production.up.railway.app'
    : 'http://localhost:5000');

export async function runPrivacyTokenizer(email?: string, prompt?: string, consentSecret?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mcp/privacy-tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, prompt, consent_secret: consentSecret }),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP privacyTokenizer error:', error);
    return null;
  }
}

export async function analyzeStackSafety(productIds: string[], healthIssues?: string[], healthGoals?: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mcp/stack-safety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: productIds, health_issues: healthIssues, health_goals: healthGoals }),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP stackSafety error:', error);
    return null;
  }
}

export async function computeDynamicPersonaMatch(email: string | undefined, prompt: string | undefined, productIds: string[], healthIssues?: string[], healthGoals?: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mcp/dynamic-persona-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, prompt, product_ids: productIds, health_issues: healthIssues, health_goals: healthGoals }),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP dynamicPersonaMatch error:', error);
    return null;
  }
}

export async function queryEvidenceKB(ingredientId?: string, condition?: string) {
  try {
    const params = new URLSearchParams();
    if (ingredientId) params.append('ingredient_id', ingredientId);
    if (condition) params.append('condition', condition);
    
    const res = await fetch(`${API_BASE_URL}/api/mcp/evidence-kb?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP evidenceKB error:', error);
    return null;
  }
}

export async function getMerchantPrices(productId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mcp/merchant-price?product_id=${productId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP merchantPrice error:', error);
    return null;
  }
}

export async function fetchAiPharmacistSummary(payload: {
  email?: string;
  product_names: string[];
  conflicts: any[];
  synergies: any[];
  warnings: any[];
  health_issues?: string[];
  health_goals?: string[];
  safety_score?: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/mcp/ai-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('API MCP fetchAiPharmacistSummary error:', error);
    return null;
  }
}
