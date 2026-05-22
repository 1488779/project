import { useState } from "react";

export default function OwnerRegister() {
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        {/* Прогресс */}
        <div className="h-1 w-full bg-green-600 rounded-full mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Регистрация владельца животного
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Создайте аккаунт. После регистрации вы сможете добавить питомцев в личном кабинете.
        </p>

        {/* Email или телефон */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="example@mail.com или +7..."
            value={form.emailOrPhone}
            onChange={(e) => handleChange("emailOrPhone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Пароль */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Подтверждение пароля */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Подтверждение пароля <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition
              ${form.confirmPassword && form.password !== form.confirmPassword
                ? "border-red-400 focus:border-red-400"
                : "border-gray-300 focus:border-green-500"
              }`}
          />
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Пароли не совпадают</p>
          )}
        </div>

        {/* Ваше имя */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            placeholder="Анна"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Контактный телефон */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Контактный телефон (для связи)
          </label>
          <input
            type="tel"
            placeholder="+7..."
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Кнопка */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-8 rounded-xl text-sm transition"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}