import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const FILTERS = ["Рекомендации", "Рядом", "Срочные", "Мои задачи"];

const ICON_MAP = { delivery: "🥫", walking: "🐕", fix: "🔧", photo: "📷", cleaning: "🧹", transport: "🚗" };

function TaskSkeletons() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-gray-200 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  ));
}

function AnimalSkeletons() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-32 bg-gray-200" />
      <div className="px-4 py-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  ));
}

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("Рекомендации");

  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loadingT, setLoadingT] = useState(true);
  const [loadingA, setLoadingA] = useState(true);

  useEffect(() => {
    api.getTasks()
      .then(tasks => tasks.filter(t => t.status === "open"))
      .then(setTasks)
      .catch(err => console.error('Ошибка загрузки задач:', err))
      .finally(() => setLoadingT(false));
    
    api.getMyActiveTasks()
      .then(res => setMyTasks(res.data || []))
      .catch(err => console.error('Ошибка загрузки моих задач:', err));
    
    api.getAnimals()
      .then(setAnimals)
      .catch(err => console.error('Ошибка загрузки животных:', err))
      .finally(() => setLoadingA(false));
  }, []);

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "Срочные":
        return tasks.filter(t => t.isUrgent === true);
      case "Мои задачи":
        return myTasks;
      case "Рядом":
        // TODO: добавить фильтрацию по расстоянию, когда будет готово
        return tasks;
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const urgentTasks = tasks.filter(t => t.isUrgent === true).slice(0, 2);
  const recommended = filteredTasks.slice(0, 4);
  const displayTasks = activeFilter === "Мои задачи" ? filteredTasks : recommended;

  const emoji = (type) => {
    const t = (type ?? "").toLowerCase();
    if (t.includes("кош") || t.includes("кот")) return "🐈";
    if (t.includes("собак") || t.includes("пёс")) return "🐕";
    return "🐾";
  };

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#212121]">
              {activeFilter === "Мои задачи" ? "Мои задачи" : "Рекомендовано для вас"}
            </h2>
            {activeFilter !== "Мои задачи" && (
              <button onClick={() => navigate("/tasks-page")} className="text-sm font-bold text-[#3a7d44] hover:underline">
                Все →
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loadingT ? (
              <TaskSkeletons />
            ) : displayTasks.length === 0 ? (
              <p className="col-span-4 text-sm text-[#9e9e9e]">
                {activeFilter === "Мои задачи" ? "У вас нет активных задач" : "Задач пока нет"}
              </p>
            ) : (
              displayTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/tasks/${t.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-2xl mb-3">
                    {t.icon ?? "📋"}
                  </div>
                  <p className="text-sm font-bold text-[#212121] mb-1 leading-snug">{t.title}</p>
                  <p className="text-xs text-[#9e9e9e] mb-1">{t.shelter}</p>
                  <button className="bg-[#e8f5e9] text-[#3a7d44] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#3a7d44] hover:text-white transition-colors">
                    {activeFilter === "Мои задачи" ? "В работе →" : "Взять →"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-[#212121]">Животные рядом</h2>
            <button onClick={() => navigate("/animals-page")} className="text-sm font-bold text-[#3a7d44] hover:underline">
              Все →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loadingA ? (
              <AnimalSkeletons />
            ) : animals.length === 0 ? (
              <p className="col-span-4 text-sm text-[#9e9e9e]">Животных пока нет</p>
            ) : (
              animals.slice(0, 4).map((a) => {
                const extra = a.extraData ?? {};
                return (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/animals/${a.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="w-full h-32 bg-[#f5f5f5] flex items-center justify-center text-5xl">
                      {extra.emoji ?? emoji(a.type)}
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-extrabold text-[#212121]">{a.name}</p>
                      <p className="text-xs text-[#9e9e9e]">{a.age}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {activeFilter !== "Мои задачи" && urgentTasks.length > 0 && (
          <section>
            <h2 className="text-xl font-extrabold text-[#212121] mb-4">Срочные задачи</h2>
            <div className="flex flex-col gap-3">
              {urgentTasks.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
                  <div className="flex items-center gap-2 bg-[#fff8e1] text-[#f9a825] text-xs font-extrabold px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                    <span>⚠</span> Срочно
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#212121]">{t.title}</p>
                    <p className="text-xs text-[#9e9e9e] mt-0.5">{t.shelter}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/tasks/${t.id}`)}
                    className="bg-[#3a7d44] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#5a9e66] transition-colors whitespace-nowrap shrink-0"
                  >
                    Откликнуться
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}