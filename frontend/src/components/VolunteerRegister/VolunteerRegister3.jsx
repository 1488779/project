import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DISTRICTS = ["Центр", "Юго-Запад", "Северный", "Железнодорожный", "Вокзальный", "Ленинский", "Октябрьский"];

export default function VolunteerRegister3() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    districts: [],
    radius: "10 км",
    notifyEmail: false,
    notifyPush: false,
    notifyDigest: false,
    agreeTerms: false,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      ...form,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/volunteer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("volunteerStep1");
        localStorage.removeItem("volunteerStep2");

        // Логиним пользователя данными из формы и переходим в дашборд
        login({
          id: Date.now(),
          name: step1.fullName || "Волонтёр",
          email: step1.email || step1.phone,
          role: "volunteer",
        });

        navigate("/dashboard");
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Ошибка соединения с сервером. Убедитесь, что сервер запущен.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/volunteer-register-2");
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

        <h1 className="text-xl font-bold text-gray-900 mb-6">Завершение настройки профиля</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Пароль */}
        <div className="mb-4">
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
            Этот пароль будет использоваться для входа в личный кабинет
          </p>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Предпочтаемый район поиска задач (можно выбрать несколько)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {DISTRICTS.map((district) => (
              <button
                key={district}
                type="button"
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
          <button onClick={handleBack} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition">
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