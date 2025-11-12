//testea que se clickee y que muestre las categorias
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../src/components/Header";

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { category_id: "oficina", category_name: "Oficina" }, // simula el fetch
          { category_id: "baño", category_name: "Baño" },
        ]),
    })
  );
});

describe("Header - Botón de Categorías", () => {
  it("muestra el menú de categorías al hacer clic en 'Categorías'", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const categoriasBtn = screen.getByText(/categorías/i); //el botón categorias debe estar visible
    expect(categoriasBtn).toBeInTheDocument();

    fireEvent.click(categoriasBtn);

    await waitFor(() => {
      expect(screen.getByText("Oficina")).toBeInTheDocument(); // muestra las categorias
      expect(screen.getByText("Baño")).toBeInTheDocument();
    });
  });
});
