<script setup>

import { ref , computed} from 'vue';
import { useRouter } from 'vue-router';
import * as store from '../store.js';
import UserButton from '../components/UserButton.vue';
import * as utils from '../utils.js';

const router = useRouter();
const users = ref([]);
const searchTermModel = defineModel('searchTerm');
const userStore = store.loggedInUserStore();

let friendsList = defineModel('friendsList',[]);

async function fetchUsers() {
    const response = await fetch(`http://localhost:8080/users/`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        const data = await response.json();
        users.value = data;
        console.log(users.value)
    } else {
        console.log("error");
    }
}

async function getFriends() {
    friendsList.value = await utils.getFriends();
}

getFriends();

function sendRequest(id) {
    fetch(`http://localhost:8080/users/${id}/friends`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include',
    })
    .then(() => {
        console.log("Added friend");
    });
}


fetchUsers();

const filterdUsers = computed(() => {
    return users.value.filter((user) => {
        return (searchTermModel.value === undefined || 
        user.name.toLowerCase().includes(searchTermModel.value.toLowerCase())) && 
        user._id !== userStore.getId();
    }
    );
})

function isFriendsWithUser(id) {
    if (friendsList.value === undefined)
        return false;
    
    for (let i = 0; i < friendsList.value.length; i++) {
        if (friendsList.value[i]._id === id) {
            return true;
        }
    }

    return false;
}

</script>

<template>

<div>
<textarea v-model="searchTermModel">
</textarea>

<li v-for="user in filterdUsers">
    <UserButton :user="user" />
    <button v-show="isFriendsWithUser(user._id) === false" @click="sendRequest(user._id)">Add</button>
</li>    

</div>
    

</template>