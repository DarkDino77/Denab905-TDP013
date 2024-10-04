<script setup>
import { useRouter } from 'vue-router';  
const router = useRouter();  // Get the router instance

function redirect() {
    router.push('/profile/66ffb0fc3ca76f6a04f3e307'); 
}

</script>

<template>
<button @click="redirect">Redirect</button>
</template>