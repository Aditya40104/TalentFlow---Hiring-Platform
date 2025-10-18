import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Start MSW
async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
