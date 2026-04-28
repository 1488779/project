import plug from "../../assets/plug.png";

const animals = [
  { name: "Рекс", age: "3 года" },
  { name: "Мурка", age: "1 год" },
  { name: "Бобик", age: "5 лет" },
  { name: "Снежок", age: "2 года" },
];

function Animals() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Ждут своих людей</h2>
      <div className = "flex">
        <p className="text-gray-600 mb-4">
          Эти животные готовы стать членами вашей семьи
        </p>
        <a href="#" className="text-[#2E7D32] font-semibold flex justify-between items-center ml-auto mb-6">
          Смотреть всех →
        </a>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {animals.map((a, i) => (
          <div key={i} className="bg-white rounded-xl p-4 ">
            <div className = " border-b border-gray-200 pb-4 mb-4">
              <div className="h-[220px] bg-gray-200 mb-3 rounded-md">
                <img src={plug} alt="plug" className="w-full h-full object-cover rounded-md" />
              </div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-gray-500 text-sm">{a.age}</p>
            </div>
            <a href="#" className="text-[#2E7D32] font-semibold flex items-center">
              Помочь животному →
            </a>
          </div>
        ))}
      </div>
       
    </section>
  );
}

export default Animals;