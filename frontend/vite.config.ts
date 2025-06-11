import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { addJsonSchemas } from './vite-plugins/add-json-schemas';

export default defineConfig({
    root: '.',
    base: '/curriculumvitae',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: [
                fileURLToPath(new URL('./index.html', import.meta.url)),
                fileURLToPath(new URL('./cv/index.html', import.meta.url)),
                fileURLToPath(new URL('./editor/index.html', import.meta.url)),
            ]
        }
    },
    plugins: [addJsonSchemas()]
})