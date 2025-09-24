import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import './header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        {/* Barra superior */}
            {/* Buscador centrado */}
          <div className="search-bar" style={{ gap: '20px', display: 'flex', flexWrap: 'wrap'}}>
            <button>
              Categorías <ChevronDown size={16} />
            </button>
            <button>Promociones</button>
            <button>Medios de pago</button>
          </div>

          {/* Links alineados a la derecha */}
              <div className="search-bar" style={{width: '320px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style={{borderRadius: '40px 40px 40px 40px', boxShadow: '#ddd5b2c9', display: 'flex', alignItems: 'center', width: '100%'}}>
                  <input
                    type="text"
                    placeholder="Buscá productos y más..."
                    
                  />
                  <button style={{borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', borderTopRightRadius: '40px', borderBottomRightRadius: '40px', height: '40px'}}>
                    <Search size={18} />
                  </button>
                  </div>
                </div>
              <div style={{width: '200px'}}>
                <button>
                  <MapPin size={18} />
                  <span>Ubicación</span>
                </button>
                <button>
                  <User size={18} />
                  <span>Ingresar</span>
                </button>
                <button>
                  <ShoppingCart size={20} />
                </button>
              </div>
      </nav>
      {/* Íconos de acciones */}
      
    </header>
  );
}
