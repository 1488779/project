import { useState } from "react";
import { Link } from "react-router-dom";

const TABS = ["Все", "На рассмотрении", "Одобрены", "Отклонены"];

const STATUS_META = {
  "На рассмотрении": { emoji: "🟡", text: "На рассмотрении", textColor: "text-[#f57c00]", bg: "bg-[#fff3e0]" },
  "Одобрена":        { emoji: "✅", text: "Одобрена (опубликована как задача)", textColor: "text-[#2e7d32]", bg: "bg-[#e8f5e9]" },
  "Отклонена":       { emoji: "❌", text: "Отклонена", textColor: "text-[#c62828]", bg: "bg-[#ffebee]" },
};

const PROPOSALS = [
  {
    id: 1,
    title: "Организовать сбор корма и игрушек",
    created: "15.04.2026",
    category: "Сбор средств",
    description: 'Предлагаю собрать корм и игрушки для приюта "Добрые руки". Могу координировать сбор.',
    status: "На рассмотрении",
    rejectionReason: null,
    taskLink: null,
  },
  {
    id: 2,
    title: "Помощь в ветеринарной клинике по выходным",
    created: "10.04.2026",
    category: "Ветеринария",
    description: 'Могу бесплатно помогать в клинике "ВетДоктор" каждую субботу с 10 до 14.',
    status: "Одобрена",
    rejectionReason: null,
    taskLink: "/tasks/2",
  },
  {
    id: 3,
    title: "Мастер-класс по уходу за животными",
    created: "5.04.2026",
    category: null,
    description: "Хочу провести бесплатный мастер-класс для волонтёров по уходу за кошками.",
    status: "Отклонена",
    rejectionReason: "не относится к прямой помощи животным",
    taskLink: null,
  },
];

const TAB_FILTER = {
  "Все": () => true,
  "На рассмотрении": (p) => p.status === "На рассмотрении",
  "Одобрены": (p) => p.status === "Одобрена",
  "Отклонены": (p) => p.status === "Отклонена",
};

export default function VolunteerProposals() {
  const [activeTab, setActiveTab] = useState("Все");
  const [proposals, setProposals] = useState(PROPOSALS);
  const [showForm, setShowForm] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const filtered = proposals.filter(TAB_FILTER[activeTab]);
  const visible = showMore ? filtered : filtered.slice(0, 3);

  const revoke = (id) => setProposals((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
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

        {/* Tabs */}
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

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {visible.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">Заявок нет</div>
          )}
          {visible.map((p) => {
            const meta = STATUS_META[p.status];
            const isReview = p.status === "На рассмотрении";
            const isApproved = p.status === "Одобрена";
            const isRejected = p.status === "Отклонена";
            return (
              <div key={p.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-[#212121] mb-0.5">{p.title}</h2>
                    <p className="text-xs text-[#9e9e9e] mb-2">
                      Создана {p.created}{p.category ? ` • Категория: ${p.category}` : ""}
                    </p>
                    <p className="text-sm text-[#616161] mb-3">{p.description}</p>

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${meta.bg} ${meta.textColor}`}>
                      <span>{meta.emoji}</span>
                      <span>
                        {p.status === "Отклонена" && p.rejectionReason
                          ? `Отклонена • Причина: ${p.rejectionReason}`
                          : meta.text}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {isReview && (
                        <>
                          <button className="flex items-center gap-1.5 border border-gray-200 text-[#616161] text-sm px-4 py-1.5 rounded-lg hover:border-[#3a7d44] hover:text-[#3a7d44] transition-colors">
                            ✏️ Редактировать
                          </button>
                          <button
                            onClick={() => revoke(p.id)}
                            className="flex items-center gap-1.5 border border-gray-200 text-[#616161] text-sm px-4 py-1.5 rounded-lg hover:border-[#e53935] hover:text-[#e53935] transition-colors"
                          >
                            🗑️ Отозвать
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isApproved && p.taskLink && (
                    <Link
                      to={p.taskLink}
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

        {/* Show more */}
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

        {/* Propose task modal (simple) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-extrabold text-[#212121] mb-4">Предложить задачу</h2>
              <div className="flex flex-col gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Название задачи"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
                <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#616161] outline-none">
                  <option>Категория</option>
                  <option>Транспорт</option>
                  <option>Ветеринария</option>
                  <option>Сбор средств</option>
                  <option>Уборка</option>
                </select>
                <textarea
                  placeholder="Опишите идею задачи..."
                  rows={3}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-[#616161] text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-[#3a7d44] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}