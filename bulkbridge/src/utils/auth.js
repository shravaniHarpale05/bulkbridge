const STORAGE_KEY = "bulkbridge_user";


// =====================================
// SAVE LOGGED-IN USER
// =====================================

export function saveUser(user) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(user)
  );

}


// =====================================
// GET LOGGED-IN USER
// =====================================

export function getUser() {

  const data = localStorage.getItem(STORAGE_KEY);

  return data
    ? JSON.parse(data)
    : null;

}


// =====================================
// LOGOUT USER
// =====================================

export function logout() {

  localStorage.removeItem(STORAGE_KEY);

}


// =====================================
// GET DASHBOARD PATH BASED ON ROLE
// =====================================

export function dashboardPathForRole(role) {

  if (role === "farmer") {

    return "/farmer-dashboard";

  }

  if (role === "buyer") {

    return "/retailer-dashboard";

  }

  return "/";

}