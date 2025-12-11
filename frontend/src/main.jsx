import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SocketContextProvider } from './context/SocketContext.jsx'; // Import the provider
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER"}>
      <BrowserRouter>
        <SocketContextProvider> {/* Wrap App with the provider */}
          <App />
        </SocketContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);