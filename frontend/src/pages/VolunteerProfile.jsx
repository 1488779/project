export default function VolunteerProfile() {
  const user = {
    name: "Иван Петров",
    city: "Екатеринбург",
    avatar: null,
    stats: {
      tasks: 15,
      hours: 30,
      saved: 3,
    },
    skills: ["Транспорт", "Выгул", "Фото", "SMM"],
  };

  const activeTasks = [
    {
      id: 1,
      title: "Доставить корм в приют",
      shelter: 'Приют "Добрые руки"',
      datetime: "2 апреля, 14:00",
      status: "В работе",
    },
    {
      id: 2,
      title: "Выгулять собак",
      shelter: 'Приют "Счастливый хвост"',
      datetime: "3 апреля, 10:00",
      status: "Запланировано",
    },
  ];

  const history = [
    {
      id: 1,
      title: "Помощь с ремонтом вольеров",
      shelter: 'Приют "Новый дом"',
      date: "28 марта 2026",
    },
    {
      id: 2,
      title: "Фотосессия животных",
      shelter: 'Приют "Добрые руки"',
      date: "25 марта 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Профиль */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
              ) : "👤"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.city}</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition">
            ✏️ Редактировать
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: user.stats.tasks, label: "Выполнено задач" },
            { value: user.stats.hours, label: "Часов помощи" },
            { value: user.stats.saved, label: "Спасено животных" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Навыки */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Мои навыки</h2>
            <button className="text-sm text-green-600 hover:underline">Изменить</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Мои задачи */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Мои задачи</h2>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.shelter}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {task.datetime} • {task.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition">
                    Завершить
                  </button>
                  <button className="text-xs text-gray-500 hover:text-green-600 transition whitespace-nowrap">
                    ✉️ Написать куратору
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* История */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">История</h2>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.shelter}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{item.date}</p>
                  <p className="text-xs text-green-600 mt-0.5">✓ Завершено</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}