import { useState } from "react";

const recommendedTasks = [
  { id: 1, icon: "🥫", name: "Доставить корм в приют", shelter: 'Приют "Добрые руки"', dist: "2.3 км" },
  { id: 2, icon: "🐕", name: "Выгулять собак", shelter: 'Приют "Счастливый хвост"', dist: "4.1 км" },
  { id: 3, icon: "📷", name: "Сделать фото животных", shelter: 'Приют "Новый дом"', dist: "3.2 км" },
  { id: 4, icon: "🔧", name: "Помочь с ремонтом", shelter: 'Приют "Добрые руки"', dist: "2.3 км" },
];

const animals = [
  { id: 1, emoji: "🐕", name: "Рекс", age: "3 года", dist: "2.1 км" },
  { id: 2, emoji: "🐈", name: "Мурка", age: "1 год", dist: "3.5 км" },
  { id: 3, emoji: "🐕", name: "Бобик", age: "5 лет", dist: "1.8 км" },
  { id: 4, emoji: "🐈", name: "Снежок", age: "2 года", dist: "4.2 км" },
];

const urgentTasks = [
  {
    id: 1,
    title: "Срочно нужна помощь с транспортировкой",
    shelter: 'Приют "Добрые руки"',
    time: "Сегодня, 14:00 • ул. Мира, 28",
  },
  {
    id: 2,
    title: "Требуется ветеринарная помощь",
    shelter: 'Приют "Счастливый хвост"',
    time: "Сегодня, 16:30 • пр. Мира, 123",
  },
];

const filters = ["Рекомендации", "Рядом", "Срочные", "Мои задачи"];

export default function VolunteerDashboard() {
  const [activeFilter, setActiveFilter] = useState("Рекомендации");

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      {/* Filter bar — same max-w and px as HeaderAuth */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-[1.5px] whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                  : "bg-white border-[#e0e0e0] text-[#616161] hover:border-[#3a7d44] hover:text-[#3a7d44]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content — same max-w as HeaderAuth */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Recommended tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#212121]">
              Рекомендовано для вас
            </h2>
            <button className="text-sm font-bold text-[#3a7d44] hover:underline">
              Все →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommendedTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-2xl mb-3">
                  {t.icon}
                </div>
                <p className="text-sm font-bold text-[#212121] mb-1 leading-snug">
                  {t.name}
                </p>
                <p className="text-xs text-[#9e9e9e] mb-1">{t.shelter}</p>
                <p className="text-xs text-[#616161] mb-3 flex items-center gap-1">
                  <span className="text-[#e53935]">♥</span> {t.dist}
                </p>
                <button className="bg-[#e8f5e9] text-[#3a7d44] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#3a7d44] hover:text-white transition-colors">
                  Взять →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Animals nearby */}
        <section>
          <h2 className="text-xl font-extrabold text-[#212121] mb-4">
            Животные рядом
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {animals.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="w-full h-32 bg-[#f5f5f5] flex items-center justify-center text-5xl">
                  {a.emoji}
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-extrabold text-[#212121]">{a.name}</p>
                  <p className="text-xs text-[#9e9e9e] mb-1">{a.age}</p>
                  <p className="text-xs text-[#616161] flex items-center gap-1">
                    <span className="text-[#e53935]">♥</span> {a.dist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Urgent tasks */}
        <section>
          <h2 className="text-xl font-extrabold text-[#212121] mb-4">
            Срочные задачи
          </h2>
          <div className="flex flex-col gap-3">
            {urgentTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
              >
                <div className="flex items-center gap-2 bg-[#fff8e1] text-[#f9a825] text-xs font-extrabold px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                  <span>⚠</span> Срочно
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#212121]">{t.title}</p>
                  <p className="text-xs text-[#9e9e9e] mt-0.5">{t.time}</p>
                </div>
                <button className="bg-[#3a7d44] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors whitespace-nowrap shrink-0">
                  Откликнуться
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}