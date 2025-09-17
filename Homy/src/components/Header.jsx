import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import "./header.css"

export default function Header() {
  return (
    <header className="header">
      <nav className="bg-red-700 text-white text-sm">
      {/*Barra superior */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* Buscador */}
          <div className="flex-1 mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscá productos, marcas y más..."
                className="w-full rounded-full px-4 py-2 text-black focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 hover:bg-red-800 p-2 rounded-full">
                <Search size={18} />
              </button>
            </div>
          </div>

          
        </div>
      </div>

      {/*Menu inf.*/}
        <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-2">
          <button className="flex items-center gap-1 font-semibold hover:underline">
            Categorías <ChevronDown size={16} />
          </button>
          <button className="hover:underline">Promociones</button>
          <button className="hover:underline">Medios de pago</button>

          {/* Links alineados a la derecha */}
          <div className="ml-auto flex gap-4">
            <a href="#" className="hover:underline">Instalaciones</a>
            <a href="#" className="hover:underline">Locales</a>
          </div>
        </div>
      </nav>
      {/* Íconos de acciones */}
          <div className="flex items-center gap-6 text-sm">
            <button className="flex items-center gap-1 hover:underline">
              <MapPin size={18} />
              <span>Ubicación</span>
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <User size={18} />
              <span>Ingresar</span>
            </button>
            <button className="bg-red-700 hover:bg-red-800 p-3 rounded-full">
              <ShoppingCart size={20} />
            </button>
          </div>
    </header>
  );
}
