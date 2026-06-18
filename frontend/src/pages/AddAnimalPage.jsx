import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const SPECIES = ["Собака", "Кошка", "Кролик", "Птица", "Другое"];

export default function AddAnimalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    species: "Собака",
    breed: "",
    age: "",
    color: "",
    weight: "",
    description: "",
    photo: null,
    vaccinated: false,
    sterilized: false,
    chipped: false,
    conditions: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Введите кличку");
      return;
    }
    if (!form.age.trim()) {
      setError("Введите возраст");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let photoUrl = null;
      if (form.photo) {
        const uploadResult = await api.uploadFile(form.photo);
        photoUrl = uploadResult.url;
      }

      const animalData = {
        name: form.name.trim(),
        age: form.age.trim(),
        type: form.species,
        breed: form.breed || null,
        color: form.color || null,
        description: form.description || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        isVaccinated: form.vaccinated,
        isSterilized: form.sterilized,
        isChipped: form.chipped,
        specialConditions: form.conditions || null,
        photos: photoUrl ? [photoUrl] : [],
        createdById: user?.id || null,
        shelterId: user?.shelterId || null
      };

      await api.createAnimal(animalData);
      setSubmitted(true);
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message || "Ошибка при создании анкеты");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f2f3f1] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-xl font-extrabold text-[#212121] mb-2">Анкета отправлена!</h2>
          <p className="text-sm text-[#616161] mb-6">После одобрения модератором животное появится в каталоге.</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#3a7d44] text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-[#212121] mb-4">Добавить животное</h1>

          <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl px-4 py-3 text-sm text-[#b28704] mb-6">
            ⚠️ Анкета животного пройдёт модерацию. После одобрения она появится в каталоге.
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">
                Кличка <span className="text-[#e53935]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Рекс"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">Вид</label>
                <select
                  value={form.species}
                  onChange={(e) => set("species", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#212121] bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                >
                  {SPECIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">Порода</label>
                <input
                  type="text"
                  value={form.breed}
                  onChange={(e) => set("breed", e.target.value)}
                  placeholder="Золотистый ретривер"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">
                  Возраст <span className="text-[#e53935]">*</span>
                </label>
                <input
                  type="text"
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  placeholder="3 года"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">Окрас</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="Золотистый"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Вес (кг)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                placeholder="3.5"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Описание</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Характер, история, привычки..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Фото</label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#3a7d44] hover:bg-[#f0f7f1] transition-all">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm text-[#9e9e9e]">
                  {form.photo ? form.photo.name : "Загрузите фото"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => set("photo", e.target.files[0] || null)}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { key: "vaccinated", label: "Вакцинирован" },
                { key: "sterilized", label: "Стерилизован" },
                { key: "chipped", label: "Чипирован" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#424242]">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="accent-[#3a7d44] w-4 h-4"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">Особые условия</label>
              <input
                type="text"
                value={form.conditions}
                onChange={(e) => set("conditions", e.target.value)}
                placeholder="Нельзя с детьми, не уживается с кошками"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name.trim() || !form.age.trim()}
                className="flex-1 bg-[#3a7d44] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
              >
                {loading ? "Отправка..." : "Отправить на модерацию"}
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