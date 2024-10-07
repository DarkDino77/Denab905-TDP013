<script setup>
import { onMounted, Suspense, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubmitPost from './SubmitPost.vue';
import Posts from './Posts.vue';
import SearchButton from './SearchButton.vue';

const router = useRouter();

defineProps({
    id: {
        type: String,
        required: true
    }
});

const user = ref('user');

const route = useRoute();

watch(() => route.params.id, fetchUser, { immediate: true });

async function fetchUser(id) {
    const path = `http://localhost:8080/users/${id}`;
    console.log(document.cookie)

    const response = await fetch(path, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status == 200) {
        user.value = await response.json();
    } else {
        // TODO: gör detta på ett mindre dåligt sätt
        router.go(-1);
        return;
    }
    
    console.log(user.value)
}

</script>

<template>
    <SearchButton />
    <div>
        <SubmitPost @newPost="fetchUser(user._id)" :id=user._id />
        <div v-if="user.posts">
            <Posts  :postList=user.posts />
        </div>
        <div v-else>
            <p>Loading</p>
        </div>
    </div>
</template>