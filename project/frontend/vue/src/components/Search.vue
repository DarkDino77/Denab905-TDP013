<script setup>

import { ref , computed} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref([]);
const searchTermModel = defineModel('searchTerm');

async function fetchUsers() {
    const response = await fetch(`http://localhost:8080/users/`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    const data = await response.json();
    users.value = data;
    console.log(users.value)
}

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

function goToProfile(id) {
    router.push(`/wall/${id}`);
}

fetchUsers();

const filterdUsers = computed(() => {
    return users.value.filter(user =>
    searchTermModel.value === undefined || user.name.toLowerCase().includes(searchTermModel.value.toLowerCase())
    );
})

</script>

<template>

<div>
<textarea v-model="searchTermModel">
</textarea>

<li v-for="user in filterdUsers">
    <button @click="goToProfile(user._id)">{{ user.name  }}</button>
    <button @click="sendRequest(user._id)">Add</button>
</li>    

</div>
    

</template>