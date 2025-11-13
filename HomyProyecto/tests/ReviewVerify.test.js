import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Reviews from '../src/components/Reviews';
test('muestra reseñas cuando el fetch devuelve datos', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([
      {
        review_id: 1,
        customers_name: 'María',
        rating: 4,
        comment: 'Muy buena atención',
        created_at: new Date().toISOString(),
      },
    ]),
  });

  render(<Reviews user={{ name: 'Lucía', email: 'lucia@test.com' }} />);

  // Espera que se renderice el nombre y comentario de la reseña
  expect(await screen.findByText('María')).toBeInTheDocument();
  expect(screen.getByText(/Muy buena atención/i)).toBeInTheDocument();
});
