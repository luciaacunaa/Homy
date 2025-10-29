import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/receipt")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al obtener los pedidos");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>No hay pedidos registrados.</p>;

  // Paginación: cálculo de índices
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const formatValue = (value, key) => {
    if (key.toLowerCase().includes("date")) {
      return new Date(value).toLocaleString();
    } else if (typeof value === "number") {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pedidos realizados</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Object.keys(orders[0]).map((key) => (
              <th
                key={key}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  background: "#f0f0f0",
                  textAlign: "left",
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, idx) => (
            <tr key={idx}>
              {Object.entries(order).map(([key, value]) => (
                <td
                  key={key}
                  style={{ border: "1px solid #ccc", padding: "8px" }}
                >
                  {formatValue(value, key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            style={{
              padding: "0.3rem 0.6rem",
              background: num === currentPage ? "#48601c" : "#f0f0f0",
              color: num === currentPage ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
