import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<Provider store={store}><App {...props} /></Provider>);
    },
    progress: {
        color: '#4B5563',
    },

});
