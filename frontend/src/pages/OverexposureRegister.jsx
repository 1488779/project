import { useState } from "react";

const ANIMALS = ["Собаки", "Кошки", "Грызуны", "Любые"];

export default function OverexposureRegister() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    photo: null,
    hasCage: false,
    hasSeparateRoom: false,
    hasOtherAnimals: false,
    maxDays: "",
    acceptedAnimals: [],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        <h1 className="text-xl font-bold mb-6 text-gray-900">
          Регистрация передержки
        </h1>

        {/* ФИО */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Иванов Иван Иванович"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Телефон */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+7 (999) 999-99-99"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Город */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Город <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Начните вводить название города"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
              📍 Определить
            </button>
          </div>
        </div>

        {/* Фото профиля */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Фото профиля</label>
          <div
            onClick={() => document.getElementById("photoInput").click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 text-gray-400 text-xs text-center"
          >
            {form.photo ? (
              <img
                src={URL.createObjectURL(form.photo)}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <>📷<br />Загрузить</>
            )}
          </div>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleChange("photo", e.target.files[0])}
          />
        </div>

        {/* Условия передержки */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Условия передержки</label>
          <div className="flex flex-col gap-2">
            {[
              { field: "hasCage", label: "Есть своя клетка / вольер" },
              { field: "hasSeparateRoom", label: "Есть отдельная комната" },
              { field: "hasOtherAnimals", label: "Есть другие животные (свои)" },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(e) => handleChange(field, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Максимальный срок */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Максимальный срок передержки (дней)
          </label>
          <input
            type="number"
            placeholder="Например, 30"
            value={form.maxDays}
            onChange={(e) => handleChange("maxDays", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Каких животных готовы принять */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Каких животных готовы принять?
          </label>
          <div className="flex flex-wrap gap-2">
            {ANIMALS.map((animal) => (
              <button
                key={animal}
                onClick={() => toggleArray("acceptedAnimals", animal)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${form.acceptedAnimals.includes(animal)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
              >
                {animal}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопка */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl text-base transition"
        >
          Далее
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Шаг 2 из 2 — добавление дополнительной информации
        </p>
      </div>
    </div>
  );
}