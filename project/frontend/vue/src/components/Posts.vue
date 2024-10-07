<script setup>

import { watchEffect, ref } from 'vue';
import Post from './Post.vue';

const props = defineProps({
    postList: {
        type: Array,
        required: true 
    }
});


</script>


<template>

<li v-for="post in postList" >
    <Post :post=post />
</li>

</template>