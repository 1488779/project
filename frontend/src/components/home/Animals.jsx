import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import plug from "../../assets/plug.png";
import { api } from "../../api";

export default function Animals() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnimals()
      .then((data) => setAnimals((data ?? []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const placeholders = [
    { id: "p1", name: "Рекс",   age: "3 года" },
    { id: "p2", name: "Мурка",  age: "1 год"  },
    { id: "p3", name: "Бобик",  age: "5 лет"  },
    { id: "p4", name: "Снежок", age: "2 года"  },
  ];

  const items = loading
    ? placeholders
    : animals.length > 0
      ? animals
      : placeholders;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Ждут своих людей</h2>
      <div className="flex">
        <p className="text-gray-600 mb-4">Эти животные готовы стать членами вашей семьи</p>
        <Link className="text-[#2E7D32] font-semibold flex justify-between items-center ml-auto mb-6" to="/animals-page">
          Смотреть всех →
        </Link>
      </div>

      <div className={`grid grid-cols-4 gap-6 ${loading ? "opacity-60 animate-pulse" : ""}`}>
        {items.map((a) => (
          <div key={a.id} className="bg-white rounded-xl p-4">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="h-55 bg-gray-200 mb-3 rounded-md">
                <img src={(a.extraData?.photo) ?? plug} alt={a.name} className="w-full h-full object-cover rounded-md" />
              </div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-gray-500 text-sm">{a.age}</p>
            </div>
            <Link to={`/animals/${a.id}`} className="text-[#2E7D32] font-semibold flex items-center">
              Помочь животному →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
