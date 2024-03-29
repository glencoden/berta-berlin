import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ApplicationProvider } from './context';
import App from './App';
import { appVersion } from './variables';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <ApplicationProvider>
            <App />
        </ApplicationProvider>
    </React.StrictMode>,
);

console.log(
    `%cglencoden ❤️ version ${appVersion}`,
    `font-size: 1rem;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0.5rem;
    color: white;
    background:linear-gradient(#E66465, #9198E5);`,
);
