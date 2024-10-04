import { createApp } from "vue";
import App from './App.vue';
import Login from './components/Login.vue';
import Redirect from './components/Redirect.vue';
import HelloWorld from './components/HelloWorld.vue';


import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: Login },
    { path: '/hello', component: HelloWorld }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

const app = createApp(App);
app.use(router);
app.mount('#app');