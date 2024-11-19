import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import './styles/main.scss'; // Importa los estilos SCSS aquí
import vuetify from './plugins/vuetify';
import { VueSweetalert } from "./plugins/sweet-alerts";


const app = createApp(App);
app.use(vuetify);
app.use(VueSweetalert);
app.use(router);
app.mount('#app');
