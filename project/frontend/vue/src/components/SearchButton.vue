<script setup>

import { useRouter } from 'vue-router';

const router = useRouter();

function searchRedirect() {
    router.push('/search');
}

</script>


<template>
    <button @click="searchRedirect">
        Search
    </button>
</template>