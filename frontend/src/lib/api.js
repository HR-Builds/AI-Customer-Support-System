const BASE_URL = "/api/v1";
const TOKEN_KEY = "nova_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(", ")
      : detail;
    throw new ApiError(message, res.status);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  // Conversations
  listConversations: () => request("/conversations"),
  createConversation: (title) =>
    request("/conversations", { method: "POST", body: { title } }),
  getConversation: (id) => request(`/conversations/${id}`),
  deleteConversation: (id) =>
    request(`/conversations/${id}`, { method: "DELETE" }),

  // Messages
  listMessages: (conversationId) =>
    request(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, content) =>
    request(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: { content },
    }),

  // Tickets
  listTickets: () => request("/tickets"),
  createTicket: (payload) =>
    request("/tickets", { method: "POST", body: payload }),

  // Admin
  adminStats: () => request("/admin/stats"),
  adminListUsers: () => request("/admin/users"),
  adminGetUser: (id) => request(`/admin/users/${id}`),
  adminUserConversations: (id) => request(`/admin/users/${id}/conversations`),
  adminUpdateUser: (id, payload) =>
    request(`/admin/users/${id}`, { method: "PATCH", body: payload }),
  adminDeleteUser: (id) =>
    request(`/admin/users/${id}`, { method: "DELETE" }),
};

export { ApiError };
