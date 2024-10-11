<script setup>

import { useRouter } from 'vue-router';
import SearchButton from './SearchButton.vue';
import * as store from '../store.js';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

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

async function register() {
    const hashedPassword = await hashPassword(passwordModel.value);
    console.log(hashedPassword);

    const request = {
        "name": "" + usernameModel.value,
        "password": "" + hashedPassword
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
    const hashedPassword = await hashPassword(passwordModel.value);
    console.log(hashedPassword);
    const request = {
        "name": "" + usernameModel.value,
        "password": "" + hashedPassword
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

async function hashPassword(password)
{
    const hashed = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    console.log(hashed);
    return hashed;
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
                type="password" 
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

