import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const CATEGORIES = ["Все категории", "Перевозка", "Выгул", "Ремонт", "Уборка"];
const DISTANCES  = ["Любая дистанция", "До 3 км", "До 5 км", "До 10 км"];

function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white animate-pulse space-y-2">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

const ICON_MAP = {
  delivery: "🚚",
  walking:  "🐕",
  fix:      "🔧",
  cleaning: "🧹",
  transport:"🚗",
  photo:    "📷",
};

function distanceMatches(dist, filter) {
  if (filter === "Любая дистанция") return true;
  const km = parseFloat(dist);
  if (isNaN(km)) return true;
  if (filter === "До 3 км")  return km <= 3;
  if (filter === "До 5 км")  return km <= 5;
  if (filter === "До 10 км") return km <= 10;
  return true;
}

function categoryMatches(task, filter) {
  if (filter === "Все категории") return true;
  const cat = ((task.extraData?.category) ?? task.icon ?? "").toLowerCase();
  const f   = filter.toLowerCase();
  return cat.includes(f);
}

const formatDistance = (distance) => {
  if (distance === null || distance === undefined) return null;
  if (distance < 1) {
    return `${Math.round(distance * 1000)} м`;
  }
  return `${distance} км`;
};

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [category, setCategory] = useState("Все категории");
  const [distance, setDistance] = useState("Любая дистанция");

  useEffect(() => {
    api.getTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tasks.filter(
    (t) => categoryMatches(t, category) && distanceMatches(t.distance, distance)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Все задачи</h1>
          <p className="text-gray-500">Помощь нужна прямо сейчас. Выберите задачу по душе.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
          >
            {DISTANCES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="text-center py-16 text-red-500">{error}</div>}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm">Задач по этим фильтрам не найдено</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {ICON_MAP[task.icon] ?? "📋"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.shelter}</p>
                </div>
              </div>
              {task.distance !== null && task.distance !== undefined && (
                <p className="text-xs text-green-700">📍 {formatDistance(task.distance)} от вас</p>
              )}
              <button
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="text-sm text-green-700 hover:underline text-left mt-1"
              >
                Посмотреть задачу →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}