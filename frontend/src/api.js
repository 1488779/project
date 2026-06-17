const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };
  
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  //AUTH 
  login: (emailOrPhone, password) => request("/api/auth/login", { 
    method: "POST", 
    body: JSON.stringify({ emailOrPhone, password }) 
  }),

  //ANIMALS
  getAnimals: () => request("/api/animals"),
  getAnimal: (id) => request(`/api/animals/${id}`),
  getAnimalsAdmin: () => request("/api/animals/all"),
  getAnimalsByModerationStatus: (status) => request(`/api/animals/moderation/${status}`),
  createAnimal: (data) => request("/api/animals", { method: "POST", body: JSON.stringify(data) }),
  updateAnimal: (id, data) => request(`/api/animals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAnimal: (id) => request(`/api/animals/${id}`, { method: "DELETE" }),
  approveAnimal: (id) => request(`/api/animals/${id}/approve`, { method: "PUT" }),
  rejectAnimal: (id) => request(`/api/animals/${id}/reject`, { method: "PUT" }),
  getSimilarAnimals: (id) => request(`/api/animals/similar/${id}`),
  adoptAnimal: (id) => request(`/api/animals/${id}/adopt`, { method: "PUT" }),

  //TASKS
  getTasks: () => request("/api/tasks"),
  getTask: (id) => request(`/api/tasks/${id}`),
  getTasksAdmin: () => request("/api/tasks/all"),
  getTasksByModerationStatus: (status) => request(`/api/tasks/moderation/${status}`),
  getMyCreatedTasks: () => request("/api/tasks/my"),
  createTask: (data) => request("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),
  approveTask: (id) => request(`/api/tasks/${id}/approve`, { method: "PUT" }),
  rejectTask: (id, reason) => request(`/api/tasks/${id}/reject`, { method: "PUT", body: JSON.stringify({ reason }) }),
  takeTask: (id, volunteerId) => request(`/api/tasks/${id}/take`, { method: "PUT", body: JSON.stringify({ volunteerId }) }),
  completeTask: (id) => request(`/api/tasks/${id}/complete`, { method: "PUT" }),
  getShelterTasks: () => request("/api/tasks/shelter"),

  //VOLUNTEERS
  getVolunteers: () => request("/api/volunteer"),
  getVolunteerById: (id) => request(`/api/volunteer/${id}`),
  registerVolunteer: (data) => request("/api/volunteer/register", { method: "POST", body: JSON.stringify(data) }),
  getMyProfile: () => request("/api/volunteer/profile/me"),
  updateMyProfile: (data) => request("/api/volunteer/profile/me", { method: "PUT", body: JSON.stringify(data) }),
  updateMySkills: (skills) => request("/api/volunteer/profile/skills", { method: "PUT", body: JSON.stringify({ skills }) }),
  getMyActiveTasks: () => request("/api/volunteer/tasks/active"),
  getMyHistory: () => request("/api/volunteer/history"),

  //CURATORS
  getCurators: () => request("/api/curator"),
  getCuratorById: (id) => request(`/api/curator/${id}`),
  createCuratorAccount: (data) => request("/api/curator/create-account", { method: "POST", body: JSON.stringify(data) }),
  completeCuratorWithNewShelter: (data) => request("/api/curator/complete-with-new-shelter", { method: "POST", body: JSON.stringify(data) }),
  completeCuratorWithExistingShelter: (data) => request("/api/curator/complete-with-existing-shelter", { method: "POST", body: JSON.stringify(data) }),

  //OWNERS
  getOwners: () => request("/api/owner"),
  getOwnerById: (id) => request(`/api/owner/${id}`),
  registerOwner: (data) => request("/api/owner/register", { method: "POST", body: JSON.stringify(data) }),

  //SHELTERS
  getShelters: () => request("/api/shelters"),

  // FOSTER
  createFosterRequest: (data) => request("/api/foster-requests", { method: "POST", body: JSON.stringify(data) }),
  getOwnerFosterRequests: () => request("/api/foster-requests/owner"),
  getVolunteerFosterRequests: () => request("/api/foster-requests/volunteer"),
  getMyActiveTasks: () => request("/api/tasks/my"),
  getFosterRequestById: (id) => request(`/api/foster-requests/${id}`),
  updateFosterRequestStatus: (id, status) => request(`/api/foster-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // NOTIFICATIONS
  getNotifications: () => request("/api/notifications"),
  markNotificationAsRead: (id) => request(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsAsRead: () => request("/api/notifications/read-all", { method: "PATCH" }),
  deleteNotification: (id) => request(`/api/notifications/${id}`, { method: "DELETE" }),

  //UPLOAD
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem('token');
    
    return fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    });
  },
};