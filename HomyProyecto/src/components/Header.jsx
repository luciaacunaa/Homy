
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function PromocionesModal({ open, onClose, images }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
      onClick={onClose}
    >
      <div style={{ position: 'relative', background: '#fff', borderRadius: 8, padding: 24, maxWidth: 700, width: '90vw', boxShadow: '0 0 0 3px #f5edce', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: '#f5edce', border: 'none', fontSize: 24, cursor: 'pointer', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        <h2 style={{ color: '#48601c', marginBottom: 16 }}>Promociones</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {images && images.length > 0 ? images.map((img, idx) => (
            <img key={idx} src={img} alt={`promo-${idx}`} style={{ maxWidth: 250, maxHeight: 180, borderRadius: 8, boxShadow: '0 2px 8px #0002' }} />
          )) : <span style={{ color: '#888' }}>No hay imágenes de promociones aún.</span>}
        </div>
      </div>
    </div>
  );
}
import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import { FaGripLines, FaPowerOff } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { MdPayment } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import './header.css';

export default function Header({ onCartClick, onLoginClick, user, onLogout }) {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const handleOpenMap = () => setShowMap(true);
  const handleCloseMap = () => setShowMap(false);
  const handleOpenPromos = () => navigate('/promotions');
  return (
   <header className="header">
     <nav className="nav-container">
       {/* Barra superior */}
           {/* Buscador centrado */}
         <div className="container" style={{ gap: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
           <img
             src="/promos/logo grande.PNG"
             alt="Logo Homy"
             style={{ height: 64, width: 64, marginRight: 24, borderRadius: '50%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
             onClick={() => navigate('/')} 
           />
           <button className="header-btn-alignment">
             < FaGripLines size={15} /> Categorías
           </button>
           <button className="header-btn-alignment" onClick={handleOpenPromos}>
             <CiDiscount1 size={18} />  Promociones
           </button>
           <button className="header-btn-alignment"><MdPayment  size={18}/>  Medios de pago</button>
         </div>


         {/* Links alineados a la derecha */}
             <div className="search-bar" style={{width: '320px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <div style={{borderRadius: '40px 40px 40px 40px',boxShadow: '#dec96ac9', display: 'flex', alignItems: 'center', width: '100%'}}>
                 <input
                   type="text"
                   placeholder="Buscá productos y más..."
                  
                 />
                 <button style={{borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', borderTopRightRadius: '40px', borderBottomRightRadius: '40px', height: '40px'}}>
                   <Search size={18} />
                 </button>
                 </div>
               </div>
             <div style={{ display: 'flex', gap: '20px', alignItems: 'center'}}>  {/*carrito, ubi, ingresar*/}
               <button
                 className="header-btn header-btn-alignment"
                 style={{ display: 'flex', alignItems: 'center' }}
                 onClick={handleOpenMap}
               >
                 <MapPin size={18} />
                 <span>  Ubicación</span>
               </button>
               {showMap && (
                 <div style={{
                   position: 'fixed',
                   top: 0,
                   left: 0,
                   width: '100vw',
                   height: '100vh',
                   background: 'rgba(0,0,0,0.5)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: 9999
                 }}
                   onClick={handleCloseMap}
                 >
                   <div style={{ position: 'relative', background: '#48601c', borderRadius: 8, padding: 16, maxWidth: 600, width: '90vw', boxShadow: '0 0 0 3px #f5edce' }} onClick={e => e.stopPropagation()}>
                     <button onClick={handleCloseMap} style={{ position: 'absolute', top: 8, right: 8, background: '#f5edce', border: 'none', fontSize: 24, cursor: 'pointer', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                     <div style={{ textAlign: 'center', marginBottom: 8 }}>
                       <span style={{ color: '#f5edce', fontWeight: 'bold', fontSize: 18, display: 'inline-block', margin: '0 auto 8px auto', background: 'transparent' }}>Ubicación en Google Maps</span>
                     </div>
                           <div style={{ marginTop: 8, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                             <a href="https://maps.app.goo.gl/SMSZfqBYi664c8eQA" target="_blank" rel="noopener noreferrer" style={{ color: '#f5edce', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                               Ver en Google Maps
                               <GrMapLocation style={{ marginLeft: 4, fontSize: 20 }} />
                             </a>
                           </div>
                   </div>
                 </div>
               )}
               {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button className="header-btn header-btn-alignment" style={{ fontWeight: 'bold', color: '#48601c' }}>
                    <User size={18} />
                    <span> {user.customers_name}</span>
                  </button>
                  <button className="logout-icon-btn" onClick={onLogout} title="Cerrar sesión">
                    <FaPowerOff size={15} />
                  </button>
                </div>
               ) : (
                 <button className="header-btn header-btn-alignment" onClick={onLoginClick}>
                   <User size={18} />
                   <span> Ingresar</span>
                 </button>
               )}
               <button className="header-btn header-btn-alignment" onClick={onCartClick}>
                 <ShoppingCart size={18} />
               </button>
             </div>
     </nav>
     {/* Íconos de acciones */}

    
   </header>
 );
}
