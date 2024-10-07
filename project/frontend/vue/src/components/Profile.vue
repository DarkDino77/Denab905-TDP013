<script setup>
import { onMounted, Suspense, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubmitPost from './SubmitPost.vue';
import Posts from './Posts.vue';
import SearchButton from './SearchButton.vue';
import * as store from '../store.js';
import FriendRequestList from './FriendRequestList.vue';

const router = useRouter();

defineProps({
    id: {
        type: String,
        required: true
    }
});

const user = ref('user');
const route = useRoute();
const userStore = store.loggedInUserStore();


watch(() => route.params.id, fetchUser, { immediate: true });

async function fetchUser(id) {
    const path = `http://localhost:8080/users/${id}`;

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
    
}

function logout() {
    userStore.logout();
    fetch('http://localhost:8080/logout', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
    .then(() => {
        router.push('/');
    });
}

</script>

<template>
    <SearchButton />
    <button @click="logout">Logout</button>
    <FriendRequestList @acceptedFriend="fetchUser(user._id)" :requests=user.friendRequests />
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