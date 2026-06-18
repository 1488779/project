// Универсальный хедер для всех авторизованных ролей

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABELS = {
  volunteer: "Волонтёр",
  curator: "Куратор",
  owner: "Владелец",
};

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
      <span className="text-white text-sm font-bold">🐾</span>
    </div>
    <span className="font-semibold text-gray-900 text-base">Лапа Помощи</span>
  </div>
);

export default function HeaderAuth() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <button className="flex items-center gap-1 text-gray-600 text-sm hover:text-gray-900 transition-colors">
            <MapPinIcon />
            <span>Екатеринбург</span>
            <ChevronDownIcon />
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          <Link to="/about-project" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">О проекте</Link>
          <Link to="/shelters-page" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Приюты</Link>
          <Link to="/animals-page" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Животные</Link>
          <Link to="/how-to-help" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Как помочь</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <UserIcon />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{ROLE_LABELS[user?.role] ?? user?.role}</p>
                </div>
                {user?.role === "volunteer" && (
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                    Мой профиль
                  </Link>
                )}
                {user?.role === "owner" && (
                  <Link to="/owner/requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                    Мои заявки
                  </Link>
                )}
                {user?.role === "curator" && (
                  <Link to="/curator/tasks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                    Мои задачи
                  </Link>
                )}
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                  Дашборд
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                  Выйти
                </button>
              </div>
            )}
          </div>

          <Link to="/notifications" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
            <BellIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link to="/chat" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Чат">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </Link>
        </div>
      </div>
    </header>
  );
}