import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode is enabled, which may cause double-invocations in dev mode.
  // This is expected behavior for React 18 dev mode to catch side effects.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);