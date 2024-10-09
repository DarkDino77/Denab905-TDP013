<script setup>

import * as store from '../store.js';
import { useRoute, useRouter } from 'vue-router';
import SearchButton from './SearchButton.vue';

const userStore = store.loggedInUserStore();
const router = useRouter();

function logout() {
    fetch('http://localhost:8080/logout', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
        .then(() => {
            userStore.logout();
            router.push('/');
        });
}

function goToProfile() {
    router.push('/profile/' + userStore.getId());
}

</script>

<template>
    <div class="flex flex-row mb-5 bg-sky-600">
        <SearchButton class="mx-4  button-primary my-1" />
        <button @click="goToProfile" class="button-primary mx-4 my-1">Profile</button>
        <button @click="logout" class="button-primary mx-4 my-1">Logout</button>

    </div>
</template>