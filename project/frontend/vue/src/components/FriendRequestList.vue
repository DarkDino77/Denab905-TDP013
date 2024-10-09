<script setup>
import { ref } from 'vue';
import UserButton from './UserButton.vue';

const emit = defineEmits(['acceptedFriend']);

let requests = ref([]);

async function fetchRequests() {
    const response = await fetch(`http://localhost:8080/requests`, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        requests.value = await response.json();
        console.log(requests);
    }
}

fetchRequests();

function acceptFriend(request) {
    fetch(`http://localhost:8080/users/${request}/friends`, {
        method: 'PATCH',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
        .then(() => {
            console.log("Accepted");
            emit('acceptedFriend');
            fetchRequests();
        })
}

</script>

<template>
    <div class="w-full text-stone-300 bg-navy rounded-xl m-16">
        <div class="bg-sky-900 rounded-xl m-2 p-2">
            Friend requests
        </div>
        <ul>
            <li v-for="req in requests">
                <div class="flex flex-row space-x-4 bg-sky-900 rounded-xl m-2 p-2">
                    <UserButton :user=req />
                    <div  class="flex-grow">
                    <button @click="acceptFriend(req._id)" class="button-primary bg-green-600 hover:bg-green-400">Accept</button>
                </div>
                </div>
            </li>
        </ul>

    </div>
</template>