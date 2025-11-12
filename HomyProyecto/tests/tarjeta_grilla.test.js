import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import tarjetaParaLaGrilla from "../src/components/grilla/tarjetaParaLaGrilla"; // ajustá el path real

describe("tarjetaParaLaGrilla", () => {
  test('llama a addToCart al hacer clic en "Agregar al carrito"', () => {
    //  Simulamos las props necesarias
    const mockProduct = {
      id: 1,
      name: "Producto Test",
      price: 100,
      image_url: "test.jpg",
    };

    const mockAddToCart = jest.fn(); // mock de la función
    const mockRemoveFromCart = jest.fn();

    // Simulamos un contexto mínimo: sin productos en carrito
    const cartItems = [];

    // Renderizamos el componente pasándole las funciones y datos como props globales
    render(
      <div>
        {tarjetaParaLaGrilla(
          false,
          mockProduct,
          cartItems,
          mockAddToCart,
          mockRemoveFromCart
        )}
      </div>
    );

    // Buscamos el botón
    const addButton = screen.getByRole("button", {
      name: /Agregar al carrito/i,
    });
    expect(addButton).toBeInTheDocument();

    // Simulamos el click
    fireEvent.click(addButton);

    // Verificamos que la función se haya llamado con el producto correcto
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
