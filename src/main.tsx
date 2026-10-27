import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/500.css';
import './index.css';
import { applyBrand } from './lib/brand';
import { App } from './App';

applyBrand();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
