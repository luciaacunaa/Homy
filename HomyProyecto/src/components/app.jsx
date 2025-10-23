import React, { useState, useEffect } from "react";
import { RiPencilFill } from "react-icons/ri";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Cart from "../cart/Cart";
import ProductList from "./grilla/grilla";
import Checkout from "./Checkout";
import AdminOrders from "./AdminOrders";
import Login from "../login/login";
import Promociones from "./Promociones";
import PaymentMethods from "./PaymentMethods";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Reviews from "./Reviews";
import Favorites from "./Favorites";
function App() {
  const navigate = useNavigate();

  const [cartVisible, setCartVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [user, setUser] = useState(null); // Usuario autenticado
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved && saved !== "[]" ? JSON.parse(saved) : [];
  });
  // Estado para edición de 'Sobre nosotros'
  const [editAbout, setEditAbout] = useState(false);
  const [aboutText, setAboutText] = useState(
    "En Homy, nos apasiona ayudarte a crear espacios únicos y acogedores. Ofrecemos una cuidada selección de muebles y decoración para transformar tu hogar en el lugar de tus sueños. Nuestro equipo está comprometido con la calidad, el diseño y la atención personalizada. ¡Gracias por confiar en nosotros para acompañarte en cada rincón de tu casa!"
  );
  const [aboutTextBackup, setAboutTextBackup] = useState(
    "En Homy, nos apasiona ayudarte a crear espacios únicos y acogedores. Ofrecemos una cuidada selección de muebles y decoración para transformar tu hogar en el lugar de tus sueños. Nuestro equipo está comprometido con la calidad, el diseño y la atención personalizada. ¡Gracias por confiar en nosotros para acompañarte en cada rincón de tu casa!"
  );

  const handleSaveAbout = () => {
    setEditAbout(false);
    setAboutTextBackup(aboutText);
    // Aquí podrías agregar lógica para guardar el texto en backend si lo deseas
  };

  //Recuperar sesión del usuario al montar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Helper para determinar si el usuario es el administrador
  const isAdminUser = (u) => {
    if (!u) return false;
    // Defendernos de estructuras de usuario distintas
    const email = u.email || u.customers_email || u?.user?.email;
    return email === "adminhomy@gmail.com";
  };

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito solo si el usuario está logueado
  const addToCart = (product) => {
    if (!user) {
      setLoginVisible(true);
      return;
    }
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
    try {
      localStorage.removeItem('user');
    } catch (err) {
      console.warn('No se pudo eliminar user de localStorage', err);
    }
    window.location.reload();
  };

  // Vaciar carrito
  // Esta función limpia el estado de `cartItems`. El efecto `useEffect`
  // guarda automáticamente el arreglo vacío en localStorage.
  const clearCart = () => setCartItems([]);

  if (loginVisible) {
    return (
      <Login
        onClose={() => setLoginVisible(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          // Persistir usuario en localStorage para mantener sesión entre recargas
          try {
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (err) {
            console.warn('No se pudo guardar usuario en localStorage', err);
          }
          setLoginVisible(false);
          if (isAdminUser(userData)) {
            navigate("/admin/orders");
          }
        }}
      />
    );
  }

  return (
    <>
      <Header
        onCartClick={() => setCartVisible(true)}
        onLoginClick={() => setLoginVisible(true)}
        user={user}
        onLogout={handleLogout}
        onPaymentClick={() => navigate("/payment")}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <Carousel
                  images={[
                    "/carousel/2.jpg",
                    "/carousel/3.jpg",
                    "/carousel/1.jpeg",
                  ]}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2rem",
                  gap: "2.5rem",
                }}
              >
                <img
                  src="/promos/logo grande.PNG"
                  alt="Logo Homy"
                  style={{
                    height: 220,
                    width: 220,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    maxWidth: "500px",
                    textAlign: "left",
                    background: "#f5edce",
                    padding: "1.5rem 2rem",
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <h2
                      style={{
                        marginTop: 0,
                        color: "#48601c",
                        marginBottom: 0,
                      }}
                    >
                      Sobre nosotros
                    </h2>
                    {isAdminUser(user) && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#48601c",
                          fontSize: "1.3rem",
                          padding: 0,
                        }}
                        onClick={() => setEditAbout(true)}
                        title="Editar texto"
                      >
                        <RiPencilFill />
                      </button>
                    )}
                  </div>
                  {editAbout ? (
                    <>
                      <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          fontSize: "1.1rem",
                          color: "#444",
                          marginTop: "0.5rem",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <button
                          onClick={handleSaveAbout}
                          style={{
                            background: "#48601c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditAbout(false);
                            setAboutText(aboutTextBackup);
                          }}
                          style={{
                            background: "#ccc",
                            color: "#222",
                            border: "none",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: "1.1rem", color: "#444" }}>
                      {aboutText}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1.5rem",
                      marginTop: "1.5rem",
                      fontSize: "2rem",
                      color: "#48601c",
                      alignItems: "center",
                    }}
                  >
                    <FaInstagram style={{ cursor: "pointer" }} />
                    <FaWhatsapp style={{ cursor: "pointer" }} />
                    <MdOutlineMail style={{ cursor: "pointer" }} />
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Reviews user={user} />
              </div>
            </>
          }
        />
        <Route
          path="/payment"
          element={<PaymentMethods isAdmin={isAdminUser(user)} />}
        />
        <Route
          path="/products"
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
                onClear={clearCart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
              <ProductList
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cartItems={cartItems}
                user={user}
                onLoginClick={() => setLoginVisible(true)}
              />
            </>
          }
        />
        <Route
          path="/promotions"
          element={
            <Promociones
              isAdmin={isAdminUser(user)}
              images={[
                "/promos/Cream and Brown Minimalist Chair Furniture Sale Flyer.png",
                "/promos/Descuento de noviembre en Mercado Pago.png",
                "/promos/Feria de Descuentos Noviembre 2023.png",
              ]}
            />
          }
        />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
        <Route
          path="/admin/orders"
          element={
            user && isAdminUser(user) ? (
              <AdminOrders />
            ) : (
              <div style={{ padding: "2rem", color: "red" }}>
                Acceso denegado. Solo el administrador puede ver los pedidos.
              </div>
            )
          }
        />
      </Routes>
      <Routes>
        <Route path="/favourites" element={<Favorites user={user} onLoginClick={() => setLoginVisible(true)} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
