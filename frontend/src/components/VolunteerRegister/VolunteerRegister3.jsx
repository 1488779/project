import { useState } from "react";
import { Link } from "react-router-dom";

const DISTRICTS = ["Центр", "Юго-Запад", "Северный", "Железнодорожный", "Вокзальный", "Ленинский", "Октябрьский"];

export default function VolunteerRegister3() {
  const [form, setForm] = useState({
    districts: [],
    radius: "10 км",
    notifyEmail: false,
    notifyPush: false,
    notifyDigest: false,
    agreeTerms: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDistrict = (district) => {
    setForm((prev) => ({
      ...prev,
      districts: prev.districts.includes(district)
        ? prev.districts.filter((d) => d !== district)
        : [...prev.districts, district],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        <p className="text-xs text-gray-400 mb-1">Шаг 3 из 3</p>
        <div className="flex gap-2 mb-6">
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Завершение настройки профиля
        </h1>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Предпочтаемый район поиска задач (можно выбрать несколько)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {DISTRICTS.map((district) => (
              <button
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${form.districts.includes(district)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
              >
                {district}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Если не выбран ни один район, система покажет задачи со всего города.
          </p>
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Радиус поиска (км от выбранного района)
          </label>
          <input
            type="text"
            value={form.radius}
            onChange={(e) => handleChange("radius", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {[
            { field: "notifyEmail", label: "Получать уведомления о новых задачах по email" },
            { field: "notifyPush", label: "Получать push-уведомления в браузере" },
            { field: "notifyDigest", label: "Получать дайджест раз в неделю" },
            { field: "agreeTerms", label: "Согласен с правилами и офертой платформы" },
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

        <div className="flex justify-between items-center">
          <Link
            to="/register/volunteer/step2"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </Link>
          <Link
            to="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
          >
            Завершить регистрацию
          </Link>
        </div>
      </div>
    </div>
  );
}