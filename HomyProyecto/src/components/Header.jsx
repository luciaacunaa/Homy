import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import { FaGripLines } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { MdPayment } from "react-icons/md";
import './header.css';

export default function Header({ onCartClick, onLoginClick, user, onLogout }) {

 return (
   <header className="header">
     <nav className="nav-container">
       {/* Barra superior */}
           {/* Buscador centrado */}
         <div className="container" style={{ gap: '20px', display: 'flex', flexWrap: 'wrap'}}>
           <button className="header-btn-alignment">
             < FaGripLines size={15} /> Categorías
           </button>
           <button className="header-btn-alignment">
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
               <button className="header-btn header-btn-alignment" >
                 <MapPin size={18} />
                 <span>  Ubicación</span>
               </button>
               {user ? (
                 <>
                   <button className="header-btn header-btn-alignment" style={{ fontWeight: 'bold', color: '#48601c' }}>
                     <User size={18} />
                     <span> {user.customers_name}</span>
                   </button>
                   <button className="header-btn header-btn-alignment" onClick={onLogout} style={{ marginLeft: 8, color: '#b22222', fontWeight: 'bold' }}>
                     Cerrar sesión
                   </button>
                 </>
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
