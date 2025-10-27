const API_BASE = "https://smartcredit-ai.onrender.com/api/v1";

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // защита от потери слэша
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ========== Специфические API-вызовы ==========
export async function askScoring(query, token) {
  return apiRequest("/scoring/ask", "POST", { query }, token);
}
