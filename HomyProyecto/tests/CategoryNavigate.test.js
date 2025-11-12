//testeo para navegar al hacer click
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../src/components/Header";

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { category_id: "oficina", category_name: "Oficina" },
          { category_id: "baño", category_name: "Baño" },
        ]),
    })
  );
});

describe("Header - Navegación de categorías", () => {
  it("navega a /category/:id al hacer clic en una categoría", async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/categorías/i));

    const cat = await screen.findByText("Oficina");
    fireEvent.click(cat);

    expect(mockNavigate).toHaveBeenCalledWith("/category/oficina");
  });
});
