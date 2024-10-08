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
    console.log("I wall " + id)
    router.push(`/wall/${id}`);
}

</script>

<template>
    <div class="color-blue-600">
        <button @click="goToProfile(user._id)">{{ user.name  }}</button>
    </div>
</template>