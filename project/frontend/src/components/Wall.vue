<script setup>

import Posts from './Posts.vue';
import SubmitPost from './SubmitPost.vue';
import * as utils from '../utils.js';
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
let user = ref('user');

// defineProps({
//     id: {
//         type: String,
//         required: true
//     }
// });

watch(() => route.params.id, fetchUser, { immediate: true });

async function fetchUser(id) {
    const contents = await utils.fetchUser(id);
    user.value = contents;
}



</script>

<template>

    <div class="mx-[30%] bg-navy rounded-xl p-2"> 

        <SubmitPost @newPost="fetchUser(user._id)" :id=user._id />
        <div v-if="user.posts">
            <Posts :postList=user.posts class="m-2"/>
        </div>
        <div v-else>
            <p>Loading</p>
        </div>
    </div>

</template>