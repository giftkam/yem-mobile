// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const TOKEN_KEY = "yem_auth_token";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function loadStoredToken() {
  authToken = localStorage.getItem(TOKEN_KEY);
  return authToken;
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      `Could not reach the Yem backend at ${API_BASE_URL}. Is it running? (${networkErr.message})`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);
  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),

  getWallet: () => request("/wallet"),
  deposit: (payload) => request("/wallet/deposit", { method: "POST", body: payload }),
  withdraw: (payload) => request("/wallet/withdraw", { method: "POST", body: payload }),
  getTransactions: () => request("/wallet/transactions"),

  placeOrder: (payload) => request("/orders", { method: "POST", body: payload }),
  getOrders: () => request("/orders"),

  submitKyc: (payload) => request("/kyc/submit", { method: "POST", body: payload }),
  getKycStatus: () => request("/kyc/status"),

  getAdminOverview: () => request("/admin/overview"),
  getAdminLedger: () => request("/admin/ledger"),
  requestPayout: () => request("/admin/payout", { method: "POST" }),
};
