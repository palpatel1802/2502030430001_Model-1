import { authAPI } from "../api/apiService";

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getDisplayName = (user) => {
  if (!user) return "Guest";
  const full = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return full || user.email?.split("@")[0] || "Student";
};

export const syncCurrentUser = async () => {
  try {
    const user = await authAPI.getCurrentUser();
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch {
    return getStoredUser();
  }
};
