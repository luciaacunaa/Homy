

import React, { useState } from "react";
import Header from "../components/Header";
import Cart from "../cart/Cart";

function App() {
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <div>
      <Header onCartClick={() => setCartVisible(true)} />
      {/* Acá va el resto de la app */}
  {<Cart onClose={() => setCartVisible(false)} visible={cartVisible} />}
    </div>
  );
}

export default App;
