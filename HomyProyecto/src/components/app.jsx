

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Cart from "../cart/Cart";
import ProductList from "./grilla/grilla";
import Checkout from "./Checkout";
import { Routes, Route, useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found && found.quantity > 1) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== product.id);
      }
    });
  };

  return (
    <>
      <Header onCartClick={() => setCartVisible(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Cart
                onClose={() => setCartVisible(false)}
                visible={cartVisible}
                items={cartItems}
                goToCheckout={() => {
                  setCartVisible(false);
                  navigate("/checkout");
                }}
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
          path="/checkout"
          element={<Checkout cartItems={cartItems} />}
        />
      </Routes>
    </>
  );
}
export default App;
