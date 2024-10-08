<script setup>
import { onMounted, Suspense, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubmitPost from './SubmitPost.vue';
import Posts from './Posts.vue';
import SearchButton from './SearchButton.vue';
import * as store from '../store.js';
import FriendRequestList from './FriendRequestList.vue';
import FriendList from './FriendList.vue';
import * as utils from '../utils.js';
import Wall from './Wall.vue';

const router = useRouter();

defineProps({
    id: {
        type: String,
        required: true
    }
});

let friends = ref([]);

const route = useRoute();
const userStore = store.loggedInUserStore();

async function getFriends() {
    const response = await fetch('http://localhost:8080/friends', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status === 200) {
        friends.value = await response.json();
    } else {
        console.log("error")
    }
}

getFriends()

function logout() {
    fetch('http://localhost:8080/logout', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
    .then(() => {
        userStore.logout();
        router.push('/');
    });
}

</script>

<template>
    <SearchButton />
    <button @click="logout">Logout</button>
    <FriendRequestList @acceptedFriend="getFriends(route.params.id)" />
    <div>
        <Wall :id=route.params.id />
    </div>
    <FriendList :friends=friends />
</template>