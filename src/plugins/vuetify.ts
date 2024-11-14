// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import * as components from 'vuetify/components';
import '@mdi/font/css/materialdesignicons.css'; // Importa las fuentes de MDI

const theme = {
    themes: {
        light: {
            colors: {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            },
        },
        dark: {
            colors: {
                primary: '#228822',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            },
        },
    },
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark', // Establecer el tema predeterminado
        themes: theme.themes,
    },
    icons: {
        defaultSet: 'mdi', // Asegúrate de que "mdi" esté configurado como el set predeterminado
    },
});
