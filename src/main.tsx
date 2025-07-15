import { createRoot } from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Disable browser scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
  </HelmetProvider>
);
