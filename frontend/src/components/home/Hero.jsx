import dog from "../../assets/dog.png";
import paws from "../../assets/paws.png";
import mark from "../../assets/mark.png";
import heard from "../../assets/heard.png";

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-between gap-10">
      <div className="max-w-lg">
        <div className = "flex items-center gap-2 mb-4">
          <span className="bg-[#F0F0F0] text-[#2E7D32] mb-2 flex gap-4 items-center rounded-lg">
            <img src={paws} className="w-[14hug] h-[20hug] shrink-0"/> 
            Платформа добрых дел
          </span>
        </div>

        <h1 className="text-7xl font-extrabold mb-4">
          Помогать <br></br> животным <span className="text-[#2E7D32]"><br></br> стало проще</span>
        </h1>

        <p className="text-gray-600 mb-6">
            Присоединяйтесь к крупнейшему сообществу
            волонтеров и приютов. Найдите задачи рядом с
            вами, помогите делом или найдите нового друга.
        </p>

        <div className="flex gap-4 mb-4">
          <button className="bg-[#2E7D32] text-white px-6 py-3 rounded-full">
            Начать помогать
          </button>

          <button className="border px-6 py-3 rounded-full">
            Найти приют
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={mark} alt="mark" />
            <p>Проверенные приюты</p>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <img src={heard} alt="heard" />
            <p>Тысячи спасенных жизней</p>
          </div>
        </div>
      </div>


      <div className="relative w-fit">

        <img
          src={dog}
          alt=""
        />
      </div>

      
    </section>
  );
}

export default Hero;