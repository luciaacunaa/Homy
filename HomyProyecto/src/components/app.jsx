


import React, { useState } from "react";
import Header from "../components/Header";
import Cart from "../cart/Cart"; 
import ProductList from "./grilla/grilla";
import Login from "../login/login";


function App() {
  const [cartVisible, setCartVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [user, setUser] = useState(null); // usuario autenticado

  const handleLogout = () => {
    setUser(null);
    setLoginVisible(false);
    window.location.reload();
  };

  return (
    <div>
      <Header 
        onCartClick={() => setCartVisible(true)} 
        onLoginClick={() => setLoginVisible(true)}
        user={user}
        onLogout={handleLogout}
      />
      {/* Mostrar solo login/register si loginVisible es true, si no el resto de la app */}
      {loginVisible ? (
        <Login 
          onClose={() => setLoginVisible(false)} 
          onLoginSuccess={(user) => {
            setUser(user);
            setLoginVisible(false);
          }}
        />
      ) : (
        <>
          <Cart onClose={() => setCartVisible(false)} visible={cartVisible} />
          <ProductList />
        </>
      )}
    </div>
  );
}

export default App;
