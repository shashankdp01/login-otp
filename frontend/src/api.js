const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function firstError(data) {
  if (data?.error) return data.error;
  const v = data && Object.values(data)[0];
  return (Array.isArray(v) ? v[0] : v) || "Something went wrong. Try again.";
}

async function call(path, { method = "GET", body, token, signal } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    signal,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(firstError(data)), { status: res.status });
  return data;
}

export const register = (body) => call("/register/", { method: "POST", body });
export const recognize = (email, signal) => call(`/recognize/?email=${encodeURIComponent(email)}`, { signal });
export const verify = (body) => call("/verify/", { method: "POST", body });
export const submitCheckout = (body, token) => call("/checkout/", { method: "POST", body, token });
