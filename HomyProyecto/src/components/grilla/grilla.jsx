import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "./grilla.css";

const ProductList = ({ addToCart, removeFromCart, cartItems }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('homy_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('homy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        // normalize product shape used by Favorites.jsx
        const normalized = { ...product, name: product.name || product.products_name };
        return [normalized, ...prev];
      }
    });
  };

  // small helper to trigger the CSS animation class for the clicked icon
  const triggerAnimation = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.classList.add('animate');
    setTimeout(() => el.classList.remove('animate'), 350);
  };

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    fetch("http://127.0.0.1:5000/products")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const productosConId = data.map((prod) => ({
          ...prod,
          id: prod.products_id,
          name: prod.products_name,
          image_url: `http://127.0.0.1:5000/image/${prod.products_id}`
        }));
        setProducts(productosConId);
      })
      .catch((err) => {
        console.error("Error al traer productos:", err);
        setError(err.message || String(err));
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // función para ocultar un producto
  const handleHideProduct = (id) => {
    setHiddenProducts((prev) => [...prev, id]);
  };

  /*const visibleProducts = products.filter(
    (product) => !hiddenProducts.includes(product.id)
  );*/

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#48601c" }}>
        Lista de Productos
      </h1>

      <div className="product-container">
        {loading ? (
          <div style={{ textAlign: 'center' }}>Cargando productos...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#b00' }}>
            <p>Error cargando productos: {error}</p>
            <button onClick={loadProducts} style={{ background: '#48601c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Reintentar</button>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              {/* Mostrar la imagen si existe */}
              <img
                src={product.image_url}
                alt={product.name}
                
              />

              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                {favorites.find(f => f.id === product.id) ? (
                  <span className="favorite-icon" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); triggerAnimation(e); }}>
                    <FaHeart className="heart-svg" style={{ color: 'red', cursor: 'pointer' }} />
                  </span>
                ) : (
                  <span className="favorite-icon" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); triggerAnimation(e); }}>
                    <FaRegHeart className="heart-svg" style={{ color: '#999', cursor: 'pointer' }} />
                  </span>
                )}
              </div>

              <p>{product.products_name}</p>
              <p>
                <strong>Precio:</strong> ${product.price}
              </p>

              {(() => {
                const cartItem = cartItems?.find(
                  (item) => item.id === product.id
                );
                if (cartItem) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button onClick={() => removeFromCart(product)}>-</button>
                      <span>{cartItem.quantity}</span>
                      <button onClick={() => addToCart(product)}>+</button>
                    </div>
                  );
                } else {
                  return (
                    <button onClick={() => addToCart(product)}>
                      Agregar al carrito
                    </button>
                  );
                }
              })()}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Cargando productos...</p>
        )}
      </div>
    </>
  );
};

export default ProductList;
