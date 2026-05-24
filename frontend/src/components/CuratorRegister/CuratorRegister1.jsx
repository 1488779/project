import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CuratorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(""); 
  };

  const handleNext = async () => {
    setError("");
    
    if (!form.emailOrPhone.trim()) {
      setError("Введите email или номер телефона");
      return;
    }
    
    if (!form.password) {
      setError("Введите пароль");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/curator/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: form.emailOrPhone.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('curatorUserId', data.userId);
        navigate('/curator-register-2');
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка соединения с сервером. Убедитесь, что сервер запущен.');
    } finally {
      setLoading(false);
    }
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

        {/* Ошибка */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email или телефон */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="example@mail.com или +7 (999) 999-99-99"
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
            placeholder="Минимум 6 символов"
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
            placeholder="Повторите пароль"
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

        {/* Кнопка вместо Link */}
        <button
          onClick={handleNext}
          disabled={loading}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Загрузка..." : "Далее (создать или выбрать приют)"}
        </button>
      </div>
    </div>
  );
}