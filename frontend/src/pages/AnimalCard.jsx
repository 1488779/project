import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import MapComponent from "../components/map/MapComponent";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function AnimalCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    loadAnimal();
  }, [id]);

  const loadAnimal = () => {
    setLoading(true);
    fetch(`${BASE}/api/animals/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Животное не найдено");
        return r.json();
      })
      .then((data) => { 
        setAnimal(data); 
        setLoading(false); 
      })
      .catch((e) => { 
        setError(e.message); 
        setLoading(false); 
      });
  };

  const handleAdopt = async () => {
    if (!user) {
      navigate("/login-page");
      return;
    }
    
    setAdopting(true);
    try {
      await api.adoptAnimal(id);
      loadAnimal(); 
    } catch (err) {
      console.error("Ошибка:", err);
    } finally {
      setAdopting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f2f3f1] flex items-center justify-center text-[#9e9e9e]">
      Загрузка...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f2f3f1] flex flex-col items-center justify-center gap-4">
      <p className="text-[#e53935]">{error}</p>
      <button onClick={() => navigate(-1)} className="text-sm text-[#3a7d44] hover:underline">← Назад</button>
    </div>
  );

  const extra = animal.extraData || {};
  const health   = extra.health   || [];
  const photos   = extra.photos   || [];
  const shelter  = extra.shelter  || "—";
  const address  = extra.address  || "—";
  const breed    = extra.breed    || "—";
  const weight   = extra.weight   || "—";
  const emoji    = extra.emoji    || "🐾";
  const isAdopted = animal.adopted === true;

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#616161] hover:text-[#3a7d44] transition-colors mb-6"
        >
          <BackIcon />
          Назад к списку
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-96 shrink-0">
            <div className="bg-[#f5f5f5] rounded-2xl w-full aspect-square flex items-center justify-center text-9xl mb-3">
              {emoji}
            </div>
            {photos.length > 0 && (
              <div className="flex gap-2">
                {photos.map((p, i) => (
                  <img 
                    key={i} 
                    src={`${BASE}${p}`} 
                    className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    alt={`Фото ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-[#212121] mb-3">{animal.name}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1 bg-[#f5f5f5] text-[#616161] text-sm px-3 py-1.5 rounded-full">
                🐾 {animal.age}
              </span>
              <span className="flex items-center gap-1 bg-[#f5f5f5] text-[#616161] text-sm px-3 py-1.5 rounded-full">
                🐕 {breed}
              </span>
              {weight !== "—" && (
                <span className="flex items-center gap-1 bg-[#f5f5f5] text-[#616161] text-sm px-3 py-1.5 rounded-full">
                  ⚖️ {weight}
                </span>
              )}
            </div>

            {animal.description && (
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-[#212121] mb-2">О питомце</h2>
                <p className="text-sm text-[#616161] leading-relaxed">{animal.description}</p>
              </div>
            )}

            {health.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-[#212121] mb-2">Здоровье</h2>
                <div className="flex flex-wrap gap-2">
                  {health.map((h) => (
                    <span key={h} className="flex items-center gap-1.5 bg-[#e8f5e9] text-[#3a7d44] text-sm px-3 py-1.5 rounded-full font-medium">
                      ✅ {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-extrabold text-[#212121] mb-2">Где находится</h2>
              <p className="flex items-center gap-1.5 text-sm text-[#616161] mb-3">
                <span className="text-[#e53935]"><MapPinIcon /></span>
                {shelter}, {address}
              </p>
              <div className="rounded-2xl overflow-hidden h-48">
                <MapComponent 
                  lat={animal.lat || extra.lat}
                  lng={animal.lng || extra.lng}
                  address={address}
                  height="192"
                  interactive={true}
                />
              </div>
            </div>

            <div className="flex gap-3">
              {isAdopted ? (
                <div className="flex-1 bg-gray-400 text-white font-bold px-6 py-3 rounded-xl text-sm text-center">
                  🏠 Уже усыновлено
                </div>
              ) : (
                <button
                  onClick={handleAdopt}
                  disabled={adopting}
                  className="flex-1 bg-[#3a7d44] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl hover:bg-[#5a9e66] transition-colors text-sm"
                >
                  {adopting ? "Оформление..." : "🏠 Хочу забрать домой"}
                </button>
              )}
              <button className="flex-1 bg-white border-2 border-[#f9a825] text-[#f9a825] font-bold px-6 py-3 rounded-xl hover:bg-[#fff8e1] transition-colors text-sm">
                💛 Помочь приюту
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}