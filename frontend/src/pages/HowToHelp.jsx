const cards = [
  {
    id: 1,
    emoji: "🤝",
    title: "Стать волонтером",
    description: "Помогайте руками: выгуливайте собак, помогайте с уборкой, перевозите корма, социализируйте животных. Выбирайте задачи по своим навыкам и графику.",
    link: "Зарегистрироваться →",
  },
  {
    id: 2,
    emoji: "❤️",
    title: "Пожертвовать",
    description: "Поддержите приюты финансово для закупки качественных кормов, медикаментов и оплаты лечения. Любая сумма важна.",
    link: "Помочь деньгами →",
  },
  {
    id: 3,
    emoji: "🔗",
    title: "Инфо-поддержка",
    description: "Расскажите о нас друзьям в социальных сетях, делайте репосты животных, которые ищут дом. Ваша лента может спасти чью-то жизнь.",
    link: "Поделиться →",
  },
];

export default function HowToHelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-14 pb-26 flex-1">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Как помочь</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-3">
            <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
              {card.emoji}
            </div>
            <p className="font-semibold text-gray-900 text-base">{card.title}</p>
            <p className="text-sm text-gray-500 flex-1">{card.description}</p>
            <button className="text-sm text-green-700 hover:underline text-left">
              {card.link}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
