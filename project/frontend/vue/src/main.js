import { createApp } from "vue";
import App from './App.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Search from './components/Search.vue';
import Wall from './components/Wall.vue';


import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: Login },
    { path: '/profile/:id', component: Profile, props: true },
    { path: '/search', component: Search },
    { path: '/wall/:id', component: Wall },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

const app = createApp(App);
app.use(router);
app.mount('#app');