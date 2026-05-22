import { useState } from "react";
import { Link } from "react-router-dom";

export default function CuratorRegister() {
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        {/* Прогресс */}
        <div className="flex gap-2 mb-6">
          <div className="h-1 flex-1 bg-green-600 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Регистрация куратора (сотрудник приюта)
        </h1>

        {/* Email или телефон */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
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
        <div className="mb-8">
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

        <Link
          to="/curator-register-2"
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl text-sm transition"
        >
          Далее (создать или выбрать приют)
        </Link>
      </div>
    </div>
  );
}