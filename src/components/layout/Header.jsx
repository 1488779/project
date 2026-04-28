import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src={logo} alt="logo" />
          <Link to="/" className="font-bold text-lg">
          Лапа Помощи
        </Link>
        </div>
        

        <nav className="flex gap-6">
          <Link className = "text-[16px] text-[#666666]" to="/">📍 Екатеринбург ▼</Link>
          <Link to="/">О проекте</Link>
          <Link to="/shelters">Приюты</Link>
          <Link to="/animals">Животные</Link>
          <Link to="/how-it-works">Как помочь</Link>
        </nav>
        <div className="flex gap-4">
        <button className="border px-6 py-3 rounded-lg">
            Войти
          </button>
        <button className="bg-[#2E7D32] text-white px-6 py-3 rounded-lg">
            Регистрация
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;