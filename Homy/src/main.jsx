import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx'; // 👈 "a" en minúscula porque tu archivo es app.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
