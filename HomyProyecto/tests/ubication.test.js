import React from "react";
import { render, screen } from "@testing-library/react";
import UbicacionMapa from "../src/components/ubicacion";

describe("UbicacionMapa component", () => {
  // agrupa componentes relacionados
  test("muestra el mapa del Obelisco", () => {
    render(<UbicacionMapa />); // pone el componente en entorno falso

    const iframe = screen.getByTitle("Ubicación Obelisco"); // busca al elemento en pantalla
    expect(iframe).toBeInTheDocument(); // busca el iframe y si no está, falla

    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("https://www.google.com/maps/embed")
    );
  });
});
