const tasks = [
  { id: 1, emoji: "🚚", title: "Доставить 20кг корма", shelter: 'Приют "Добрые руки"', distance: "2.3 км от вас" },
  { id: 2, emoji: "🐕", title: "Выгул 3-х собак", shelter: 'Приют "Счастливый хвост"', distance: "4.1 км от вас" },
  { id: 3, emoji: "🔧", title: "Ремонт крыши вольера", shelter: 'Приют "Новый дом"', distance: "5.8 км от вас" },
  { id: 4, emoji: "🐾", title: "Социализация щенков", shelter: 'Приют "Надежда"', distance: "6.2 км от вас" },
  { id: 5, emoji: "🧹", title: "Помощь в уборке территории", shelter: 'Приют "Верный друг"', distance: "7.5 км от вас" },
  { id: 6, emoji: "🚗", title: "Перевозка собаки к ветеринару", shelter: "Передержка у Анны", distance: "10.0 км от вас" },
];

const categories = ["Все категории", "Перевозка", "Выгул", "Ремонт", "Уборка"];
const distances = ["Любая дистанция", "До 3 км", "До 5 км", "До 10 км"];

export default function TasksPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Заголовок + фильтры */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Все задачи</h1>
          <p className="text-gray-500">Помощь нужна прямо сейчас. Выберите задачу по душе.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
            {distances.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0">
                {task.emoji}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-snug">{task.title}</p>
                <p className="text-xs text-gray-400">{task.shelter}</p>
              </div>
            </div>
            <p className="text-xs text-green-700">📍 {task.distance}</p>
            <button className="text-sm text-green-700 hover:underline text-left mt-1">
              Посмотреть задачу →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
