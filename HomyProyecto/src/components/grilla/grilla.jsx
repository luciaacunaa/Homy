import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./grilla.css";

const ProductList = ({ addToCart, removeFromCart, cartItems, user, onLoginClick }) => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==============================
  // ❤️ Guardar favoritos en localStorage por usuario
  // ==============================
  const favKey = user ? `homy_favorites_${user.id || user.customers_id}` : "homy_favorites_guest";

  useEffect(() => {
    const saved = localStorage.getItem(favKey);
    if (saved) setFavorites(JSON.parse(saved));
  }, [favKey]);

  useEffect(() => {
    localStorage.setItem(favKey, JSON.stringify(favorites));
  }, [favorites, favKey]);

  const toggleFavorite = (product) => {
    if (!user) {
      if (onLoginClick) onLoginClick();
      return;
    }
    setFavorites((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  // ==============================
  // 🚀 Cargar productos e imágenes juntas
  // ==============================
 useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Traer productos
      const resProd = await fetch("http://127.0.0.1:5000/api/products", { mode: "cors" });
      if (!resProd.ok) throw new Error(`HTTP ${resProd.status}`);
      const data = await resProd.json();

      // 2️⃣ Normalizar productos (usamos el id correcto)
      let items = (Array.isArray(data) ? data : data.products || []).map((prod) => ({
        id: prod.products_id || prod.id,
        name: prod.products_name || prod.name,
        price: prod.price || 0,
      }));
      
      // 3️⃣ Quitar duplicados simples
      const seen = new Set();
      items = items.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      
      // 4️⃣ Filtrar IDs no deseados (solo lo esencial)
      items = items.filter((p) => ![ 95, 112, 128].includes(p.id));
      
      console.log(items)
      // 5️⃣ Traer imagen correspondiente (mismo id)
      const withImages = await Promise.all(
        items.map(async (prod) => {
          try {
            const resImg = await fetch(`http://127.0.0.1:5000/api/images/${prod.id}`, { mode: "cors" });
            if (!resImg.ok) return prod;
            const json = await resImg.json();
            const url = json.image_url || json.url || null;
            if (url) {
              prod.image_url = url.startsWith("http")
                ? url
                : `http://127.0.0.1:5000/${url.replace(/^\/+/, "")}`;
            }
            return prod;
          } catch {
            return prod;
          }
        })
      );

      setProducts(withImages);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);


  // ==============================
  // 🛒 Renderizado
  // ==============================
  if (loading) return <p style={{ textAlign: "center" }}>Cargando productos...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  return (
    <div className="product-container">
      {products.map((product) => {
        const isFav = favorites.some((f) => f.id === product.id);

        return (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              <img
                src={product.image_url || "product_not_found.png"}
                alt={product.name}
                onError={(e) => (e.currentTarget.src = "/product_not_found.png")}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <button className="fav-button" onClick={() => toggleFavorite(product)}>
                {isFav ? <FaHeart color="red" /> : <FaRegHeart color="#888" />}
              </button>
            </div>

            <h3>{product.name}</h3>
            <p>Precio: ${product.price}</p>

            {cartItems?.find((item) => item.id === product.id) ? (
              <div className="cart-controls">
                <button onClick={() => removeFromCart(product)}>-</button>
                <span>{cartItems.find((i) => i.id === product.id).quantity}</span>
                <button onClick={() => addToCart(product)}>+</button>
              </div>
            ) : (
              <button className="add-cart-btn" onClick={() => addToCart(product)}>
                Agregar al carrito
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
