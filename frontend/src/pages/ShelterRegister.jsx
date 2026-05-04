import { useState } from "react";

export default function ShelterRegister() {
  const [form, setForm] = useState({
    orgName: "",
    legalStatus: "НКО",
    phone: "",
    email: "",
    address: "",
    website: "",
    logo: null,
    requisites: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">

        <h1 className="text-xl font-bold mb-6 text-gray-900">
          Регистрация приюта
        </h1>

        {/* Название организации */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название организации <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.orgName}
            onChange={(e) => handleChange("orgName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Юридический статус */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Юридический статус <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.legalStatus}
            onChange={(e) => handleChange("legalStatus", e.target.value)}
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
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Адрес */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Карта */}
        <div className="mb-4 bg-gray-100 rounded-xl h-32 flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-200 transition">
          🗺️ Карта
        </div>

        {/* Сайт / соцсети */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сайт / соцсети
          </label>
          <input
            type="text"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        {/* Логотип / Обложка */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Логотип / Обложка
          </label>
          <div
            onClick={() => document.getElementById("logoInput").click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 text-gray-400 text-sm transition"
          >
            {form.logo ? (
              <img
                src={URL.createObjectURL(form.logo)}
                className="h-16 object-contain rounded"
              />
            ) : (
              <>🖼️<br />Нажмите для загрузки</>
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

        {/* Реквизиты */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Реквизиты для помощи
          </label>
          <textarea
            placeholder="Введите реквизиты расчетного счета..."
            value={form.requisites}
            onChange={(e) => handleChange("requisites", e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
          />
        </div>

        {/* Кнопка */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl text-base transition"
        >
          Далее
        </button>
      </div>
    </div>
  );
}