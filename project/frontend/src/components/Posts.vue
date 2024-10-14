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

<ul class="space-y-1">
    <li v-for="post in postList">
    <Post :post=post />
</li>
</ul>


</template>