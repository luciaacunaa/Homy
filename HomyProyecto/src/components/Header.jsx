import { Search, ShoppingCart, MapPin, User, ChevronDown } from "lucide-react";
import { FaGripLines, FaPowerOff } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { MdPayment } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import "./header.css";
import UbicacionMapa from "./ubicacion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
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

export default function Header({ onCartClick, onLoginClick, user, onLogout, cartCount = 0 }) {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Debounced search to avoid firing on every keystroke
  const doSearch = debounce((q) => {
    if (!q || q.trim() === "") {
      setSearchResults([]);
      return;
    }
    fetch(`http://127.0.0.1:5000/api/products/search?query=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(Array.isArray(data) ? data : []);
        setShowSearchResults(true);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSearchResults([]);
      });
  }, 300);

  useEffect(() => {
    return () => doSearch.cancel();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    if (showSearchResults) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);
  useEffect(() => {
    // fallback static categories if none provided from API
    if (!categories || categories.length === 0) {
      setCategories([
        { category_id: "oficina", category_name: "Oficina" },
        { category_id: "bano", category_name: "Baño" },
        { category_id: "dormitorio", category_name: "Dormitorio" },
        { category_id: "cocina", category_name: "Cocina" },
        { category_id: "sala-de-estar", category_name: "Sala de estar" },
        { category_id: "jardin-aire-libre", category_name: "Jardín y aire libre" },
      ]);
    }
  }, []); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
    }
    if (showCategories) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories]);
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
              position: "relative",
            }}
            ref={searchRef}
          >
            <div
              style={{
                borderRadius: "40px",
                boxShadow: "#dec96ac9",
                display: "flex",
                alignItems: "center",
                width: "100%",
                background: "#fff",
              }}
            >
              <input
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  doSearch(val);
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchResults(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowSearchResults(false);
                    navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="Buscá productos y más..."
                style={{
                  flex: 1,
                  border: "none",
                  padding: "8px 12px",
                  outline: "none",
                  borderRadius: "40px",
                }}
              />
              <button
                onClick={() => {
                  setShowSearchResults(false);
                  navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
                }}
                style={{
                  borderTopLeftRadius: "40px",
                  borderBottomLeftRadius: "40px",
                  borderTopRightRadius: "40px",
                  borderBottomRightRadius: "40px",
                  height: "40px",
                  width: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Search size={18} />
              </button>
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  borderRadius: 8,
                  zIndex: 1000,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {searchResults.map((p) => (
                  <div
                    key={p.products_id}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery(p.products_name);
                      navigate(`/products?q=${encodeURIComponent(p.products_name)}`);
                    }}
                    style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}
                  >
                    <strong style={{ color: "#333" }}>{p.products_name}</strong>
                    {p.price !== undefined && (
                      <span style={{ float: "right", color: "#666" }}>${p.price}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                      navigate("/favourites");
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
            className="header-btn header-btn-alignment cart-badge"
            onClick={onCartClick}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </nav>
      {/* Íconos de acciones */}
    </header>
  );
}
