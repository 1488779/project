import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

export default function VolunteerRegister3() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    notifyEmail:  false,
    notifyPush:   false,
    notifyDigest: false,
    agreeTerms:   false,
  });
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.agreeTerms) {
      setError("Подтвердите согласие с правилами платформы");
      return;
    }
    if (!password || password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    const step1 = JSON.parse(localStorage.getItem("volunteerStep1") || "{}");
    const step2 = JSON.parse(localStorage.getItem("volunteerStep2") || "{}");

    const allData = {
      ...step1,
      ...step2,
      notifyEmail:  form.notifyEmail,
      notifyPush:   form.notifyPush,
      notifyDigest: form.notifyDigest,
      password,
      // skills берём только с шага 1 — дублей больше нет
      skills: step1.skills || [],
    };

    try {
      const data = await api.registerVolunteer(allData);

      if (data.success) {
        localStorage.removeItem("volunteerStep1");
        localStorage.removeItem("volunteerStep2");

        // Логинимся через реальный API чтобы получить токен и роль
        await login(step1.email || step1.phone, password);
        navigate("/dashboard");
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      setError(err.message || "Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-xl font-bold text-gray-900 mb-6">Завершение регистрации</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Придумайте пароль <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Используется для входа в личный кабинет
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.notifyEmail} onChange={(e) => handleChange("notifyEmail", e.target.checked)} />
            Получать уведомления о новых задачах по email
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.notifyPush} onChange={(e) => handleChange("notifyPush", e.target.checked)} />
            Получать push-уведомления в браузере
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.notifyDigest} onChange={(e) => handleChange("notifyDigest", e.target.checked)} />
            Получать дайджест раз в неделю
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.agreeTerms} onChange={(e) => handleChange("agreeTerms", e.target.checked)} />
            Согласен с правилами и офертой платформы <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/volunteer-register-2")}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-50"
          >
            {loading ? "Регистрация..." : "Завершить регистрацию"}
          </button>
        </div>
      </div>
    </div>
  );
}
