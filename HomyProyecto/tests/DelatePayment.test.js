// Borra un metodo de pago
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentMethods from "../src/components/PaymentMethods";

test("elimina un método de pago cuando se hace clic en el botón eliminar", () => {
  render(<PaymentMethods isAdmin />);

  const imagenesIniciales = screen.getAllByAltText("Banco");
  expect(imagenesIniciales.length).toBe(13); //13 imágenes al principio

  const botonesEliminar = screen.getAllByTitle("Eliminar método");
  fireEvent.click(botonesEliminar[0]); //Simula hacer clic en el boton

  const imagenesDespues = screen.getAllByAltText("Banco");
  expect(imagenesDespues.length).toBe(12); // Muestra q al eliminar son 12

  expect(
    screen.getByRole("heading", { name: /métodos eliminados/i })
  ).toBeInTheDocument(); // metodos eliminados
});
