import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconShelter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconTasks = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconAnimals = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);
const IconAddTask = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconAddAnimal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TASKS = [
  { id: 1, name: "Доставить корм",  status: "new",     statusLabel: "Новая"    },
  { id: 2, name: "Выгул собак",     status: "active",  statusLabel: "В работе" },
];

const STATUS_STYLES = {
  new:    "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
  done:   "bg-green-100 text-green-700",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Дашборд",           icon: <IconDashboard />, to: "/dashboard/curator" },
  { label: "Мой приют",         icon: <IconShelter />,   to: "/shelter" },
  { label: "Задачи",            icon: <IconTasks />,     to: "/tasks" },
  { label: "Животные",          icon: <IconAnimals />,   to: "/animals-page" },
  { label: "Создать задачу",    icon: <IconAddTask />,   to: "/tasks/new" },
  { label: "Добавить животное", icon: <IconAddAnimal />, to: "/animals/new" },
  { label: "Чаты",              icon: <IconChat />,      to: "/chats" },
];

function Sidebar({ active }) {
  return (
    <aside className="w-[200px] shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-56px)]">
      <nav className="py-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-green-50 text-green-800 font-medium border-r-2 border-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={isActive ? "text-green-700" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function CuratorDashboard() {
  const { user } = useAuth();

  const shelterName = "Добрые руки"; // захардкожено, потом из API

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-gray-50">
      <Sidebar active="Дашборд" />

      <main className="flex-1 px-8 py-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Добро пожаловать, {user?.name?.split(" ")[0] ?? "Куратор"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Вы куратор приюта «{shelterName}»</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: "12", label: "Активных задач" },
            { value: "47", label: "Выполненных задач" },
            { value: "24", label: "Свободных волонтёров в районе" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl px-6 py-5">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tasks table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Задачи приюта</h2>
            <button className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              + Создать задачу
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Название</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Статус</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task) => (
                <tr key={task.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-800">{task.name}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[task.status]}`}>
                      {task.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                      <IconEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}