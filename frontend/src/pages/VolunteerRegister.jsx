import { useState } from "react";

const SKILLS = ["Транспорт", "Выгул", "Уборка", "Стройка", "Фото", "SMM", "Ветеринария", "Сбор средств", "Юридическая помощь"];
const ANIMALS = ["Собаки", "Кошки", "Грызуны", "Любые"];

export default function VolunteerRegister() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    photo: null,
    skills: [],
    hasExperience: false,
    preferredAnimals: [],
    considersFoster: false,
    hasCage: false,
    hasSeparateRoom: false,
    maxFosterDays: "",
  });

  const toggleArray = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">


        <h1 className="text-xl font-bold mb-6 text-gray-900">
          Регистрация волонтера
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

        {/* Компетенции */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Мои компетенции</label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleArray("skills", skill)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${form.skills.includes(skill)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Опыт */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Опыт и предпочтения</label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasExperience}
              onChange={(e) => handleChange("hasExperience", e.target.checked)}
            />
            Есть опыт волонтёрства
          </label>
        </div>

        {/* Предпочитаемые животные */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">Предпочитаемые животные</p>
          <div className="flex flex-wrap gap-2">
            {ANIMALS.map((animal) => (
              <button
                key={animal}
                onClick={() => toggleArray("preferredAnimals", animal)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${form.preferredAnimals.includes(animal)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
              >
                {animal}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={form.considersFoster}
              onChange={(e) => handleChange("considersFoster", e.target.checked)}
            />
            Рассматриваю передержку
          </label>

          {form.considersFoster && (
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasCage}
                  onChange={(e) => handleChange("hasCage", e.target.checked)}
                />
                Есть своя клетка
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasSeparateRoom}
                  onChange={(e) => handleChange("hasSeparateRoom", e.target.checked)}
                />
                Есть отдельная комната
              </label>
              <input
                type="number"
                placeholder="Максимальный срок (дней)"
                value={form.maxFosterDays}
                onChange={(e) => handleChange("maxFosterDays", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          )}
        </div>

        {/* Кнопка */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl text-base transition"
        >
          Далее
        </button>
      </div>
    </div>
  );
}