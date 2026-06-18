import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const SPECIES_FILTER = ["Все виды", "Собаки", "Кошки"];
const AGE_FILTERS    = ["Возраст", "До 1 года", "1–3 года", "Старше 3 лет"];
const SIZE_FILTERS   = ["Размер", "Маленький", "Средний", "Крупный"];

function ageMatches(animalAge, filter) {
  if (filter === "Возраст") return true;
  const num = parseFloat(animalAge);
  if (isNaN(num)) return true;
  if (filter === "До 1 года")    return num < 1;
  if (filter === "1–3 года")     return num >= 1 && num <= 3;
  if (filter === "Старше 3 лет") return num > 3;
  return true;
}

function typeMatches(animalType, filter) {
  if (filter === "Все виды") return true;
  const t = (animalType ?? "").toLowerCase();
  if (filter === "Собаки") return t.includes("собак") || t.includes("пёс") || t.includes("dog");
  if (filter === "Кошки")  return t.includes("кош")  || t.includes("кот") || t.includes("cat");
  return true;
}

function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="bg-gray-200 h-36" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function AnimalsPage() {
  const navigate = useNavigate();
  const [animals, setAnimals]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [speciesFilter, setSpecies] = useState("Все виды");
  const [ageFilter, setAge]         = useState("Возраст");
  const [sizeFilter, setSize]       = useState("Размер");

  useEffect(() => {
    api.getAnimals()
      .then(setAnimals)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = animals.filter(
    (a) => typeMatches(a.type, speciesFilter) && ageMatches(a.age, ageFilter)
  );

  const emoji = (type) => {
    const t = (type ?? "").toLowerCase();
    if (t.includes("кош") || t.includes("кот") || t.includes("cat")) return "🐱";
    if (t.includes("собак") || t.includes("пёс") || t.includes("dog")) return "🐕";
    return "🐾";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Животные</h1>
      <p className="text-gray-500 mb-6">Здесь вы можете найти себе верного друга. Они очень ждут вас.</p>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3 mb-8">
        {SPECIES_FILTER.map((s) => (
          <button
            key={s}
            onClick={() => setSpecies(s)}
            className={`border rounded-lg px-4 py-2 text-sm transition-colors ${
              speciesFilter === s
                ? "border-green-600 text-green-700 bg-green-50"
                : "border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-700"
            }`}
          >
            {s}
          </button>
        ))}
        <select
          value={ageFilter}
          onChange={(e) => setAge(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
        >
          {AGE_FILTERS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSize(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
        >
          {SIZE_FILTERS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {error && (
        <div className="text-center py-16 text-red-500">{error}</div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-sm">Животных по этим фильтрам не найдено</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((animal) => {
            const extra = animal.extraData ?? {};
            return (
              <div key={animal.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="bg-gray-100 h-36 flex items-center justify-center text-5xl">
                  {extra.emoji ?? emoji(animal.type)}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900">{animal.name}</p>
                  <p className="text-sm text-gray-500 mb-1">{animal.age}{extra.breed ? `, ${extra.breed}` : ""}</p>
                  <p className="text-xs text-gray-400 mb-3">📍 {extra.shelter ?? animal.type ?? "—"}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/animals/${animal.id}`)}
                      className="text-sm text-green-700 hover:underline"
                    >
                      Подробнее →
                    </button>
                    <span className="text-xs text-green-600 font-medium">Ищет дом</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
