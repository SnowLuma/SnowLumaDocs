import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './styles/tailwind.css';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HeroUIProvider>
  </React.StrictMode>,
);
