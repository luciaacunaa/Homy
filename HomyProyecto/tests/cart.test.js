import React from "react";
import { render, screen } from "@testing-library/react";
import Cart from "../src/cart/Cart";

const mockItems = [
  { id: 1, name: "Placard Premium", price: 50 },
  { id: 2, name: "Placard 4 Puertas", price: 277200 },
];

test("muestra los muebles cuando el carrito tiene productos", () => {
  render(<Cart items={mockItems} />);

  expect(screen.getByText(/Placard Premium/i)).toBeInTheDocument();
  expect(screen.getByText(/\$50/)).toBeInTheDocument();
  expect(screen.getByText(/Placard 4 Puertas/i)).toBeInTheDocument();
  expect(screen.getByText(/\$277200/)).toBeInTheDocument();
});
