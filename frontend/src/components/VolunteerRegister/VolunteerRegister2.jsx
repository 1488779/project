import { useState } from "react";
import { Link } from "react-router-dom";

const SKILLS = ["Транспорт", "Выгул", "Уборка", "Стройка", "Фото", "SMM", "Ветеринария", "Сбор средств", "Юридическая помощь", "🐾 Передержка"];
const ANIMALS = ["Собаки", "Кошки", "Грызуны", "Любые"];

export default function VolunteerRegister2() {
  const [form, setForm] = useState({
    skills: [],
    hasExperience: false,
    preferredAnimals: [],
    availableTime: "",
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        <p className="text-xs text-gray-400 mb-1">Шаг 2 из 3</p>
        <div className="flex gap-2 mb-6">
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Мои компетенции и опыт
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Навыки (выберите подходящие)
          </label>
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Опыт</label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasExperience}
              onChange={(e) => handleChange("hasExperience", e.target.checked)}
            />
            Есть опыт волонтёрства
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Предпочитаемые животные
          </label>
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

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Доступное время (дни и часы)
          </label>
          <input
            type="text"
            value={form.availableTime}
            onChange={(e) => handleChange("availableTime", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <Link
            to="/register/volunteer"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </Link>
          <Link
            to="/volunteer-register-3"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
          >
            Далее
          </Link>
        </div>
      </div>
    </div>
  );
}