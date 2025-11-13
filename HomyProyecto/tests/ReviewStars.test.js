import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reviews from '../src/components/Reviews';


test('permite cambiar la puntuación de la reseña', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  });

  render(<Reviews user={{ name: 'Lucía', email: 'lucia@test.com' }} />);

  const select = await screen.findByDisplayValue('5 ⭐');
  await userEvent.selectOptions(select, '3');

  expect(screen.getByDisplayValue('3 ⭐')).toBeInTheDocument();
});
