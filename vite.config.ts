import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


// https://vitejs.dev/config/
export default defineConfig({
    base: './', // O el subdirectorio correspondiente
    publicDir: 'public',
    plugins: [vue(),],
    build: {
        chunkSizeWarningLimit: 5000,
        outDir: "./dist"
    },
    optimizeDeps: {
        exclude: ["vuetify"],
        entries: [
            "./src/**/*.vue",
        ],
    },
});
