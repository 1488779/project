import { useState } from "react";
import { Link } from "react-router-dom";

export default function CuratorShelter() {
  const [tab, setTab] = useState("create"); // "create" | "select"
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: null,
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log({ tab, ...form });
    // navigate("/dashboard") или куда нужно
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        {/* Прогресс */}
        <p className="text-xs text-gray-400 mb-1">Шаг 2 из 2</p>
        <div className="h-1 w-full bg-green-600 rounded-full mb-6" />

        <h1 className="text-xl font-bold text-gray-900 mb-4">Приют</h1>

        {/* Табы */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("create")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${tab === "create"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Создать новый приют
          </button>
          <button
            onClick={() => setTab("select")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${tab === "select"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Выбрать существующий
          </button>
        </div>

        {tab === "create" ? (
          <>
            {/* Название */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название приюта <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Приют 'Добрые руки'"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            {/* Описание */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                placeholder="Расскажите о приюте..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
              />
            </div>

            {/* Логотип */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Логотип
              </label>
              <div
                onClick={() => document.getElementById("logoInput").click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 flex items-center justify-center cursor-pointer hover:border-green-500 text-gray-400 text-sm transition"
              >
                {form.logo ? (
                  <img
                    src={URL.createObjectURL(form.logo)}
                    className="h-10 object-contain rounded"
                  />
                ) : (
                  <>🖼️ Загрузить логотип</>
                )}
              </div>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChange("logo", e.target.files[0])}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Контактный email (для публикации задач)
              </label>
              <input
                type="email"
                placeholder="shelter@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            {/* Телефон */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон приюта
              </label>
              <input
                type="tel"
                placeholder="+7..."
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            {/* Адрес */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес
              </label>
              <input
                type="text"
                placeholder="г. Екатеринбург, ул. Мира, 28"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </>
        ) : (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Найти приют
            </label>
            <input
              type="text"
              placeholder="Начните вводить название приюта..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <p className="text-xs text-gray-400 mt-2">
              Введите название — куратор приюта должен будет подтвердить вашу заявку
            </p>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-between items-center">
          <Link
            to="/register/curator"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </Link>
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
          >
            Завершить регистрацию
          </Link>
        </div>
      </div>
    </div>
  );
}