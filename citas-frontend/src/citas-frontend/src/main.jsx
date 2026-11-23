import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DatosProvider } from './context/DatosContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DatosProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DatosProvider>
    </BrowserRouter>
  </React.StrictMode>
);