import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from './App.vue';
import Login from './components/Login.vue';
import Profile from './components/Profile.vue';
import Search from './components/Search.vue';
import Wall from './components/Wall.vue';


import { createMemoryHistory, createRouter } from 'vue-router'
import { loggedInUserStore } from "./store";

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

const pinia = createPinia()

router.beforeEach((to, from, next) => {
    const store = loggedInUserStore();
    if (store.loggedIn === undefined) {
        if (to.path !== '/') {
            next('/');
        }
    }
    next();
})

const app = createApp(App);
app.use(router);
app.use(pinia)
app.mount('#app');