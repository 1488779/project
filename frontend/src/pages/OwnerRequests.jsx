import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = ["Все", "Открытые", "В работе", "Завершены"];

const STATUS_STYLES = {
  open:        { label: "Открыта",      text: "text-[#f57c00]", bg: "bg-[#fff3e0]" },
  in_progress: { label: "В работе",     text: "text-[#1565c0]", bg: "bg-[#e3f2fd]" },
  done:        { label: "Завершена",    text: "text-[#616161]", bg: "bg-[#f5f5f5]" },
  cancelled:   { label: "Отменена",    text: "text-[#c62828]", bg: "bg-[#ffebee]" },
};

const TAB_FILTER = {
  "Все":       () => true,
  "Открытые":  (r) => r.status === "open",
  "В работе":  (r) => r.status === "in_progress",
  "Завершены": (r) => r.status === "done",
};

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  } catch { return iso; }
}

export default function OwnerRequests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Все");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Загружаем все задачи приюта владельца
        const data = await api.getTasks();
        setTasks(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const cancelTask = async (id) => {
    if (!window.confirm("Отменить задачу?")) return;
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("Ошибка: " + e.message);
    }
  };

  const filtered = tasks.filter(TAB_FILTER[activeTab]);

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-[#212121] mb-6">Мои задачи</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-[1.5px] transition-all ${
                activeTab === tab
                  ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                  : "bg-white border-[#e0e0e0] text-[#616161] hover:border-[#3a7d44] hover:text-[#3a7d44]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl px-6 py-5 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl p-6 text-center text-[#e53935] text-sm">
            Ошибка: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">
                Задач нет
              </div>
            )}
            {filtered.map((r) => {
              const s = STATUS_STYLES[r.status] || STATUS_STYLES.open;
              const canCancel = r.status === "open";
              return (
                <div key={r.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
                  <h2 className="text-base font-bold text-[#212121] mb-1">{r.title}</h2>
                  <p className="text-sm text-[#616161] mb-1">
                    {r.shelter || "—"}
                    {r.date ? ` • ${formatDate(r.date)}` : ""}
                  </p>
                  {r.address && (
                    <p className="text-sm text-[#9e9e9e] mb-1">📍 {r.address}</p>
                  )}
                  <p className="text-sm mb-4">
                    Статус:{" "}
                    <span className={`font-bold ${s.text}`}>{s.label}</span>
                  </p>
                  {canCancel && (
                    <button
                      onClick={() => cancelTask(r.id)}
                      className="px-5 py-2 rounded-xl border-[1.5px] border-[#e53935] text-[#e53935] text-sm font-bold hover:bg-[#ffebee] transition-colors"
                    >
                      Отменить
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
