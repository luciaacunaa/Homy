import React, { useEffect } from "react";
import "./grilla.css";

const products = [
  {
    id: 1,
    name: "Muebles Gacela",
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/311495-500-auto?v=637739662933230000&width=500&height=auto&aspect=true",
    price: 296500,
    description: "Placard 180x117x45.5 Cm Roble Miel/Blanco 4 Puertas 2 Cajones Escandinavo Muebles Gacela"

  },
  {
    id: 2,
    name: "Ricchezze",
    price: 753600,
    image : "https://arcencohogareasy.vtexassets.com/arquivos/ids/369069-800-auto?v=638392132383700000&width=800&height=auto&aspect=true",
    description: "Placard 2 Puertas de Pino Blanco 178X58.8X205 Cm Ricchezze.",
  },
  {
    id: 3,
    name: "Muebles Gacela",
    price: 396000,
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/369976-1600-1600?v=638404070109600000&width=1600&height=1600&aspect=true",
    description: "Placard 6 Puertas Blanco/Roble Miel 176X46X180 Cm Muebles Gacela",
  },

  {
    id: 4,
    name: "Dielfe",
    price: 424150,
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/312849-1600-1600?v=637769064769900000&width=1600&height=1600&aspect=true",
    description: "Placard 2 Puertas 195,3x174x51 Cm Blanco Venezia Dielfe",
  },

 {
    id: 5,
    name: "Ricchezze",
    price: 191200,
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/375627-1600-1600?v=638479244371700000&width=1600&height=1600&aspect=true",
    description: "Placard 120x47x182 Cm Blanco 4 Puertas 2 Cajones Benevento Ricchezze",
  },

 {
    id: 6,
    name: "Ricchezze",
    price: 753600,
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/372806-1600-1600?v=638430012874770000&width=1600&height=1600&aspect=true",
    description: "Placard 178x59x205 Cm Hickory 2 Puertas Corredizas Ricchezze",
  },

  
 {
    id: 7,
    name: "Ricchezze",
    price: 111200,
    image : "https://arcencohogareasy.vtexassets.com/arquivos/ids/375624-800-auto?v=638479236690100000&width=800&height=auto&aspect=true",
    description: "Placard 2 Puertas 60X47X182Cm Blanco Brillo Ricchezze",
  },


 {
    id: 8,
    name: "Muebles Gacela",
    price: 296250,
    image : "https://arcencohogar.vtexassets.com/arquivos/ids/311495-1600-1600?v=637739662933230000&width=1600&height=1600&aspect=true",
    description: "Placard 180x117x45.5 Cm Roble Miel/Blanco 4 Puertas 2 Cajones Escandinavo Muebles Gacela",
  },




];

const ProductList = () => {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((data) => data.json())
      .then((res) => console.log(res));
  }, []); //Sirve para traer datos de un endpoint ahrex
   
  return (
    <>
      <h1>Lista de Productos</h1>
      <div className="product-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && <img src={product.image} alt={product.name} />}
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Precio:</strong> ${product.price}
            </p>
            {/* Botón que lleva a la página del producto */}
            <button onClick={() => navigate(`/product/${product.id}`)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;