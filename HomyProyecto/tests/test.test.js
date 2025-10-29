import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../src/login/login";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ user: { email: "test@gmail.com" } }),
  })
);

describe("Login component", () => {
  test("muestra error si el correo no es de Gmail", async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "usuario@yahoo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      await screen.findByText("El correo debe ser de Gmail.")
    ).toBeInTheDocument();
  });

  test("no muestra error si el correo es Gmail válido", async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "usuario@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(
        screen.queryByText("El correo debe ser de Gmail.")
      ).not.toBeInTheDocument();
    });
  });
});
