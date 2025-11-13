import { useEffect, useState } from "react";

export default function AllCategories() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/categorias")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categorías");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  // Agrupamos productos por categoría
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.category_name]) acc[item.category_name] = [];
    acc[item.category_name].push(item);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#48601c" }}>Categorías y productos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {Object.entries(grouped).map(([category, products]) => (
        <div key={category} style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#48601c" }}>{category}</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {products.map((p) => (
              <div
                key={p.products_id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                  background: "#fff",
                }}
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.products_name}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )}
                <h4>{p.products_name}</h4>
                <p>${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
