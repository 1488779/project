import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Формируем уведомления из реальных данных: задачи волонтёра
    const load = async () => {
      try {
        setLoading(true);
        const tasks = await api.getTasks();

        // Строим уведомления из задач, относящихся к текущему пользователю
        const items = tasks
          .filter((t) =>
            t.volunteerId === user.volunteerId ||
            t.curatorId === user.curatorId ||
            t.shelterId === user.shelterId ||
            true // показываем все одобренные задачи как информационные
          )
          .slice(0, 20)
          .map((t) => {
            let type = "info";
            let icon = "📋";
            if (t.moderationStatus === "approved") { type = "success"; icon = "✅"; }
            if (t.moderationStatus === "rejected") { type = "error"; icon = "❌"; }
            return {
              id: t.id,
              type,
              icon,
              title: t.title,
              body: t.description
                ? t.description.slice(0, 80) + (t.description.length > 80 ? "…" : "")
                : `Статус: ${t.moderationStatus ?? t.status}`,
              time: new Date(t.createdAt).toLocaleDateString("ru-RU"),
              read: false,
              link: `/tasks/${t.id}`,
            };
          });

        setNotifs(items);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const unreadCount = notifs.filter((n) => !n.read).length;

  const borderColor = (type) => {
    if (type === "success") return "border-l-[#3a7d44]";
    if (type === "error") return "border-l-[#e53935]";
    return "border-l-transparent";
  };

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-[#212121]">
            Уведомления
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-bold bg-[#3a7d44] text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl px-5 py-4 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl p-6 text-center text-[#e53935] text-sm">
            Ошибка загрузки: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-3">
            {notifs.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  navigate(n.link);
                }}
                className={`w-full text-left bg-white rounded-2xl px-5 py-4 shadow-sm border-l-4 ${borderColor(
                  n.type
                )} hover:shadow-md transition-all ${n.read ? "opacity-80" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 shrink-0">{n.icon}</span>
                    <div>
                      <p
                        className={`text-sm mb-0.5 ${
                          n.read ? "font-medium text-[#616161]" : "font-bold text-[#212121]"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-[#9e9e9e] leading-relaxed">{n.body}</p>
                      <p className="text-xs text-[#bdbdbd] mt-1.5">{n.time}</p>
                    </div>
                  </div>
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3a7d44] shrink-0 mt-1.5" />
                  )}
                </div>
              </button>
            ))}

            {notifs.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">
                Нет уведомлений
              </div>
            )}
          </div>
        )}

        {unreadCount > 0 && (
          <div className="text-center mt-5">
            <button
              onClick={markAllRead}
              className="text-sm text-[#3a7d44] font-bold hover:underline"
            >
              Отметить все как прочитанные →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
