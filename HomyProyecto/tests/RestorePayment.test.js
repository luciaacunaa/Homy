// test para volver a poner un metodo
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentMethods from "../src/components/PaymentMethods";
test("restaura un método de pago eliminado", () => {
  render(<PaymentMethods isAdmin />);

  const botonesEliminar = screen.getAllByTitle("Eliminar método");
  fireEvent.click(botonesEliminar[0]); // Elimina el metodo

  const botonRestaurar = screen.getByTitle("Restaurar método");
  fireEvent.click(botonRestaurar);

  const imagenes = screen.getAllByAltText("Banco");
  expect(imagenes.length).toBe(13); //obtenemos nuevamente las 13 img
});
