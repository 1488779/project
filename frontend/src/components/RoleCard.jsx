export default function RoleCard({ image, title, description, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`border-2 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? 'border-green-600 shadow-lg bg-green-50' 
          : 'border-gray-200 hover:border-green-600 hover:shadow-md'
        }`}
    >
      <div className="flex justify-center mb-5">
        <img 
          src={image} 
          alt={title}
          className="w-15 h-15 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="font-semibold text-xl mb-3 text-gray-800">
        {title}
      </h3>

      <p className="text-gray-600 text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
