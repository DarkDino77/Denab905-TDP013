<script setup>
import { useRouter } from 'vue-router';  
const router = useRouter();  // Get the router instance

function redirect() {
    router.push('/hello'); 
}

</script>

<template>
<button @click="redirect">Redirect</button>
</template>