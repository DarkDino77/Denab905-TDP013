<script setup>
import { onMounted, Suspense, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SubmitPost from './SubmitPost.vue';
import Posts from './Posts.vue';

import * as store from '../store.js';
import FriendRequestList from './FriendRequestList.vue';
import FriendList from './FriendList.vue';
import * as utils from '../utils.js';
import Wall from './Wall.vue';
import HeaderBar from './HeaderBar.vue';

const router = useRouter();

let friends = ref([]);

const route = useRoute();
const userStore = store.loggedInUserStore();

async function getFriends() {
    friends.value = await utils.getFriends();
}

getFriends()



</script>

<template>
    <div class="flex flex-row items-start ">

        <FriendRequestList @acceptedFriend="getFriends()" class="m-[50px] my-[100px]" />

        <Wall :id=route.params.id class="mx-[50px] w-full " />
        <FriendList :friends="friends" class=" m-[50px] my-[100px]" />
    </div>
</template>