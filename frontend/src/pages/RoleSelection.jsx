import { useState } from "react";
import RoleCard from "../components/RoleCard";
import { useNavigate } from "react-router-dom";

import volunteerImg from "../assets/roles/volunteer.png";
import shelterImg from "../assets/roles/shelter.png";
import overexposureImg from "../assets/roles/overexposure.png";

export default function RoleSelection() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
        navigate(`/register/${selectedRole}`);
        console.log("Переходим с ролью:", selectedRole);
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="w-full max-w-230">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            
            <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900">
              Выберите свою роль
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                image={volunteerImg}
                title="Волонтер"
                description="Помогаю животным в свободное время: выгуливаю, доставляю корм, участвую в мероприятиях"
                isSelected={selectedRole === "volunteer"}
                onClick={() => setSelectedRole("volunteer")}
              />
              <RoleCard
                image={shelterImg}
                title="Приют"
                description="Предоставляю приют для животных и ищу волонтёров для помощи"
                isSelected={selectedRole === "shelter"}
                onClick={() => setSelectedRole("shelter")}
              />
              <RoleCard
                image={overexposureImg}
                title="Передержка"
                description="Готов временно взять животное на передержку до поиска постоянного дома"
                isSelected={selectedRole === "overexposure"}
                onClick={() => setSelectedRole("overexposure")}
              />
            </div>

            <button 
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`mt-10 font-medium px-10 py-3.5 rounded-2xl text-lg transition
                ${selectedRole 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Продолжить
            </button>

            <p className="mt-6 text-gray-500">
              Уже есть аккаунт?{" "}
              <a href="#" className="text-green-600 hover:underline font-medium">
                Войти
              </a>
              
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}