// API Configuration — use CRA proxy in development when REACT_APP_API_URL is unset
export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "http://localhost:5000/api" : "/api");

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const details = Array.isArray(error.details) ? `: ${error.details.join(", ")}` : "";
    throw new Error(`${error.message || "API call failed"}${details}`);
  }

  return response.json();
};

// Auth APIs
export const authAPI = {
  register: (data) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getCurrentUser: () => apiCall("/auth/me"),
};

// Notes APIs
export const notesAPI = {
  getAllNotes: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/notes?${queryString}`);
  },
  getMyNotes: () => apiCall("/notes/mine"),
  getSavedNotes: () => apiCall("/notes/saved"),
  getDownloadedNotes: () => apiCall("/notes/downloaded"),
  getNoteById: (id) => apiCall(`/notes/${id}`),
  createNote: (data) =>
    apiCall("/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getFilterOptions: () => apiCall("/notes/filters"),
  uploadNote: async (formData) => {
    try {
      return await apiCall("/notes", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      if (String(error.message).includes("Route not found")) {
        return apiCall("/notes/upload", {
          method: "POST",
          body: formData,
        });
      }
      throw error;
    }
  },
  updateNote: (id, data) =>
    apiCall(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updateNoteWithFile: (id, formData) =>
    apiCall(`/notes/${id}`, {
      method: "PUT",
      body: formData,
    }),
  deleteNote: (id) =>
    apiCall(`/notes/${id}`, {
      method: "DELETE",
    }),
  saveNote: (id) =>
    apiCall(`/notes/${id}/save`, {
      method: "POST",
    }),
  unsaveNote: (id) =>
    apiCall(`/notes/${id}/save`, {
      method: "DELETE",
    }),
  recordDownload: (id) =>
    apiCall(`/notes/${id}/download`, {
      method: "POST",
    }),
  likeNote: (id) =>
    apiCall(`/notes/${id}/like`, {
      method: "POST",
    }),
};



export const searchAPI = {
  globalSearch: (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return apiCall(`/search?${queryString}`);
  },
};

// Users APIs
export const usersAPI = {
  getUserProfile: (id) => apiCall(`/users/${id}`),
  getUserStats: (id) => apiCall(`/users/${id}/stats`),
  updateProfile: (id, data) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
