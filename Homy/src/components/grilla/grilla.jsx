import React, { useEffect } from "react";
import "./grilla.css";

const products = [
  {
    id: 1,
    name: "Cajon de 2 puertas",
    price: 198500,
    description: "Cajon Blanco 2 puertas 80x120cm.",
  },
  {
    id: 2,
    name: "Mesa de Luz",
    price: 135000,
    description: "Mesa de Luz Gris Oscuro 60x100cm.",
  },
  {
    id: 3,
    name: "Placard 4 puertas",
    price: 250600,
    description: "Placard de 4 puertas gris con blanco",
  },
];

const ProductList = () => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((data) => data.json())
      .then((res) => console.log(res));
  }, []); //Sirve para traer datos de un endpoint ahrex
  return (
    <div className="product-container">
      <h1>Lista de Productos</h1>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h2>{product.name}</h2>
          <p>
            <strong>Precio:</strong> ${product.price}
          </p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
