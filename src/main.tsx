/**
 * MAIN - Punto de entrada de la aplicación
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/_app';
import './styles/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);