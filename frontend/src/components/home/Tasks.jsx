import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import delivery from "../../assets/tasks/delivery.png";
import fix from "../../assets/tasks/fix.png";
import walking from "../../assets/tasks/walking.png";
import { api } from "../../api";

const iconMap = { delivery, walking, fix };
const ICON_EMOJI = { delivery: "🚚", walking: "🐕", fix: "🔧", photo: "📷", cleaning: "🧹", transport: "🚗" };

const FALLBACK = [
  { id: "p1", title: "Доставить 20кг корма",  shelter: "Добрые руки",    distance: "2.3", icon: "delivery" },
  { id: "p2", title: "Выгулять 3-х собак",    shelter: "Счастливый хвост", distance: "4.1", icon: "walking" },
  { id: "p3", title: "Ремонт крыши вольера",  shelter: "Новый дом",      distance: "5.8", icon: "fix"      },
];

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTasks()
      .then((data) => setTasks((data ?? []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = loading ? FALLBACK : tasks.length > 0 ? tasks : FALLBACK;

  return (
    <div className="bg-gray-100">
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Актуальные задачи</h2>
        <div className="flex items-center mb-6">
          <p className="text-gray-600">Помощь нужна прямо сейчас</p>
          <Link to="/tasks-page" className="text-[#2E7D32] font-semibold flex justify-between items-center ml-auto">
            Все задачи →
          </Link>
        </div>

        <div className={`grid grid-cols-3 gap-6 ${loading ? "opacity-60 animate-pulse" : ""}`}>
          {items.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex gap-4 pb-4 mb-4 border-b border-gray-200">
                <div className="flex flex-col justify-start">
                  {iconMap[task.icon]
                    ? <img src={iconMap[task.icon]} alt={task.icon} />
                    : <span className="text-3xl">{ICON_EMOJI[task.icon] ?? "📋"}</span>
                  }
                </div>
                <div className="flex flex-col gap-3">
                  <div className="font-bold">{task.title}</div>
                  <div className="text-sm text-gray-600">Приют: {task.shelter}</div>
                  {task.distance != null && (
                    <span className="bg-[#F5F5F5] px-2 py-1 rounded text-sm w-fit">
                      📍 {task.distance} км от вас
                    </span>
                  )}
                </div>
              </div>
              <Link to={`/tasks/${task.id}`} className="text-[#2E7D32] font-semibold flex items-center">
                Посмотреть задачу →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
