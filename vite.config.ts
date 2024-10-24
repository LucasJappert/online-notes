import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Importa el módulo path


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
    define: {
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': true, // O puedes poner true si deseas más detalles en el error
        // Agrega aquí otras feature flags si es necesario
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // Define el alias @ para la ruta src
        },
    },
});
