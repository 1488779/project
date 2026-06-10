import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const ANIMAL_TYPES = ["Собака", "Кошка", "Кролик", "Птица", "Другое"];
const DISTRICTS    = ["Центральный", "Юго-Западный", "Северный", "Ленинский", "Октябрьский"];

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function VolunteerCard({ vol, onSendRequest, isSending, isSendingForThis, isSent }) {
  const user = vol.user ?? {};
  const name = user.fullName ?? `Волонтёр #${vol.id}`;
  const available = vol.availableTime ?? (vol.maxFosterDays ? `До ${vol.maxFosterDays} дней передержки` : "Уточните у волонтёра");

  if (isSent) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 opacity-70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shrink-0">
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              {user.city && <>{user.city} · </>}
              <StarIcon /> {vol.extraData?.rating ?? "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{available}</p>
          </div>
        </div>
        <div className="shrink-0 bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-xl">
          ✓ Заявка отправлена
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shrink-0">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            {user.city && <>{user.city} · </>}
            <StarIcon /> {vol.extraData?.rating ?? "—"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{available}</p>
        </div>
      </div>
      <button 
        onClick={() => onSendRequest(vol)}
        disabled={isSending && isSendingForThis}
        className={`shrink-0 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
          isSending && isSendingForThis 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-green-700 hover:bg-green-800"
        }`}
      >
        {isSending && isSendingForThis ? "Отправка..." : "Отправить заявку"}
      </button>
    </div>
  );
}

function SkeletonVol() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-32 h-9 bg-gray-200 rounded-xl shrink-0" />
    </div>
  );
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [animalType, setAnimalType] = useState("Собака");
  const [days, setDays]             = useState("14");
  const [needsMeds, setNeedsMeds]   = useState(false);
  const [district, setDistrict]     = useState("");
  const [searched, setSearched]     = useState(false);

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  
  const [sending, setSending]       = useState(false);
  const [sendingId, setSendingId]   = useState(null);
  const [sentIds, setSentIds]       = useState([]);

  const handleSearch = () => {
    setSearched(true);
    setLoading(true);
    setError(null);
    api.getVolunteers()
      .then((data) => {
        const volunteersList = data?.data ?? data ?? [];
        const filtered = volunteersList.filter((v) => {
          if (!v.considersFoster) return false;
          if (needsMeds && !v.skills?.includes("Ветеринария")) return false;
          if (district && v.districts?.length > 0 && !v.districts.includes(district)) return false;
          return true;
        });
        setVolunteers(filtered);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const handleSendRequest = async (volunteer) => {
  if (!user) return;
  
  if (sending) return;
  if (sentIds.includes(volunteer.id)) return;
  
  setSending(true);
  setSendingId(volunteer.id);
  
  try {
    await api.createFosterRequest({
      animalType: animalType,
      days: parseInt(days),
      needsMeds: needsMeds,
      volunteerId: volunteer.id,
      message: `Заявка на передержку ${animalType} на ${days} дней`
    });
    
    setSentIds((prev) => [...prev, volunteer.id]);
  } catch (err) {
    console.error("Ошибка:", err);
  } finally {
    setSending(false);
    setSendingId(null);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Поиск передержки для питомца</h1>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Тип животного</label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-green-500"
              >
                {ANIMAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Срок передержки (дней)</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="14"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center mb-5">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={needsMeds}
                onChange={(e) => setNeedsMeds(e.target.checked)}
                className="accent-green-700 w-4 h-4"
              />
              Нужны лекарства?
            </label>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Район</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-green-500"
              >
                <option value="">Любой</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors"
          >
            Найти
          </button>
        </div>

        {searched && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Волонтёры с навыком «передержка»
            </h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex flex-col gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonVol key={i} />)
                : volunteers.length === 0
                  ? <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">Волонтёров по этим параметрам не найдено</div>
                  : volunteers.map((vol) => (
                      <VolunteerCard 
                        key={vol.id} 
                        vol={vol} 
                        onSendRequest={handleSendRequest}
                        isSending={sending}
                        isSendingForThis={sendingId === vol.id}
                        isSent={sentIds.includes(vol.id)}
                      />
                    ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}