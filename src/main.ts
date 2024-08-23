import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import './styles/main.scss'; // Importa los estilos SCSS aquí
import vuetify from './plugins/vuetify';
import 'vuetify/styles'; // Importa los estilos de Vuetify


const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');
