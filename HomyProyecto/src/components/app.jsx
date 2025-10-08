import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Cart from "../cart/Cart";
import ProductList from "./grilla/grilla";
import Checkout from "./Checkout";
import Login from "../login/login";
import Promociones from "./Promociones";

function App() {
  const navigate = useNavigate();
  
  const [cartVisible, setCartVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [user, setUser] = useState(null); // Usuario autenticado
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved && saved !== "[]" ? JSON.parse(saved) : [];
  });


  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found && found.quantity > 1) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter((item) => item.id !== product.id);
      }
    });
  };

  // Cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setLoginVisible(false);
    window.location.reload();
  };

  // Vaciar carrito
  // Esta función limpia el estado de `cartItems`. El efecto `useEffect`
  // guarda automáticamente el arreglo vacío en localStorage.
  const clearCart = () => setCartItems([]);

  return (
    <>
      <Header
        onCartClick={() => setCartVisible(true)}
        onLoginClick={() => setLoginVisible(true)}
        user={user}
        onLogout={handleLogout}
      />
      {loginVisible && (
        <Login
        onClose={() => setLoginVisible(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setLoginVisible(false);
        }}
      />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Componente Cart:
                  Props principales:
                    - onClose: cierra la vista del carrito
                    - visible: si el drawer está abierto
                    - items: lista de productos en el carrito
                    - goToCheckout: navega a /checkout
                    - onClear: función para vaciar todo el carrito (clearCart)
              */}
              <Cart
                onClose={() => setCartVisible(false)}
                visible={cartVisible}
                items={cartItems}
                goToCheckout={() => {
                  setCartVisible(false);
                  navigate("/checkout");
                }}
                onClear={clearCart}
                addToCart={addToCart} /* Nueva prop, sirve para los botones de carri*/
                removeFromCart={removeFromCart}
              />
              <ProductList
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cartItems={cartItems}
              />
            </>
          }
        />
        <Route
          path="/promotions"
          element={
            <Promociones images={[
              '/promos/Cream and Brown Minimalist Chair Furniture Sale Flyer.png',
              '/promos/Descuento de noviembre en Mercado Pago.png',
              '/promos/Feria de Descuentos Noviembre 2023.png'
            ]} />
          }
        />
        <Route
          path="/checkout"
          element={<Checkout cartItems={cartItems} />}
        />
      </Routes>
    </>
  );
}

export default App;
