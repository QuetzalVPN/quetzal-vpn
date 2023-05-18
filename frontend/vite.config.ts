import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});
