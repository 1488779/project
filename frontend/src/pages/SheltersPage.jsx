import React from 'react';

const SheltersSection = () => {
  const shelters = [
    {
      id: 1,
      name: 'Приют "Добрые руки"',
      city: 'г. Екатеринбург',
      address: 'ул. Мира, 28',
      animals: 45,
    },
    {
      id: 2,
      name: 'Приют "Счастливый хвост"',
      city: 'г. Екатеринбург',
      address: 'пр. Ленина, 15',
      animals: 32,
    },
    {
      id: 3,
      name: 'Приют "Новый дом"',
      city: 'г. Екатеринбург',
      address: 'ул. Садовая, 78',
      animals: 28,
    },
  ];

  return (
    <main className="bg-gray-50 pt-10 pb-12">   {/* Главное изменение здесь */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        
        <div className="max-w-3xl mb-10 ml-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Приюты, которым нужна помощь
          </h2>
          <p className="text-lg text-gray-600">
            Поддержите организации, которые заботятся о бездомных животных.
          </p>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {shelters.map((shelter) => (
            <div
              key={shelter.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {shelter.name}
                </h3>
                <p className="text-gray-500 text-base">
                  {shelter.city}, {shelter.address}
                </p>
                 <p className="text-gray-500">{shelter.animals} животных на попечении</p>
              </div>

              <a
                href="#"
                className="w-full text-green-600 font-medium py-3.5 rounded-2xl"
              >
                Посмотреть приют
                <span className="ml-2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Кнопка */}
        <div className="mt-10 text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl text-base font-medium transition-colors">
            Показать все приюты
          </button>
        </div>
      </div>
    </main>
  );
};

export default SheltersSection;