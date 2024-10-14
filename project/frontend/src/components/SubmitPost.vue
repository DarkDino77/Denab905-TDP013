<script setup>

import * as store from '../store.js';

const userStore = store.loggedInUserStore();
const postModel = defineModel('post');
const errorModel = defineModel('error');

const emit = defineEmits(['newPost']);

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

function sendPost() {
    const trimmed = postModel.value.trim();
    if (messageIsValid(trimmed)) {
        errorModel.value = "";
        
        const request = {
            "message": trimmed,
            "author": userStore.getName()
        };

        fetch(`http://localhost:8080/users/${props.id}/wall`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
        },
            credentials: 'include',
            body: JSON.stringify(request)
        })
        .then(() => {
            postModel.value = "";
            emit('newPost');
        });

    } else {
        errorModel.value = "Invalid message!";
    }
}

</script>

<template>
    <form id="post" v-on:submit.prevent>
        <div class="flex flex-row space-x-2 m-2">
            <textarea 
            v-model="postModel"
            placeholder="Message"
            class = "flex-grow resize-none rounded-xl px-2"></textarea>
            <input @click="sendPost" type="submit" value="Submit" class="button-primary w-fit w-28">
        </div>
    </form>
    <p>{{ errorModel }}</p>
</template>