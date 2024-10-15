<script setup>

import Posts from './Posts.vue';
import SendMessage from './SendMessage.vue';
import { onBeforeUnmount} from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import * as store from '../store.js';

const route = useRoute();
const userStore = store.loggedInUserStore();


const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

function messageIsValid(message) {
    return message.length <= 140 &&
    message.length > 0;
}

const socket = io('http://localhost:8080',{
    withCredentials: true,
    transports: ['websocket'],
    query: {"chatId": route.params.id}
});

socket.on('joinedChat', (chatLog) => {
    messages.value = chatLog;
});

socket.on('message', (msg) => {
    messages.value.push(msg);
})

function sendChatMessage(msg) {
    const trimmed = msg.trim();
    if (!messageIsValid(trimmed)) 
        return;

    const request = {
        "message": trimmed,
        "author": userStore.getName()
    };

    socket.emit('send', request);
}

onBeforeUnmount(() => {
    socket.disconnect();
});

</script>

<template>
    <div class="mx-[30%] bg-navy rounded-xl p-2">
        <SendMessage @clickSend="(msg) => { sendChatMessage(msg) }" :id=route.params.id />
            <div v-if="messages">
            <Posts :postList=messages class="m-2"/>
        </div>
        <div v-else>
            <p>Loading</p>
        </div> 
    </div>

</template>