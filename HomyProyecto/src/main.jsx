
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app';
import { BrowserRouter } from 'react-router-dom';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

//react-router 

//react-router 