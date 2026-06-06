import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

const MOCK_USERS = {
  "volunteer@test.com": { id: 1, role: "volunteer", name: "Тест Волонтёр" },
  "curator@test.com":   { id: 2, role: "curator",   name: "Тест Куратор"  },
  "owner@test.com":     { id: 3, role: "owner",     name: "Тест Владелец" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  const login = async (emailOrPhone, password) => {
    if (import.meta.env.DEV && MOCK_USERS[emailOrPhone]) {
      const user = MOCK_USERS[emailOrPhone];
      localStorage.setItem("token", "mock-token-" + user.role);
      setUser(user);
      return user;
    }
    
    try {
      const data = await api.login(emailOrPhone, password);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}