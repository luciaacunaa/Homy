import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import { FaGripLines, FaPowerOff } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { MdPayment } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import "./header.css";
import UbicacionMapa from "./ubicacion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
function PromocionesModal({ open, onClose, images }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          maxWidth: 700,
          width: "90vw",
          boxShadow: "0 0 0 3px #f5edce",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#f5edce",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
        <h2 style={{ color: "#48601c", marginBottom: 16 }}>Promociones</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {images && images.length > 0 ? (
            images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`promo-${idx}`}
                style={{
                  maxWidth: 250,
                  maxHeight: 180,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #0002",
                }}
              />
            ))
          ) : (
            <span style={{ color: "#888" }}>
              No hay imágenes de promociones aún.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header({ onCartClick, onLoginClick, user, onLogout }) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    }
    if (showAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountMenu]);
  const [showMap, setShowMap] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();
  const handleOpenMap = () => setShowMap(true);
  const handleCloseMap = () => setShowMap(false);
  const handleOpenPromos = () => navigate("/promotions");
  const handleOpenPayment = () => navigate("/payment");
  return (
    <header className="header">
      <nav className="nav-container">
        {/* Barra superior */}
        {/* Buscador centrado */}
        <div
          className="container"
          style={{
            gap: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <img
            src="/promos/logo grande.PNG"
            alt="Logo Homy"
            style={{
              height: 64,
              width: 64,
              marginRight: 24,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          />
          <div style={{ position: "relative" }} ref={categoriesRef}>
            <button
              className="header-btn-alignment"
              onClick={() => setShowCategories((s) => !s)}
            >
              <FaGripLines size={15} /> Categorías
            </button>
            {showCategories && (
              <div
                className="categories-dropdown"
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  background: "#fff4e0",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat.category_id}
                    className="category-item"
                    onClick={() => {
                      setShowCategories(false);
                      navigate(`/category/${cat.category_id}`);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                  >
                    {cat.category_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="header-btn-alignment" onClick={handleOpenPromos}>
            <CiDiscount1 size={18} /> Promociones
          </button>
          <button className="header-btn-alignment" onClick={handleOpenPayment}>
            <MdPayment size={18} /> Medios de pago
          </button>
        </div>

        {/* Links alineados a la derecha */}
        <div
          className="search-bar"
          style={{
            width: "320px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "40px 40px 40px 40px",
              boxShadow: "#dec96ac9",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <input type="text" placeholder="Buscá productos y más..." />
            <button
              style={{
                borderTopLeftRadius: "40px",
                borderBottomLeftRadius: "40px",
                borderTopRightRadius: "40px",
                borderBottomRightRadius: "40px",
                height: "40px",
              }}
            >
              <Search size={18} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {" "}
          {/*carrito, ubi, ingresar*/}
          <button
            className="header-btn header-btn-alignment"
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleOpenMap}
          >
            <MapPin size={18} />
            <span> Ubicación</span>
          </button>
          {showMap && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
              onClick={handleCloseMap}
            >
              <div
                style={{
                  position: "relative",
                  background: "#fff",
                  borderRadius: 8,
                  padding: 16,
                  maxWidth: 700,
                  width: "90vw",
                  boxShadow: "0 0 0 3px #f5edce",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseMap}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#f5edce",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
                <h2 style={{ color: "#48601c", marginBottom: 16 }}>
                  Ubicación
                </h2>
                <UbicacionMapa />
              </div>
            </div>
          )}
          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                position: "relative",
              }}
            >
              <button
                className="header-btn header-btn-alignment"
                style={{ fontWeight: "bold", color: "#48601c" }}
                onClick={() => setShowAccountMenu((s) => !s)}
              >
                <User size={18} />
                <span> {user.customers_name}</span>
              </button>
              {showAccountMenu && (
                <div
                  ref={accountMenuRef}
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px #0002",
                    minWidth: 120,
                    zIndex: 1001,
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      color: "#48601c",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 15,
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      setShowAccountMenu(false);
                      navigate("/favoritos");
                    }}
                  >
                    Favoritos
                  </button>
                  <button
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      color: "#48601c",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 15,
                      borderRadius: 8,
                    }}
                    onClick={() => {
                      setShowAccountMenu(false);
                      onLogout();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="header-btn header-btn-alignment"
              onClick={onLoginClick}
            >
              <User size={18} />
              <span> Ingresar</span>
            </button>
          )}
          <button
            className="header-btn header-btn-alignment"
            onClick={onCartClick}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </nav>
      {/* Íconos de acciones */}
    </header>
  );
}
