const animals = [
  { id: 1, emoji: "🐕", name: "Рекс", age: "3 года", breed: "золотистый ретривер", shelter: "Добрые руки" },
  { id: 2, emoji: "🐱", name: "Мурка", age: "1 год", breed: "игривая кошка", shelter: "Передержка" },
  { id: 3, emoji: "🐶", name: "Бобик", age: "5 лет", breed: "добрый пёс", shelter: "Добрые руки" },
  { id: 4, emoji: "🐩", name: "Снежок", age: "2 года", breed: "белый пёс", shelter: "Новый дом" },
];

const species = ["Все виды", "Собаки", "Кошки"];
const ages = ["Возраст", "До 1 года", "1–3 года", "Старше 3 лет"];
const sizes = ["Размер", "Маленький", "Средний", "Крупный"];

export default function AnimalsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 pb-16">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Животные</h1>
      <p className="text-gray-500 mb-6">Здесь вы можете найти себе верного друга. Они очень ждут вас.</p>

      {/* Фильтры */}
      <div className="flex gap-3 mb-8">
        {species.map((s) => (
          <button key={s} className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-green-600 hover:text-green-700 transition-colors">
            {s}
          </button>
        ))}
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
          {ages.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
          {sizes.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {animals.map((animal) => (
          <div key={animal.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Фото */}
            <div className="bg-gray-100 h-36 flex items-center justify-center text-5xl">
              {animal.emoji}
            </div>

            {/* Инфо */}
            <div className="p-3">
              <p className="font-semibold text-gray-900">{animal.name}</p>
              <p className="text-sm text-gray-500 mb-1">{animal.age}, {animal.breed}</p>
              <p className="text-xs text-gray-400 mb-3">📍 Приют «{animal.shelter}»</p>

              <div className="flex items-center justify-between">
                <button className="text-sm text-green-700 hover:underline">Подробнее →</button>
                <span className="text-xs text-green-600 font-medium">Ищет дом</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
