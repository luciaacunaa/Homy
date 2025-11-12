import { render, screen } from "@testing-library/react";
import PaymentMethods from "../src/components/PaymentMethods";

describe("PaymentMethods", () => {
  test("renderiza todos los métodos de pago", () => {
    render(<PaymentMethods />); // Muestra el componente

    expect(
      screen.getByRole("heading", { name: /medios de pago/i }) // Busca que haya un payment methods
    ).toBeInTheDocument();

    const imagenes = screen.getAllByAltText("Banco"); // img
    expect(imagenes.length).toBe(13); // busca las 13 img

    imagenes.forEach((img) => {
      expect(img).toHaveAttribute("src");
      expect(img.getAttribute("src")).toContain("/bancos/");
    });
  });

  test("muestra los botones de eliminar cuando isAdmin es true", () => {
    // aca busca q el admin pueda eliminar
    render(<PaymentMethods isAdmin />);
    const botonesEliminar = screen.getAllByTitle("Eliminar método");
    expect(botonesEliminar.length).toBe(13);
  });
});
