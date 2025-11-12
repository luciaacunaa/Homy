//testea que lo visible (colores, estructura, etc) sigan siendo los mismos
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentMethods from "../src/components/PaymentMethods";
test("el título tiene el color correcto", () => {
  render(<PaymentMethods />);
  const titulo = screen.getByRole("heading", { name: /medios de pago/i });
  expect(titulo).toHaveStyle("color: #48601c");
});
