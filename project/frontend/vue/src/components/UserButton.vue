<script setup>

import { useRouter } from 'vue-router';

defineProps({
    user: {
        type: Object,
        required: true
    }
});


const router = useRouter();

function goToProfile(id) {
    router.push(`/wall/${id}`);
}

</script>

<template>
<button @click="goToProfile(user._id)">{{ user.name  }}</button>
</template>