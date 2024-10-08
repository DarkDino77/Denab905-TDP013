<script setup>

import { useRouter } from 'vue-router';
import SearchButton from './SearchButton.vue';
import * as store from '../store.js';

const usernameModel = defineModel('username');
const passwordModel = defineModel('password');

const router = useRouter();
const userStore = store.loggedInUserStore();

// TODO: kryptera lösenordet

async function authenticate() {
    const response = await fetch("http://localhost:8080/auth", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        const user = await response.json();
        userStore.setUser(user.id, user.name);
        router.push(`/profile/${user.id}`);
    }
}

authenticate();

function register() {
    const request = {
        "name": "" + usernameModel.value,
        "password": "" + passwordModel.value
    };

    fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(request)
    });
}

async function login() {
    const request = {
        "name": "" + usernameModel.value,
        "password": "" + passwordModel.value
    };

    const result = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(request)
    });

    if (result.status === 200) {
        const user = await result.json();
        userStore.setUser(user.id, user.name);

        console.log("Successfully logged in");

        router.push("/profile/" + user.id);
    } else {
        console.log("Incorrect username/password");
    }
}

</script>

<template>
    <div class="flex  justify-center items-center h-screen bg-gray-700">
        <div class="max-w-md w-full bg-gray-900 rounded p-6">
        <form class="flex flex-col space-y-3 bg-gray-900">
            <input 
                v-model="usernameModel"
                type="text" 
                id="username" 
                class="text-input-primary"
                placeholder="Username"><br>
            <input 
                v-model="passwordModel"
                type="text" 
                id="password"
                class="text-input-primary"
                placeholder="Password"><br>
         <div class="flex flex-row items-center space-x-1">
            <input 
            @click="login" 
            type="button" 
            id="login" 
            value="Login"
            class="button-primary">
            <input @click="register" type="button" id="register" value="Register" class="button-primary">
        </div>
        </form>
    </div>
</div>
</template>

