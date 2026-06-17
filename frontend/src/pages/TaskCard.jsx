import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import MapComponent from "../components/map/MapComponent";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

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

  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [taking, setTaking]   = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getTask(id)
      .then((data) => { setTask(data); setLoading(false); })
      .catch((e)   => { setError(e.message); setLoading(false); });
  }, [id]);

  const takeTask = async () => {
    if (!user) { navigate("/login-page"); return; }

    const volunteerId = user.volunteerId;
    if (!volunteerId) {
      alert("Взять задачу могут только волонтёры");
      return;
    }

    setTaking(true);
    try {
      await api.takeTask(id, volunteerId);
      setTask((prev) => ({ ...prev, status: "active" }));
    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setTaking(false);
    }
  };

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

  const extra         = task.extraData || {};
  const category      = task.category      || extra.category      || "Задача";
  const categoryEmoji = extra.categoryEmoji || "📋";
  const rating        = extra.rating        || 0;
  const date          = task.date           || extra.date          || "—";
  const timeFrom      = task.timeFrom       || extra.timeFrom      || "";
  const timeTo        = task.timeTo         || extra.timeTo        || "";
  const address       = task.address        || extra.address       || task.shelter || "—";
  const description   = task.description   || extra.description   || "—";
  const skills        = task.skills         || extra.skills        || [];
  const photos        = task.photos         || extra.photos        || [];
  const contact       = task.contactName
    ? { name: task.contactName, role: task.contactRole, phone: task.contactPhone }
    : extra.contact || null;

  const isActive    = task.status === "active";
  const isCompleted = task.status === "completed" || task.status === "done";
  const isVolunteer = user?.role === "volunteer";
  const alreadyTaken = isActive && task.volunteerId === user?.volunteerId;

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
          <div className="flex-1">
            {photos.length > 0 ? (
              <img
                src={photos[0].startsWith("http") ? photos[0] : `${BASE}${photos[0]}`}
                className="rounded-2xl w-full h-64 object-cover mb-3"
                alt="Фото задачи"
              />
            ) : (
              <div className="bg-[#f5f5f5] rounded-2xl w-full h-64 flex items-center justify-center text-[#9e9e9e] text-sm mb-3">
                📷 Фото задачи
              </div>
            )}

            {photos.length > 1 && (
              <div className="flex gap-2 mb-6">
                {photos.slice(1).map((p, i) => (
                  <img
                    key={i}
                    src={p.startsWith("http") ? p : `${BASE}${p}`}
                    className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Фото ${i + 2}`}
                  />
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

              {alreadyTaken && (
                <div className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full mb-4 text-center">
                  Вы взяли эту задачу
                </div>
              )}
              {isActive && !alreadyTaken && (
                <div className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full mb-4 text-center">
                  В работе
                </div>
              )}
              {isCompleted && (
                <div className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full mb-4 text-center">
                  Выполнена
                </div>
              )}

              <div className="space-y-3 mb-4">
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

              <div className="rounded-xl overflow-hidden h-32 mb-4">
                <MapComponent
                  lat={task.lat || extra.lat}
                  lng={task.lng || extra.lng}
                  address={address}
                  height="128"
                  interactive={true}
                />
              </div>

              {!isActive && !isCompleted && isVolunteer && (
                <button
                  onClick={takeTask}
                  disabled={taking}
                  className="w-full bg-[#3a7d44] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
                >
                  {taking ? "Оформление..." : "Взять задачу"}
                </button>
              )}

              {!isActive && !isCompleted && !isVolunteer && !user && (
                <button
                  onClick={() => navigate("/login-page")}
                  className="w-full bg-[#3a7d44] text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
                >
                  Войти чтобы взять задачу
                </button>
              )}

              {isActive && (
                <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-xl text-sm cursor-not-allowed">
                  {alreadyTaken ? "Вы взяли эту задачу" : "Задача в работе"}
                </button>
              )}

              {isCompleted && (
                <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-xl text-sm cursor-not-allowed">
                  Задача выполнена
                </button>
              )}
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
                  onClick={async () => {
                    if (!task.createdById) {
                      console.error("Нет createdById у задачи");
                      return;
                    }
                    try {
                      const response = await api.createChat(task.createdById);
                      navigate(`/chat/${response.data.id}`);
                    } catch (error) {
                      console.error("Ошибка:", error);
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-green-600 transition whitespace-nowrap"
                >
                  ✉️ Написать куратору
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}