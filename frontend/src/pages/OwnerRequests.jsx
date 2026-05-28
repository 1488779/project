import { useState } from "react";

const TABS = ["Все", "Отправлены", "Подтверждены", "Отклонены", "Завершены"];

const STATUS_STYLES = {
  "Отправлена":    { text: "text-[#f57c00]", bg: "bg-[#fff3e0]" },
  "Подтверждена":  { text: "text-[#2e7d32]", bg: "bg-[#e8f5e9]" },
  "Отклонена":     { text: "text-[#c62828]", bg: "bg-[#ffebee]" },
  "Завершена":     { text: "text-[#616161]", bg: "bg-[#f5f5f5]" },
};

const REQUESTS = [
  { id: 1, title: "Передержка для собаки", volunteer: "Михаил", dates: "1–15 июня", status: "Отправлена" },
  { id: 2, title: "Передержка для кота",   volunteer: "Михаил", dates: "10–25 мая", status: "Подтверждена" },
  { id: 3, title: "Передержка для кошки",  volunteer: "Ольга",  dates: "20–30 апреля", status: "Отклонена" },
  { id: 4, title: "Передержка для щенка",  volunteer: "Сергей", dates: "1–10 марта", status: "Завершена" },
];

const TAB_FILTER = {
  "Все": () => true,
  "Отправлены": (r) => r.status === "Отправлена",
  "Подтверждены": (r) => r.status === "Подтверждена",
  "Отклонены": (r) => r.status === "Отклонена",
  "Завершены": (r) => r.status === "Завершена",
};

export default function OwnerRequests() {
  const [activeTab, setActiveTab] = useState("Все");
  const [requests, setRequests] = useState(REQUESTS);

  const filtered = requests.filter(TAB_FILTER[activeTab]);

  const cancel = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-[#212121] mb-6">Мои заявки на передержку</h1>

        {/* Tabs */}
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

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center text-[#9e9e9e] text-sm">
              Заявок нет
            </div>
          )}
          {filtered.map((r) => {
            const s = STATUS_STYLES[r.status] || {};
            const canCancel = r.status === "Отправлена" || r.status === "Подтверждена";
            return (
              <div key={r.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
                <h2 className="text-base font-bold text-[#212121] mb-1">{r.title}</h2>
                <p className="text-sm text-[#616161] mb-1">Волонтёр: {r.volunteer} • {r.dates}</p>
                <p className="text-sm mb-4">
                  Статус:{" "}
                  <span className={`font-bold ${s.text}`}>{r.status}</span>
                </p>
                {canCancel && (
                  <button
                    onClick={() => cancel(r.id)}
                    className="px-5 py-2 rounded-xl border-[1.5px] border-[#e53935] text-[#e53935] text-sm font-bold hover:bg-[#ffebee] transition-colors"
                  >
                    Отменить
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}