import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Reviews from '../src/components/Reviews';

test('muestra alerta si el usuario no está logueado', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  });

  // Mock de alert para evitar que se muestre realmente
  window.alert = jest.fn();

  render(<Reviews user={null} />);

  const button = await screen.findByText(/Enviar/i);
  await button.click();

  expect(window.alert).toHaveBeenCalledWith(
    'Debes iniciar sesión para dejar una reseña.'
  );
});
