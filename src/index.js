import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log(
    '%cglencoden ❤️ version 0.0.3',
    `font-size: 1rem;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            color: white;
            background:linear-gradient(#E66465, #9198E5);`,
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
