import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = ["Все", "На рассмотрении", "Одобрены", "Отклонены"];

const STATUS_META = {
  pending:  { emoji: "🟡", text: "На рассмотрении", textColor: "text-[#f57c00]", bg: "bg-[#fff3e0]" },
  approved: { emoji: "✅", text: "Одобрена (опубликована как задача)", textColor: "text-[#2e7d32]", bg: "bg-[#e8f5e9]" },
  rejected: { emoji: "❌", text: "Отклонена", textColor: "text-[#c62828]", bg: "bg-[#ffebee]" },
};

const TAB_FILTER = {
  "Все":              () => true,
  "На рассмотрении":  (p) => p.moderationStatus === "pending",
  "Одобрены":         (p) => p.moderationStatus === "approved",
  "Отклонены":        (p) => p.moderationStatus === "rejected",
};

const CATEGORIES = ["Транспорт", "Ветеринария", "Сбор средств", "Уборка", "Выгул", "Другое"];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("ru-RU");
  } catch { return iso; }
}

export default function VolunteerProposals() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Все");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      // Загружаем задачи, предложенные волонтёром (все статусы)
      const data = await api.getAllTasksAdmin();
      // Фильтруем по volunteerId если есть в данных
      const mine = user?.volunteerId
        ? data.filter((t) => t.volunteerId === user.volunteerId)
        : data;
      setProposals(mine);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const revoke = async (id) => {
    if (!window.confirm("Отозвать заявку?")) return;
    try {
      await api.deleteTask(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Ошибка: " + e.message);
    }
  };

  const submitProposal = async () => {
    if (!form.title.trim()) { setFormError("Введите название"); return; }
    setSubmitting(true);
    setFormError("");
    try {
      const newTask = await api.createTask({
        title: form.title,
        category: form.category || "Другое",
        description: form.description,
        volunteerId: user?.volunteerId,
      });
      setProposals((prev) => [newTask, ...prev]);
      setShowForm(false);
      setForm({ title: "", category: "", description: "" });
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = proposals.filter(TAB_FILTER[activeTab]);
  const visible = showMore ? filtered : filtered.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#212121]">Мои заявки</h1>
            <p className="text-sm text-[#616161] mt-1 max-w-sm">
              Предложенные вами идеи задач. После проверки администратором они могут стать доступны другим волонтёрам.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 bg-[#3a7d44] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors whitespace-nowrap"
          >
            + Предложить задачу
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-5 mb-5">
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
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl px-6 py-5 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
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
            {visible.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">Заявок нет</div>
            )}
            {visible.map((p) => {
              const meta = STATUS_META[p.moderationStatus] || STATUS_META.pending;
              const isReview = p.moderationStatus === "pending";
              const isApproved = p.moderationStatus === "approved";
              return (
                <div key={p.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-[#212121] mb-0.5">{p.title}</h2>
                      <p className="text-xs text-[#9e9e9e] mb-2">
                        Создана {formatDate(p.createdAt)}{p.category ? ` • Категория: ${p.category}` : ""}
                      </p>
                      {p.description && (
                        <p className="text-sm text-[#616161] mb-3">{p.description}</p>
                      )}

                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${meta.bg} ${meta.textColor}`}>
                        <span>{meta.emoji}</span>
                        <span>
                          {p.moderationStatus === "rejected" && p.rejectionReason
                            ? `Отклонена • Причина: ${p.rejectionReason}`
                            : meta.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {isReview && (
                          <button
                            onClick={() => revoke(p.id)}
                            className="flex items-center gap-1.5 border border-gray-200 text-[#616161] text-sm px-4 py-1.5 rounded-lg hover:border-[#e53935] hover:text-[#e53935] transition-colors"
                          >
                            🗑️ Отозвать
                          </button>
                        )}
                      </div>
                    </div>

                    {isApproved && (
                      <Link
                        to={`/tasks/${p.id}`}
                        className="shrink-0 text-sm text-[#3a7d44] font-bold hover:underline whitespace-nowrap"
                      >
                        Посмотреть задачу →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 3 && (
          <div className="text-center mt-5">
            <button
              onClick={() => setShowMore((v) => !v)}
              className="text-sm text-[#3a7d44] font-bold hover:underline"
            >
              {showMore ? "Скрыть ↑" : "Показать ещё →"}
            </button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-extrabold text-[#212121] mb-4">Предложить задачу</h2>
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Название задачи"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#616161] outline-none"
                >
                  <option value="">Категория</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <textarea
                  placeholder="Опишите идею задачи..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
                {formError && <p className="text-xs text-[#e53935]">{formError}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowForm(false); setFormError(""); }}
                  className="flex-1 border border-gray-200 text-[#616161] text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={submitProposal}
                  disabled={submitting}
                  className="flex-1 bg-[#3a7d44] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors disabled:opacity-60"
                >
                  {submitting ? "Отправка..." : "Отправить"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
