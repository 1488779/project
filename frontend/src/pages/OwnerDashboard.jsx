import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const VOLUNTEERS = [
  { id: 1, name: "Екатерина", rating: 4.8, available: "Свободна с 10 по 25 мая" },
  { id: 2, name: "Михаил",    rating: 4.9, available: "Свободен после 1 июня"   },
];

const ANIMAL_TYPES = ["Собака", "Кошка", "Кролик", "Птица", "Другое"];
const DISTRICTS    = ["Центральный", "Юго-Западный", "Северный", "Ленинский", "Октябрьский"];

// ─── Star Icon ────────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ─── Volunteer Card ───────────────────────────────────────────────────────────

function VolunteerCard({ vol }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shrink-0">
          {vol.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{vol.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            Рейтинг {vol.rating} <StarIcon />
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{vol.available}</p>
        </div>
      </div>
      <button className="shrink-0 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
        Отправить заявку
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OwnerDashboard() {
  const [animalType, setAnimalType] = useState("Собака");
  const [days, setDays] = useState("14");
  const [needsMeds, setNeedsMeds] = useState(false);
  const [district, setDistrict] = useState("");
  const [searched, setSearched] = useState(true); // показываем результаты сразу

  const handleSearch = () => setSearched(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Поиск передержки для питомца</h1>

        {/* Search form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Тип животного */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Тип животного</label>
              <select
                value={animalType}
                onChange={e => setAnimalType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-green-500"
              >
                {ANIMAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Срок */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Срок передержки (дней)</label>
              <input
                type="number"
                value={days}
                onChange={e => setDays(e.target.value)}
                placeholder="14"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center mb-5">
            {/* Нужны лекарства */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={needsMeds}
                onChange={e => setNeedsMeds(e.target.checked)}
                className="accent-green-700 w-4 h-4"
              />
              Нужны лекарства?
            </label>

            {/* Район */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Район</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-green-500"
              >
                <option value="">Центральный</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors"
          >
            Найти
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Волонтёры с навыком «передержка»
            </h2>
            <div className="flex flex-col gap-3">
              {VOLUNTEERS.map(vol => (
                <VolunteerCard key={vol.id} vol={vol} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}