import { createContext, useContext, useState, useEffect } from "react";

const MOCK_USERS = [
  { id: 1, name: "Иван Петров",     email: "volunteer@test.com", password: "1234", role: "volunteer" },
  { id: 2, name: "Мария Иванова",   email: "curator@test.com",   password: "1234", role: "curator"   },
  { id: 3, name: "Алексей Смирнов", email: "owner@test.com",     password: "1234", role: "owner"     },
];

const AuthContext = createContext(null);

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

  const login = (emailOrUser, password) => {
    // Если передан объект — это реальный юзер от сервера или из формы регистрации
    if (typeof emailOrUser === "object" && emailOrUser !== null) {
      setUser(emailOrUser);
      return emailOrUser;
    }

    // Иначе ищем в моках по email + password
    const found = MOCK_USERS.find(
      (u) => u.email === emailOrUser && u.password === password
    );
    if (!found) throw new Error("Неверный email или пароль");
    setUser(found);
    return found;
  };

  const logout = () => setUser(null);

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