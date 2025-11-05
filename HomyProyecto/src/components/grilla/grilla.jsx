import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./grilla.css";

const ProductList = ({
  addToCart,
  removeFromCart,
  cartItems,
  user,
  onLoginClick,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenProducts, setHiddenProducts] = useState([]);
  // Favorites are stored per-user. If there's no user, favorites are empty
  const params = useParams();
  const location = useLocation();

  const makeKey = (u) => {
    if (!u) return null;
    return `homy_favorites_${
      u.customers_email || u.email || u.customers_id || u.id
    }`;
  };

  const favKey = makeKey(user);

  const [favorites, setFavorites] = useState(() => {
    if (!favKey) return [];
    const saved = localStorage.getItem(favKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist favorites only for logged in users
  useEffect(() => {
    if (favKey) {
      localStorage.setItem(favKey, JSON.stringify(favorites));
    }
  }, [favorites, favKey]);

  // When user changes (login/logout), reload the favorites for that user
  useEffect(() => {
    if (favKey) {
      const saved = localStorage.getItem(favKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    } else {
      setFavorites([]);
    }
  }, [favKey]);

  const toggleFavorite = (product) => {
    // require login to save favorites
    if (!user) {
      if (onLoginClick) onLoginClick();
      return;
    }
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        // normalize product shape used by Favorites.jsx
        const normalized = {
          ...product,
          name: product.name || product.products_name,
        };
        return [normalized, ...prev];
      }
    });
  };

  // small helper to trigger the CSS animation class for the clicked icon
  const triggerAnimation = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.classList.add("animate");
    setTimeout(() => el.classList.remove("animate"), 350);
  };

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    // Si hay query en la URL, usar el endpoint de búsqueda
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q");
    const categoryId = params?.categoryId;

    let url;
    if (q) {
      url = `http://127.0.0.1:5000/api/products/search?query=${encodeURIComponent(
        q
      )}`;
    } else if (categoryId) {
      url = `http://127.0.0.1:5000/api/products?category=${encodeURIComponent(
        categoryId
      )}`; // ajusta según tu backend
    } else {
      // usar el endpoint /api/products por consistencia
      url = "http://127.0.0.1:5000/api/products";
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // inspeccionar la forma de la respuesta para adaptarnos
        console.log("loadProducts response:", data);
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (data && Array.isArray(data.products)) items = data.products;
        else if (data && Array.isArray(data.items)) items = data.items;
        else items = data || [];
        // si categoryId existe pero el endpoint devolvió items no filtrados, filtramos en cliente
        if (categoryId && Array.isArray(items) && items.length > 0) {
          const looksFiltered = items.every((it) => {
            return (
              (it.category_id && it.category_id === categoryId) ||
              (it.category && it.category === categoryId) ||
              (it.categories &&
                Array.isArray(it.categories) &&
                it.categories.includes(categoryId))
            );
          });
          if (!looksFiltered) {
            items = items.filter((it) => {
              return (
                (it.category_id && it.category_id === categoryId) ||
                (it.category && it.category === categoryId) ||
                (it.categories &&
                  Array.isArray(it.categories) &&
                  it.categories.includes(categoryId))
              );
            });
          }
        }

        const productosConId = (items || []).map((prod) => ({
          ...prod,
          id: prod.products_id || prod.id,
          name: prod.products_name || prod.name,
          image_url: prod.image_url || prod.image || "",
        }));

        // eliminar duplicados por id (mantener el primero)
        const seen = new Set();
        const deduped = productosConId.filter((p) => {
          if (!p.id) return false;
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        setProducts(deduped);
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
  }, [location.search, params?.categoryId]);

  // Si algunos productos no tienen image_url, pedir la URL específica por id
  useEffect(() => {
    const missing = products.filter((p) => !p.image_url && p.id);
    if (missing.length === 0) return;

    let cancelled = false;

    const fetchImages = async () => {
      const updated = [...products];
      await Promise.all(
        missing.map(async (p) => {
          try {
            const res = await fetch(`http://127.0.0.1:5000/api/images/${p.id}`);
            if (!res.ok) return;
            const json = await res.json();
            if (!json) return;

            // posibles campos donde puede venir la URL
            const candidate = json.image_url || json.url || json.path || json.data || json;
            let imageUrl = null;

            if (typeof candidate === "string") {
              imageUrl = candidate;
            } else if (candidate && typeof candidate === "object") {
              // si viene objeto con campos conocidos
              imageUrl = candidate.image_url || candidate.url || candidate.path || null;
            }

            if (imageUrl) {
              // normalizar relativa -> absoluta
              if (!imageUrl.startsWith("http")) {
                imageUrl = imageUrl.replace(/^\/+/, "");
                imageUrl = `http://127.0.0.1:5000/${imageUrl}`;
              }
              const idx = updated.findIndex((u) => u.id === p.id);
              if (idx !== -1) updated[idx] = { ...updated[idx], image_url: imageUrl };
            }
          } catch (e) {
            console.error("Error cargando imagen para", p.id, e);
          }
        })
      );
      if (!cancelled) setProducts(updated);
    };

    fetchImages();
    return () => {
      cancelled = true;
    };
  }, [products]);

  // función para ocultar un producto
  const handleHideProduct = (id) => {
    setHiddenProducts((prev) => [...prev, id]);
  };

  const visibleProducts = products.filter(
    (product) => !hiddenProducts.includes(product.id)
  );

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#48601c" }}>
        Lista de Productos
      </h1>

      <div className="product-container">
        {loading ? (
          <div style={{ textAlign: "center" }}>Cargando productos...</div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "rgba(69, 187, 0, 1)" }}>
            <p>Error cargando productos: {error}</p>
            <button
              onClick={loadProducts}
              style={{
                background: "#48601c",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
          </div>
        ) : visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              {/* Mostrar la imagen si existe, con placeholder y onError */}
              <img
                src={product.image_url || "/vite.svg"}
                alt={product.name || product.products_name}
                onError={(e) => {
                  // fallback en caso de error de carga
                  e.currentTarget.src = "/vite.svg";
                }}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />

              <div style={{ position: "absolute", top: 10, right: 10 }}>
                {favorites.find((f) => f.id === product.id) ? (
                  <span
                    className="favorite-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                      triggerAnimation(e);
                    }}
                  >
                    <FaHeart
                      className="heart-svg"
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  </span>
                ) : (
                  <span
                    className="favorite-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                      triggerAnimation(e);
                    }}
                  >
                    <FaRegHeart
                      className="heart-svg"
                      style={{ color: "#999", cursor: "pointer" }}
                    />
                  </span>
                )}
              </div>

              <p>{product.name || product.products_name}</p>
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
