const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  async getAnimals() {
    const res = await fetch(`${API_URL}/api/animals`);
    return res.json();
  },

  async getTasks() {
    const res = await fetch(`${API_URL}/api/tasks`);
    return res.json();
  }
};