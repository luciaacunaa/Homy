//Este test sirve para ver si hay promos o no
import React from "react";
import { render, screen } from "@testing-library/react";
import Promociones from "../src/components/Promociones";
describe("Promociones component", () => {
  test("muestra imágenes cuando hay promociones", () => { // Aca muestra las imágenes (si es que hay)
    const mockImages = [ // el mock engancha cualquier array que simule tener las promos
      "https://ejemplo.com/promo1.jpg",
      "https://ejemp.com/promo2.jpg",
    ];

    render(<Promociones images={mockImages} />); // se pasan las imagenes como dato

    // Busca las imágenes por alt text generado en el componente
    expect(screen.getByAltText("promo-0")).toBeInTheDocument();
    expect(screen.getByAltText("promo-1")).toBeInTheDocument();
  });

  test("muestra mensaje cuando NO hay promociones", () => {
    render(<Promociones images={[]} />);

    expect(
      screen.getByText(/No hay imágenes de promociones aún/i)
    ).toBeInTheDocument();
  });
});
