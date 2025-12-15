import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Ensure we navigate to home if no route is set
router.isReady().then(() => {
  if (router.currentRoute.value.path === '/' || !router.currentRoute.value.matched.length) {
    router.replace('/');
  }
});

app.mount('#app');
