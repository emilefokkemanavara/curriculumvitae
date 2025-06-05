import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: [
                fileURLToPath(new URL('./index.html', import.meta.url)),
                fileURLToPath(new URL('./cv/index.html', import.meta.url)),
                fileURLToPath(new URL('./editor/index.html', import.meta.url)),
            ]
        }
    }
})