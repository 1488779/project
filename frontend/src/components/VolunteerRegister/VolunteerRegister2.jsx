import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VolunteerRegister2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    availableTime: "",
    about: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("volunteerStep2", JSON.stringify({
      availableTime: form.availableTime,
      about: form.about,
    }));
    navigate("/volunteer-register-3");
  };

  const handleBack = () => {
    navigate("/register/volunteer");
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
          Доступность и о себе
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Доступное время
          </label>
          <input
            type="text"
            placeholder="Например: будни после 18:00, выходные весь день"
            value={form.availableTime}
            onChange={(e) => handleChange("availableTime", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            О себе
          </label>
          <textarea
            rows={4}
            placeholder="Расскажите немного о себе, своей мотивации помогать животным..."
            value={form.about}
            onChange={(e) => handleChange("about", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-green-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}
