const USER_STORAGE_KEY = "bulkbridge_user";
const TOKEN_STORAGE_KEY = "bulkbridge_token";

export function saveAuth(user, token) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Backward-compatible helper used by existing pages.
export function saveUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getUser() {
  const data = localStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    clearAuth();
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken() && getUser());
}

export function clearAuth() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function logout() {
  clearAuth();
}

export function dashboardPathForRole(role) {
  if (role === "farmer") return "/farmer-dashboard";
  if (role === "buyer") return "/retailer-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/";
}
