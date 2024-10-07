<script setup>

const emit = defineEmits(['acceptedFriend']);

defineProps({
    requests: {
        type: Array,
        required: true
    }
})

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
    })
}

</script>

<template>
<div>
<li v-for="req in requests">
    {{ req }}
    <button @click="acceptFriend(req)">Accept</button>
</li>
</div>
</template>