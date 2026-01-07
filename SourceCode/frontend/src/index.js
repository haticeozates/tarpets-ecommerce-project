import React from 'react';
import ReactDOM from 'react-dom/client'; // Library connecting React Virtual DOM to browser DOM
import './index.css'; // Global styles definitions applicable application-wide
import App from './App'; // Root Component wrapping all Providers and Router
import reportWebVitals from './reportWebVitals'; // Performance measurement tool

// Application Mount Point:
// Selects the div element with id "root" in 'public/index.html'.
// React builds the entire Single Page Application (SPA) structure inside this container.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    // StrictMode: Runs only in Development environment.
    // Intentionally renders components twice to detect potential errors, side effects, and deprecated usages.
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Optional: Measure performance metrics (FCP, LCP, etc.) using Web Vitals
reportWebVitals();