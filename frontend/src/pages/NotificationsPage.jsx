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
    
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getNotifications();
        setNotifs(response.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error("Ошибка:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Ошибка:", e);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Ошибка:", e);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'task_completed': return '✅';
      case 'task_assigned': return '📋';
      case 'task_taken': return '👤';
      case 'task_approved': return '✅';
      case 'task_rejected': return '❌';
      case 'foster_request': return '🏠';
      case 'foster_approved': return '✅';
      case 'foster_rejected': return '❌';
      case 'foster_completed': return '🏁';
      case 'animal_approved': return '✅';
      case 'animal_rejected': return '❌';
      case 'animal_adopted': return '🏠';
      case 'new_task': return '📋';
      case 'urgent_task': return '🚨';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'task_completed': return 'border-l-[#3a7d44]';
      case 'task_approved': return 'border-l-[#3a7d44]';
      case 'foster_approved': return 'border-l-[#3a7d44]';
      case 'foster_completed': return 'border-l-[#3a7d44]';
      case 'animal_approved': return 'border-l-[#3a7d44]';
      case 'animal_adopted': return 'border-l-[#3a7d44]';
      case 'task_assigned': return 'border-l-[#1565c0]';
      case 'task_taken': return 'border-l-[#1565c0]';
      case 'new_task': return 'border-l-[#1565c0]';
      case 'reminder': return 'border-l-[#1565c0]';
      case 'foster_request': return 'border-l-[#f57c00]';
      case 'task_rejected': return 'border-l-[#e53935]';
      case 'foster_rejected': return 'border-l-[#e53935]';
      case 'animal_rejected': return 'border-l-[#e53935]';
      case 'urgent_task': return 'border-l-[#e53935]';
      default: return 'border-l-transparent';
    }
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
              <div
                key={n.id}
                className={`bg-white rounded-2xl px-5 py-4 shadow-sm border-l-4 ${getBorderColor(n.type)} hover:shadow-md transition-all ${n.isRead ? "opacity-80" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => handleNotificationClick(n)}
                    className="flex-1 text-left flex items-start gap-3"
                  >
                    <span className="text-lg mt-0.5 shrink-0">{getIcon(n.type)}</span>
                    <div>
                      <p className={`text-sm mb-0.5 ${n.isRead ? "font-medium text-[#616161]" : "font-bold text-[#212121]"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-[#9e9e9e] leading-relaxed">{n.body}</p>
                      <p className="text-xs text-[#bdbdbd] mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              </div>
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
              onClick={markAllAsRead}
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