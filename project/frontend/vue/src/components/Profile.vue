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

let friends = ref([]);

const route = useRoute();
const userStore = store.loggedInUserStore();

async function getFriends() {
    friends.value = await utils.getFriends();
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
    <FriendRequestList @acceptedFriend="getFriends()" />
    <div>
        <Wall :id=route.params.id />
    </div>
    <FriendList :friends=friends />
</template>