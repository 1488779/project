import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL ?? "";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso; }
}

export default function VolunteerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login-page"); return; }

    const load = async () => {
      try {
        setLoading(true);
        // Загружаем профиль волонтёра
        const volId = user.volunteerId ?? user.id;
        const volData = await api.getVolunteerById(volId);
        setVolunteer(volData.data ?? volData);

        // Загружаем задачи волонтёра
        const allTasks = await api.getTasks();
        const myTasks = allTasks.filter((t) => t.volunteerId === volId);
        setActiveTasks(myTasks.filter((t) => t.status === "in_progress" || t.status === "open"));
        setDoneTasks(myTasks.filter((t) => t.status === "done"));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const completeTask = async (id) => {
    try {
      await api.completeTask(id);
      setActiveTasks((prev) => prev.filter((t) => t.id !== id));
      const task = activeTasks.find((t) => t.id === id);
      if (task) setDoneTasks((prev) => [{ ...task, status: "done" }, ...prev]);
    } catch (e) {
      alert("Ошибка: " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Загрузка профиля...</div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm">{error || "Профиль не найден"}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-green-600 hover:underline">← Назад</button>
      </div>
    );
  }

  const u = volunteer.user ?? volunteer;
  const name = u.fullName ?? u.name ?? "Волонтёр";
  const city = u.city ?? volunteer.city ?? "—";
  const avatar = u.avatar ?? volunteer.avatar ?? null;
  const skills = volunteer.skills ?? [];

  const stats = {
    tasks: doneTasks.length,
    hours: doneTasks.length * 2, // примерная оценка
    saved: Math.floor(doneTasks.length / 5),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Профиль */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl overflow-hidden">
              {avatar ? (
                <img
                  src={avatar.startsWith("http") ? avatar : `${BASE}/${avatar}`}
                  className="w-full h-full object-cover"
                  alt={name}
                />
              ) : "👤"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{name}</h1>
              <p className="text-sm text-gray-500">{city}</p>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: stats.tasks, label: "Выполнено задач" },
            { value: stats.hours, label: "Часов помощи" },
            { value: stats.saved, label: "Спасено животных" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Навыки */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Мои навыки</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Активные задачи */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Мои задачи</h2>
          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400 text-sm">
              Нет активных задач
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {activeTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.shelter ?? "—"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.date ? formatDate(task.date) : "Дата не указана"}
                      {" • "}
                      {task.status === "in_progress" ? "В работе" : "Открыта"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                    >
                      Завершить
                    </button>
                    <button
                      onClick={() => navigate("/chat")}
                      className="text-xs text-gray-500 hover:text-green-600 transition whitespace-nowrap"
                    >
                      ✉️ Написать куратору
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* История */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">История</h2>
          {doneTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400 text-sm">
              История пуста
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {doneTasks.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.shelter ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{formatDate(item.updatedAt ?? item.createdAt)}</p>
                    <p className="text-xs text-green-600 mt-0.5">✓ Завершено</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
