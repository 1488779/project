import { useState } from "react";
import { Link } from "react-router-dom";

const TABS = ["Все", "Ожидают", "Одобрены", "Отклонены"];

const TASKS = [
  {
    id: 1,
    title: "Доставить корм",
    created: "2 дня назад",
    status: "pending",
    volunteer: null,
  },
  {
    id: 2,
    title: "Выгул собак",
    created: "вчера",
    status: "approved",
    volunteer: "Иван П.",
  },
  {
    id: 3,
    title: "Ремонт вольера",
    created: "3 дня назад",
    status: "rejected",
    volunteer: null,
  },
];

const STATUS_META = {
  pending:  { label: "На модерации", emoji: "🟡", textColor: "text-[#f57c00]", bg: "bg-[#fff3e0]" },
  approved: { label: "Одобрена",     emoji: "✅", textColor: "text-[#2e7d32]", bg: "bg-[#e8f5e9]" },
  rejected: { label: "Отклонена",    emoji: "❌", textColor: "text-[#c62828]", bg: "bg-[#ffebee]" },
};

const TAB_FILTER = {
  "Все":       () => true,
  "Ожидают":   (t) => t.status === "pending",
  "Одобрены":  (t) => t.status === "approved",
  "Отклонены": (t) => t.status === "rejected",
};

export default function CuratorTasks() {
  const [activeTab, setActiveTab] = useState("Все");
  const [tasks, setTasks] = useState(TASKS);

  const filtered = tasks.filter(TAB_FILTER[activeTab]);

  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-[#212121]">Мои задачи</h1>
          <Link
            to="/tasks/new"
            className="bg-[#3a7d44] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors"
          >
            + Создать задачу
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
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

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">
              Задач нет
            </div>
          )}
          {filtered.map((t) => {
            const meta = STATUS_META[t.status];
            return (
              <div key={t.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-[#212121] mb-0.5">{t.title}</h2>
                  <p className="text-xs text-[#9e9e9e] mb-2">Создана {t.created}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.textColor}`}>
                      <span>{meta.emoji}</span> {meta.label}
                    </span>
                    {t.volunteer && (
                      <span className="text-xs text-[#9e9e9e]">• Волонтёр: {t.volunteer}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.status === "pending" && (
                    <>
                      <button
                        onClick={() => remove(t.id)}
                        className="px-4 py-2 rounded-xl border-[1.5px] border-[#e0e0e0] text-[#616161] text-sm font-bold hover:border-[#e53935] hover:text-[#e53935] transition-colors"
                      >
                        Снять
                      </button>
                      <Link
                        to={`/tasks/${t.id}/edit`}
                        className="px-4 py-2 rounded-xl border-[1.5px] border-[#e0e0e0] text-[#616161] text-sm font-bold hover:border-[#3a7d44] hover:text-[#3a7d44] transition-colors"
                      >
                        Редактировать
                      </Link>
                    </>
                  )}
                  {t.status === "approved" && (
                    <button
                      onClick={() => remove(t.id)}
                      className="px-4 py-2 rounded-xl border-[1.5px] border-[#e0e0e0] text-[#e53935] text-sm font-bold hover:border-[#e53935] transition-colors"
                    >
                      Закрыть
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}