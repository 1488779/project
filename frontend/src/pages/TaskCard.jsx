import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f9a825" : "none"} stroke="#f9a825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function TaskCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Задача не найдена");
        return r.json();
      })
      .then((data) => { setTask(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#f2f3f1] flex items-center justify-center text-[#9e9e9e]">
      Загрузка...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f2f3f1] flex flex-col items-center justify-center gap-4">
      <p className="text-[#e53935]">{error}</p>
      <button onClick={() => navigate(-1)} className="text-sm text-[#3a7d44] hover:underline">← Назад</button>
    </div>
  );

  const extra    = task.extraData || {};
  const category      = extra.category      || "Задача";
  const categoryEmoji = extra.categoryEmoji || "📋";
  const rating        = extra.rating        || 0;
  const date          = extra.date          || "—";
  const timeFrom      = extra.timeFrom      || "";
  const timeTo        = extra.timeTo        || "";
  const address       = extra.address       || task.shelter || "—";
  const description   = extra.description  || "—";
  const skills        = extra.skills        || [];
  const photos        = extra.photos        || [];
  const contact       = extra.contact       || null;

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#616161] hover:text-[#3a7d44] transition-colors mb-6"
        >
          <BackIcon />
          Назад к задачам
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1">
            <div className="bg-[#f5f5f5] rounded-2xl w-full h-64 flex items-center justify-center text-[#9e9e9e] text-sm mb-3">
              📷 Фото задачи
            </div>
            {photos.length > 0 && (
              <div className="flex gap-2 mb-6">
                {photos.map((p, i) => (
                  <div key={i} className="w-20 h-20 bg-[#f5f5f5] rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:bg-[#e8f5e9] transition-colors">
                    {p}
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-lg font-extrabold text-[#212121] mb-2">Описание задачи</h2>
            <p className="text-sm text-[#616161] leading-relaxed mb-6">{description}</p>

            {skills.length > 0 && (
              <>
                <h2 className="text-lg font-extrabold text-[#212121] mb-2">Требуемые навыки</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="px-4 py-1.5 rounded-full border border-[#e0e0e0] text-sm text-[#616161]">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs text-[#9e9e9e] mb-1">{categoryEmoji} {category}</p>
              <h1 className="text-xl font-extrabold text-[#212121] mb-1">{task.title}</h1>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#3a7d44] font-medium">{task.shelter}</span>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => <StarIcon key={i} filled={i <= Math.floor(rating)} />)}
                  <span className="text-xs text-[#9e9e9e] ml-1">{rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {task.distance != null && (
                  <div className="flex items-start gap-2">
                    <span className="text-[#e53935] mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-[#9e9e9e]">Расстояние</p>
                      <p className="text-sm font-bold text-[#212121]">{task.distance} км от вас</p>
                    </div>
                  </div>
                )}
                {date !== "—" && (
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">📅</span>
                    <div>
                      <p className="text-xs text-[#9e9e9e]">Дата</p>
                      <p className="text-sm font-bold text-[#212121]">{date}</p>
                    </div>
                  </div>
                )}
                {timeFrom && (
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">⏰</span>
                    <div>
                      <p className="text-xs text-[#9e9e9e]">Время</p>
                      <p className="text-sm font-bold text-[#212121]">{timeFrom} – {timeTo}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <p className="text-xs text-[#9e9e9e] mb-1">Адрес</p>
                <p className="text-sm text-[#212121]">{address}</p>
              </div>

              <div className="bg-[#f5f5f5] rounded-xl h-24 flex items-center justify-center text-[#9e9e9e] text-sm mb-4">
                🗺️ Мини-карта
              </div>

              <button
                onClick={() => user ? null : navigate("/login-page")}
                className="w-full bg-[#3a7d44] text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
              >
                Взять задачу
              </button>
            </div>

            {contact && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs text-[#9e9e9e] mb-3">Контактное лицо</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#e8f5e9] flex items-center justify-center text-lg shrink-0">👤</div>
                  <div>
                    <p className="text-sm font-bold text-[#212121]">{contact.name}</p>
                    <p className="text-xs text-[#9e9e9e]">{contact.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/chat")}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#616161] text-sm py-2 rounded-xl hover:border-[#3a7d44] hover:text-[#3a7d44] transition-colors"
                >
                  💬 Написать
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
