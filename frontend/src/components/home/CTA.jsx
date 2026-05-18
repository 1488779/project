import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="bg-[#2E7D32] text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Готовы изменить чью-то жизнь?
      </h2>
      <div className = "space-y-1 pb-4">
        <p>Присоединяйтесь к нам сегодня и станьте частью большого</p>
        <p>доброго дела. Любая помощь имеет значение.</p>
      </div>
      <Link className="bg-white text-[#2E7D32] px-6 py-3 rounded-full" to="/role-selection">
        Стать волонтером
      </Link>
      
    </section>
    
  );
}

export default CTA;