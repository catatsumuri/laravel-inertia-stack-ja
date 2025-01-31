import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            port: env.VITE_PORT || 5173, 
            origin: `http://${env.VITE_HMR_HOST}:${env.VITE_PORT || 5173}`, 
            cors: true, 
            hmr: {
                host: env.VITE_HMR_HOST || 'localhost', 
            },
        },
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
