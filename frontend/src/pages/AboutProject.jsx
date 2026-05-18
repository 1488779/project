import React from 'react';

const AboutProject = () => {
  return (
    <main className="bg-gray-50 pt-16 pb-22">
      <div className="max-w-4xl mx-auto px-6">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          О проекте
        </h1>

        {/* Белая карточка с текстом */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
          <p className="text-gray-700 leading-relaxed mb-6">
            Мы — платформа, объединяющая неравнодушных людей и приюты для животных по всей стране.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Наша миссия — сделать помощь бездомным животным простой, прозрачной и доступной каждому. Мы верим, что даже небольшое усилие может спасти жизнь.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Платформа создана в рамках учебного проекта для поддержки волонтёрского движения. Все данные и функциональность носят демонстрационный характер.
          </p>
        </div>

      </div>
    </main>
  );
};

export default AboutProject;