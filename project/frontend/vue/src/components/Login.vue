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
        const id = await response.text();
        userStore.setUser(id);
        router.push(`/profile/${id}`);
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
        const id = await result.json();
        userStore.setUser(id);

        console.log("Successfully logged in");

        router.push("/profile/" + id);
    } else {
        console.log("Incorrect username/password");
    }
}

</script>

<template>
    <div>
        <form>
            <label for="username">Username:</label>
            <input 
                v-model="usernameModel"
                type="text" 
                id="username"><br>
            <label for="password">Password:</label>
            <input 
                v-model="passwordModel"
                type="text" 
                id="password"><br>
            <input @click="login" type="button" id="login" value="Login">
            <input @click="register" type="button" id="register" value="Register">
            <SearchButton />
        </form>
    </div>
</template>

