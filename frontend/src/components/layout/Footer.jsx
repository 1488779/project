import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-[#666666] flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 border-b border-text-[#666666]">
          <div className="py-4 flex flex-col gap-4">
            <div className = "flex gap-2 items-center">
              <img src={logo} alt="logo"/>
              <p className="text-[#FFFFFF] text-[20px] font-bold">Лапа Помощи</p>
            </div>
            <div className="space-y-1">
              <p>Платформа, объединяющая неравнодушных</p>
              <p>людей и приюты для животных по всей стране.</p>
            </div>
          </div>
          <div className="py-4 grid grid-cols-2">
            <div className = "space-y-1 flex flex-col gap-4">
              <p className = "text-white font-bold">О платформе</p>
              <p>О проекте</p>
              <p>Как это работает</p>
              <p>Партнеры</p>
            </div>
            <div className = "space-y-1 flex flex-col gap-4">
              <p className = "text-white font-bold">Помощь</p>
              <p>Контакты</p>
              <p>Политика конфиденциальности</p>
            </div>

          </div>
        </div>
        <div>
          © 2026 Платформа "Лапа Помощи". Все права защищены.
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;
