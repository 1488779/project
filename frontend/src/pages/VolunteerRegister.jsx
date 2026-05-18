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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Ошибка загрузки файла");
    }
    return data.url;
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.city) {
      setError("Пожалуйста, заполните ФИО, телефон и город");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let photoUrl = null;

      if (form.photo) {
        photoUrl = await uploadFile(form.photo);
      }

      const dataToSend = {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || null,
        city: form.city,
        photo: photoUrl,
        skills: form.skills,
        hasExperience: form.hasExperience,
        preferredAnimals: form.preferredAnimals,
        considersFoster: form.considersFoster,
        hasCage: form.hasCage,
        hasSeparateRoom: form.hasSeparateRoom,
        maxFosterDays: form.maxFosterDays || null,
      };

      const response = await fetch("http://localhost:5000/api/register/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Волонтёр успешно зарегистрирован!");
        window.location.href = "/";
      } else {
        setError(data.error || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Не удалось соединиться с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        <h1 className="text-xl font-bold mb-6 text-gray-900">
          Регистрация волонтера
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            <button type="button" className="flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
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
                alt="preview"
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
                type="button"
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
                type="button"
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
          disabled={loading}
          className={`w-full font-medium py-3 rounded-xl text-base transition ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Отправка..." : "Далее"}
        </button>
      </div>
    </div>
  );
}