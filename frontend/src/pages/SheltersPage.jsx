import { useEffect, useState } from "react";
import { api } from "../api";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default function SheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    api.getShelters()
      .then((res) => setShelters(res?.data ?? res ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-gray-50 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="max-w-3xl mb-10 ml-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Приюты, которым нужна помощь</h2>
          <p className="text-lg text-gray-600">Поддержите организации, которые заботятся о бездомных животных.</p>
        </div>

        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{shelter.orgName}</h3>
                    <p className="text-gray-500 text-base">{shelter.address}</p>
                    {shelter.description && (
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{shelter.description}</p>
                    )}
                  </div>
                  <span className="text-green-600 font-medium">
                    Посмотреть приют
                    <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              ))
          }
          {!loading && !error && shelters.length === 0 && (
            <p className="col-span-3 text-center text-gray-400 py-12">Приютов пока нет</p>
          )}
        </div>
      </div>
    </main>
  );
}
