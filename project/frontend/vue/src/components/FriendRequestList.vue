<script setup>
 import { ref } from 'vue';

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
<div>
<li v-for="req in requests">
    {{ req.name }}
    <button @click="acceptFriend(req._id)">Accept</button>
</li>
</div>
</template>