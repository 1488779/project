import selection from "../../assets/selection.png";
import registration from "../../assets/registration.png";
import help from "../../assets/help.png";

function HowItWorks() {
  return (
    <div className = "bg-gray-100">
    <section className="max-w-6xl mx-auto px-4 py-16 text-center flex flex-col gap-8">
      <div >
        <h2 className="text-2xl font-bold mb-8 ">Как это работает</h2>
          <div className = "space-y-1">
            <p>Мы создали простую систему, где каждый может найти способ</p>
            <p>помочь животным, исходя из своих возможностей и времени.</p>
          </div>
      </div>
      

      <div className="grid grid-cols-3 gap-6">
        <div>
          <img src={registration} alt="Регистрация" className="mx-auto mb-4" />

          <h3 className = "mb-2 font-bold text-[22px]">1. Регистрация</h3>
          <div className ="space-y-1">
            <p>Создайте профиль волонтера, выберите</p>
            <p>свои навыки и укажите удобные способы</p>
            <p>помощи.</p>
          </div>
          
        </div>
        <div>
          <img src={selection} alt="Подбор задач" className="mx-auto mb-4" />
          <h3 className = "mb-2 font-bold text-[22px]">2. Подбор задач</h3>
          <div className ="space-y-1">
            <p>Система автоматически предложит вам</p>
            <p>задачи от приютов, которые находятся</p>
            <p>неподалеку.</p>
          </div>
        </div>
        <div>
          <img src={help} alt="Помощь делом" className="mx-auto mb-4" />
          <h3 className = "mb-2 font-bold text-[22px]">3. Помощь делом</h3>
          <div className ="space-y-1">
            <p>Выполняйте задачи, спасайте жизни и</p>
            <p>получайте благодарность от хвостатых</p>
            <p>друзей.</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

export default HowItWorks;