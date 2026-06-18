import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CuratorShelter() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("create"); 
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: null,
    email: "",
    phone: "",
    address: "",
  });
  const [shelters, setShelters] = useState([]);
  const [selectedShelterId, setSelectedShelterId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  useEffect(() => {
    if (tab === "select") {
      fetchShelters();
    }
  }, [tab]);

  const fetchShelters = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/shelters");
      const data = await response.json();
      if (data.success) {
        setShelters(data.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки приютов:", error);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return data.url;
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoLoading(true);
    try {
      const logoUrl = await uploadFile(file);
      handleChange("logo", logoUrl);
    } catch (err) {
      console.error("Ошибка загрузки логотипа:", err);
      setError("Ошибка загрузки логотипа. Попробуйте другой файл.");
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    const userId = localStorage.getItem("curatorUserId");

    if (!userId) {
      setError("Ошибка: не найден ID пользователя. Пройдите первый шаг регистрации заново.");
      setLoading(false);
      return;
    }

    try {
      let url = "";
      let body = {};

      if (tab === "create") {
        if (!form.name.trim()) {
          setError("Введите название приюта");
          setLoading(false);
          return;
        }
        if (!form.address.trim()) {
          setError("Введите адрес приюта");
          setLoading(false);
          return;
        }

        url = "http://localhost:5000/api/curator/complete-with-new-shelter";
        body = {
          userId: parseInt(userId),
          shelterData: {
            name: form.name.trim(),
            description: form.description || null,
            email: form.email || "",
            phone: form.phone || "",
            address: form.address.trim(),
            logo: form.logo || null, 
          },
        };
      } else {
        if (!selectedShelterId) {
          setError("Выберите приют из списка");
          setLoading(false);
          return;
        }

        url = "http://localhost:5000/api/curator/complete-with-existing-shelter";
        body = {
          userId: parseInt(userId),
          shelterId: parseInt(selectedShelterId),
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Регистрация успешна! Перенаправление на вход...");
        localStorage.removeItem("curatorUserId");
        setTimeout(() => {
          navigate("/login-page");
        }, 1500);
      } else {
        setError(data.error || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const filteredShelters = shelters.filter((shelter) =>
    shelter.orgName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8">
        <p className="text-xs text-gray-400 mb-1">Шаг 2 из 2</p>
        <div className="h-1 w-full bg-green-600 rounded-full mb-6" />

        <h1 className="text-xl font-bold text-gray-900 mb-4">Приют</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("create")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                tab === "create"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Создать новый приют
          </button>
          <button
            onClick={() => setTab("select")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                tab === "select"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Выбрать существующий
          </button>
        </div>

        {tab === "create" ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название приюта <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Приют 'Добрые руки'"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                placeholder="Расскажите о приюте..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Логотип
              </label>
              <div
                onClick={() => !logoLoading && document.getElementById("logoInput").click()}
                className={`w-full border-2 border-dashed border-gray-300 rounded-lg py-3 flex items-center justify-center cursor-pointer hover:border-green-500 text-gray-400 text-sm transition ${
                  logoLoading ? "opacity-50 cursor-wait" : ""
                }`}
              >
                {logoLoading ? (
                  <>⏳ Загрузка...</>
                ) : form.logo ? (
                  <img
                    src={`http://localhost:5000${form.logo}`}
                    className="h-10 object-contain rounded"
                    alt="Логотип"
                  />
                ) : (
                  <>🖼️ Загрузить логотип</>
                )}
              </div>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Контактный email (для публикации задач)
              </label>
              <input
                type="email"
                placeholder="shelter@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон приюта
              </label>
              <input
                type="tel"
                placeholder="+7..."
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="г. Екатеринбург, ул. Мира, 28"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </>
        ) : (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Найти приют
            </label>
            <input
              type="text"
              placeholder="Начните вводить название приюта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 mb-3"
            />

            {filteredShelters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {searchTerm ? "Приюты не найдены" : "Загрузка списка приютов..."}
              </p>
            ) : (
              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {filteredShelters.map((shelter) => (
                  <label
                    key={shelter.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition
                      ${selectedShelterId == shelter.id ? "bg-green-50" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      name="shelter"
                      value={shelter.id}
                      checked={selectedShelterId == shelter.id}
                      onChange={(e) => setSelectedShelterId(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{shelter.orgName}</p>
                      {shelter.address && (
                        <p className="text-sm text-gray-500">{shelter.address}</p>
                      )}
                    </div>
                    {shelter.logo && (
                      <img
                        src={`http://localhost:5000${shelter.logo}`}
                        className="w-10 h-10 object-cover rounded"
                        alt={shelter.orgName}
                      />
                    )}
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Выберите приют, в котором вы работаете. Куратор приюта должен будет подтвердить вашу заявку.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/register/curator")}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm transition"
          >
            Назад
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Завершить регистрацию"}
          </button>
        </div>
      </div>
    </div>
  );
}