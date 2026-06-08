import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Транспорт", "Выгул", "Ветеринария", "Уборка", "Ремонт", "Фото", "Сбор средств", "Другое"];
const ALL_SKILLS  = ["Транспорт", "Выгул", "Фото", "Ветеринария", "Физическая сила", "Ремонт"];

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    category: "Транспорт",
    description: "",
    photo: null,
    date: "",
    time: "",
    address: "",
    urgent: false,
    skills: ["Транспорт"],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Введите название задачи");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      let photoUrl = null;
      if (form.photo) {
        const uploadResult = await api.uploadFile(form.photo);
        photoUrl = uploadResult.url;
      }
      
      const taskData = {
        title: form.title,
        category: form.category,
        description: form.description,
        date: form.date || null,
        timeFrom: form.time || null,
        address: form.address || null,
        skills: form.skills,
        isUrgent: form.urgent,
        photos: photoUrl ? [photoUrl] : [],
        createdById: user?.id
      };
      
      await api.createTask(taskData);
      navigate("/curator/tasks");
    } catch (err) {
      setError(err.message || "Ошибка создания задачи");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-[#212121] mb-4">Создать задачу</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl px-4 py-3 text-sm text-[#b28704] mb-6">
            ⚠️ Задача будет отправлена на модерацию. После проверки администратором она станет доступна волонтёрам.
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">
                Название <span className="text-[#e53935]">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Например: Доставить 20 кг корма"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Категория</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#212121] bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Описание</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Подробно опишите, что нужно сделать..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Фото</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#3a7d44] hover:bg-[#f0f7f1] transition-all">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm text-[#9e9e9e]">
                  {form.photo ? form.photo.name : "Нажмите или перетащите файлы"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => set("photo", e.target.files[0] || null)}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">Дата</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#616161] outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">Время</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#616161] outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Адрес</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="ул. Мира, 28, Екатеринбург"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
              <div className="mt-2 bg-[#f5f5f5] rounded-xl h-24 flex items-center justify-center text-[#9e9e9e] text-sm">
                🗺️ Карта
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#424242]">Срочно</span>
              <button
                onClick={() => set("urgent", !form.urgent)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  form.urgent ? "bg-[#3a7d44]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    form.urgent ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-2">Требуемые навыки</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const active = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        active
                          ? "bg-[#3a7d44] border-[#3a7d44] text-white"
                          : "bg-white border-gray-200 text-[#616161] hover:border-[#3a7d44] hover:text-[#3a7d44]"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.title.trim()}
                className="flex-1 bg-[#3a7d44] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
              >
                {submitting ? "Отправка..." : "Отправить на модерацию"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-200 text-[#616161] text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}