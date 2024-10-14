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
    <div class="flex-grow" >
        <button @click="goToProfile(user._id)" class="button-primary bg-sky-900 ">{{ user.name  }}</button>
    </div>
</template>