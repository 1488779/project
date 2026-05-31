const BASE = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Animals
  getAnimals: ()       => request("/api/animals"),
  getAnimal:  (id)     => request(`/api/animals/${id}`),

  // Tasks
  getTasks:   ()       => request("/api/tasks"),
  getTask:    (id)     => request(`/api/tasks/${id}`),

  // Volunteers
  getVolunteers:   ()  => request("/api/volunteer"),
  getVolunteerById:(id)=> request(`/api/volunteer/${id}`),

  // Curators
  getCurators:     ()  => request("/api/curator"),
  getCuratorById:  (id)=> request(`/api/curator/${id}`),

  // Shelters
  getShelters:     ()  => request("/api/shelters"),

  //Auth 
  login: (emailOrPhone, password) => request("/api/auth/login", { 
    method: "POST", 
    body: JSON.stringify({ emailOrPhone, password }) 
  }),
};
