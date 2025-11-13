// testea que aparezca el apartado reseñas
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Reviews from '../src/components/Reviews';

// Mock del fetch global para evitar llamadas reales
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // sin reseñas al inicio
  })
);

describe('Componente <Reviews />', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('muestra el apartado de reseñas al renderizar', async () => {
    render(<Reviews user={{ name: 'Lucía', email: 'lucia@test.com' }} />);

    // esperamos que aparezca el título principal
    const heading = await screen.findByText(/Deja tu opinión sobre Homy/i);
    expect(heading).toBeInTheDocument();

    // también podemos verificar que aparezca el texto "No hay reseñas aún"
    await waitFor(() => {
      expect(screen.getByText(/No hay reseñas aún/i)).toBeInTheDocument();
    });
  });
});
