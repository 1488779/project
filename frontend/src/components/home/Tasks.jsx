import delivery from "../../assets/tasks/delivery.png";
import fix from "../../assets/tasks/fix.png";
import walking from "../../assets/tasks/walking.png";


const tasks = [
  {
    title: "Доставить 20кг корма",
    shelter: "Добрые руки",
    distance: "2.3",
    icon: "delivery",
  },
  {
    title: "Выгулять 3-х собак",
    shelter: "Счастливый хвост",
    distance: "4.1",
    icon: "walking",
  },
  {
    title: "Ремонт крыши вольера",
    shelter: "Новый дом",
    distance: "5.8",
    icon: "fix",
  },
];

const iconMap = {
  delivery,
  walking,
  fix,
};


function Tasks() {
  return (
    <div className = "bg-gray-100">
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Актуальные задачи</h2>

      <div className="flex items-center mb-6">
        <p className="text-gray-600">Помощь нужна прямо сейчас</p>
        <a href="#" className="text-[#2E7D32] font-semibold flex justify-between items-center ml-auto">
          Все задачи →
        </a>
      </div>
    
      <div className="grid grid-cols-3 gap-6">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm "
          >
            <div className="flex gap-4 pb-4 mb-4 border-b border-gray-200">
              <div className="flex flex-col justify-start"><img src={iconMap[task.icon]}/></div>
              <div className="flex flex-col gap-3 ">
                <div className="font-bold">{task.title}</div>
                <div className="text-sm text-gray-600">
                  Приют: {task.shelter}
                </div>

                <span className="bg-[#F5F5F5] px-2 py-1 rounded text-sm w-fit">
                  📍 {task.distance} км от вас
                </span>
              </div>
            </div>
              <a href="#" className="text-[#2E7D32] font-semibold flex items-center">
                  Посмотреть задачу →
              </a>
            </div>
        ))}
      </div>
    </section>
    </div>
  );
}

export default Tasks;