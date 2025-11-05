//El admin puede eliminar promociones
import { render, screen, fireEvent } from "@testing-library/react";
import Promociones from "../src/components/Promociones";

test("el admin puede eliminar una promo", () => {
  const mockImages = ["img1.jpg"]; //array

  render(<Promociones images={mockImages} isAdmin />); //supone que tiene una imagen, como es admin puede eliminar 

  const deleteBtn = screen.getByTitle("Eliminar promoción");
  fireEvent.click(deleteBtn);

  expect(screen.queryByAltText("promo-0")).not.toBeInTheDocument(); // si el elemento existe lo devuelve y si no, rompe el test
});
