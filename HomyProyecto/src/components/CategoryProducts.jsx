import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryProducts() {
  const { id } = useParams(); // category_id de la URL
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/products/category/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontraron productos");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        if (data.length > 0) setCategoryName(data[0].category_name);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#48601c" }}>
        {categoryName || "Productos de la categoría"}
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
  );
}
