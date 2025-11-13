import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';  
import Reviews from '../src/components/Reviews';

global.fetch = jest.fn();

test('envía una reseña al hacer clic en Enviar', async () => {
  // Primer fetch: carga inicial vacía
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  });

  // Segundo fetch: POST para guardar reseña
  fetch.mockResolvedValueOnce({
    ok: true,
    text: () => Promise.resolve('{}'),
  });

  render(<Reviews user={{ name: 'Lucía', email: 'lucia@test.com' }} />);

  const input = await screen.findByPlaceholderText(/Escribe tu reseña aquí/i);
  await userEvent.type(input, 'Excelente experiencia');
  await userEvent.click(screen.getByText(/Enviar/i));

  expect(fetch).toHaveBeenCalledWith(
    'http://127.0.0.1:5000/api/reviews',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  );
});
