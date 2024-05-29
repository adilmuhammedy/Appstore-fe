import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import { FormDataProvider } from './FormDataContext.js';
import { SnackbarProvider, useSnackbar } from 'notistack'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormDataProvider>
    <SnackbarProvider>
      <App />
      </SnackbarProvider>
    </FormDataProvider>

  </React.StrictMode>
);

