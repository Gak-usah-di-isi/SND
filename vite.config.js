import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/template.css',
                'resources/css/landing.css',
                'resources/js/template.jsx',
            ],
            refresh: true,
        }),
    ],
    optimizeDeps: {
        include: ['bootstrap'],
    },

});
