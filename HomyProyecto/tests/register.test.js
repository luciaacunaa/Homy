import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../src/register/Register"; // ajustá la ruta si está en otra carpeta

// Mock del fetch para no hacer llamadas reales al backend
global.fetch = jest.fn();

describe("Register Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("muestra error si el correo no es de Gmail", async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "usuario@hotmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Lucia" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido"), {
      target: { value: "Acuña" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Mi casa" },
    });

    fireEvent.submit(screen.getByText("Registrarse"));

    expect(await screen.findByText("El correo debe ser de Gmail.")).toBeInTheDocument();
  });

  test("envía el formulario correctamente con correo Gmail", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Usuario registrado exitosamente" }),
    });

    const onBack = jest.fn();
    render(<Register onBack={onBack} />);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "usuario@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Lucia" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellido"), {
      target: { value: "Acuña" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Mi casa" },
    });

    // Mockeamos alert
    global.alert = jest.fn();

    fireEvent.submit(screen.getByText("Registrarse"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(global.alert).toHaveBeenCalledWith("Usuario registrado exitosamente");
      expect(onBack).toHaveBeenCalled();
    });
  });
});
